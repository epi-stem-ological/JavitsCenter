import type {
  Destination,
  FloorChange,
  GraphEdge,
  GraphNode,
  Id,
  Maneuver,
  NavigationSession,
  Route,
  RouteRequest,
  RouteStep,
  Unsubscribe,
  UserPosition,
  VenueGraph,
  VenuePosition,
} from '@javits/domain';
import type { RoutingProvider } from '../interfaces/RoutingProvider.js';
import type { MockLocationProvider } from './MockLocationProvider.js';
import { seedDestinations, seedGraph } from '@javits/mock-data';

/**
 * MOCK — A* over the seed venue graph.
 *
 * Picks the nearest graph node to the origin as the start node, then builds
 * step-by-step instructions from edge traversals. Floor transitions become a
 * single step with a `FloorChange` payload. Honors `options.accessible`.
 *
 * Production: replaced by Cisco Spaces routing (or a server planner).
 */
export class MockRoutingProvider implements RoutingProvider {
  private readonly graph: VenueGraph;
  private readonly destinations: Map<Id, Destination>;
  private readonly sessions = new Map<Id, NavigationSession>();
  private readonly sessionListeners = new Map<Id, Set<(s: NavigationSession) => void>>();
  private readonly location: MockLocationProvider;

  constructor(location: MockLocationProvider, graph: VenueGraph = seedGraph, dests: Destination[] = seedDestinations) {
    this.location = location;
    this.graph = graph;
    this.destinations = new Map(dests.map((d) => [d.id, d]));
  }

  async planRoute(request: RouteRequest): Promise<Route> {
    const dest = this.destinations.get(request.destinationId);
    if (!dest) throw new Error(`Unknown destination: ${request.destinationId}`);

    const accessible = request.options?.accessible ?? false;
    const speed = request.options?.walkingSpeedMps ?? 1.2;

    const startNode = nearestNode(this.graph, request.origin);
    const endNode = nodeForDestination(this.graph, dest.id) ?? nearestNode(this.graph, dest.position);

    const path = aStar(this.graph, startNode.id, endNode.id, accessible);
    if (!path) {
      // Fallback to a single-step "direct" route so prototype never fails.
      return directFallbackRoute(request.origin, dest, speed);
    }

    const steps = buildSteps(path, this.graph, dest, speed);
    const totalDistance = steps.reduce((a, s) => a + s.distanceMeters, 0);
    const totalDuration = steps.reduce((a, s) => a + s.durationSec, 0);

    const polyline = steps.flatMap((s) => s.polyline);
    const hasFloorChange = steps.some((s) => !!s.floorChange);
    const buildingsCrossed = new Set(steps.map((s) => s.fromPosition.buildingId).concat(dest.buildingId));

    return {
      id: makeId('route'),
      origin: request.origin,
      destinationId: dest.id,
      destination: dest.position,
      steps,
      totalDistanceMeters: Math.round(totalDistance),
      estimatedDurationSec: Math.round(totalDuration),
      hasFloorChange,
      crossesBuildings: buildingsCrossed.size > 1,
      summaryPolyline: polyline,
      generatedAt: Date.now(),
    };
  }

  async startNavigation(route: Route): Promise<NavigationSession> {
    const session: NavigationSession = {
      id: makeId('nav'),
      route,
      state: 'navigating',
      currentStepIndex: 0,
      startedAt: Date.now(),
      lastUpdatedAt: Date.now(),
      remainingDistanceMeters: route.totalDistanceMeters,
      remainingDurationSec: route.estimatedDurationSec,
      offRoute: false,
      rerouteCount: 0,
      progressAlongRoute: 0,
    };
    this.sessions.set(session.id, session);

    // Prototype: drive the blue dot along the route via the location provider.
    this.location.followRoute(route);

    // Subscribe to location updates to advance the session state.
    const unsub = this.location.subscribe((pos: UserPosition) => {
      const s = this.sessions.get(session.id);
      if (!s) {
        unsub();
        return;
      }
      this.updateSessionFromPosition(s, pos);
    });
    // Stash on session so we can clean up in cancelNavigation.
    (session as any).__unsub = unsub;

    this.emit(session);
    return session;
  }

  async getSession(id: Id): Promise<NavigationSession | null> {
    return this.sessions.get(id) ?? null;
  }

  subscribeToSession(id: Id, listener: (s: NavigationSession) => void): Unsubscribe {
    if (!this.sessionListeners.has(id)) this.sessionListeners.set(id, new Set());
    this.sessionListeners.get(id)!.add(listener);
    const s = this.sessions.get(id);
    if (s) queueMicrotask(() => listener(s));
    return () => {
      this.sessionListeners.get(id)?.delete(listener);
    };
  }

  async reroute(sessionId: Id): Promise<Route> {
    const s = this.sessions.get(sessionId);
    if (!s) throw new Error(`Unknown session: ${sessionId}`);
    const current = (await this.location.getCurrentPosition()) ?? s.route.origin as UserPosition;
    const fresh = await this.planRoute({
      origin: {
        buildingId: current.buildingId,
        floorId: current.floorId,
        x: current.x,
        y: current.y,
      },
      destinationId: s.route.destinationId,
    });
    const next: NavigationSession = {
      ...s,
      route: fresh,
      state: 'navigating',
      currentStepIndex: 0,
      offRoute: false,
      rerouteCount: s.rerouteCount + 1,
      remainingDistanceMeters: fresh.totalDistanceMeters,
      remainingDurationSec: fresh.estimatedDurationSec,
      progressAlongRoute: 0,
      lastUpdatedAt: Date.now(),
    };
    this.sessions.set(sessionId, next);
    this.location.followRoute(fresh);
    this.emit(next);
    return fresh;
  }

  async cancelNavigation(sessionId: Id): Promise<void> {
    const s = this.sessions.get(sessionId);
    if (!s) return;
    const unsub = (s as any).__unsub as (() => void) | undefined;
    unsub?.();
    this.location.stopFollowing();
    const next: NavigationSession = { ...s, state: 'cancelled', lastUpdatedAt: Date.now() };
    this.sessions.set(sessionId, next);
    this.emit(next);
  }

  private updateSessionFromPosition(session: NavigationSession, pos: UserPosition): void {
    const route = session.route;
    const total = route.totalDistanceMeters || 1;

    // Walk the steps from the current index forward. A step is considered
    // "passed" when the user is within 3 m of its end on the same floor.
    let stepIdx = session.currentStepIndex;
    let passedDistance = 0;
    for (let i = 0; i < route.steps.length; i++) {
      const step = route.steps[i]!;
      if (i < stepIdx) {
        passedDistance += step.distanceMeters;
        continue;
      }
      const dx = step.toPosition.x - pos.x;
      const dy = step.toPosition.y - pos.y;
      const distToStepEnd = Math.hypot(dx, dy);
      if (distToStepEnd < 3 && pos.floorId === step.toPosition.floorId) {
        passedDistance += step.distanceMeters;
        stepIdx = Math.min(route.steps.length - 1, i + 1);
      } else {
        break;
      }
    }

    const remaining = Math.max(0, total - passedDistance);
    const progress = Math.min(1, 1 - remaining / total);

    const arrived = progress >= 0.995;
    const next: NavigationSession = {
      ...session,
      currentStepIndex: stepIdx,
      remainingDistanceMeters: Math.round(total * (1 - progress)),
      remainingDurationSec: Math.round(route.estimatedDurationSec * (1 - progress)),
      progressAlongRoute: progress,
      state: arrived ? 'arrived' : session.state,
      lastUpdatedAt: Date.now(),
    };
    this.sessions.set(session.id, next);
    this.emit(next);
  }

  private emit(session: NavigationSession): void {
    const set = this.sessionListeners.get(session.id);
    if (!set) return;
    for (const l of set) l(session);
  }
}

// ---------- helpers ----------

function makeId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function nearestNode(graph: VenueGraph, p: VenuePosition): GraphNode {
  let best: GraphNode | null = null;
  let bestD = Infinity;
  for (const n of graph.nodes) {
    if (n.position.floorId !== p.floorId) continue;
    const d = Math.hypot(n.position.x - p.x, n.position.y - p.y);
    if (d < bestD) {
      bestD = d;
      best = n;
    }
  }
  if (!best) {
    // Fallback: any node.
    best = graph.nodes[0]!;
  }
  return best;
}

function nodeForDestination(graph: VenueGraph, destinationId: Id): GraphNode | null {
  return graph.nodes.find((n) => n.destinationId === destinationId) ?? null;
}

function aStar(graph: VenueGraph, startId: Id, goalId: Id, accessible: boolean): GraphNode[] | null {
  const nodes = new Map(graph.nodes.map((n) => [n.id, n]));
  const edges = new Map<Id, GraphEdge[]>();
  for (const e of graph.edges) {
    if (accessible && !e.isAccessible) continue;
    if (!edges.has(e.fromNodeId)) edges.set(e.fromNodeId, []);
    edges.get(e.fromNodeId)!.push(e);
    if (!e.isOneWay) {
      if (!edges.has(e.toNodeId)) edges.set(e.toNodeId, []);
      edges.get(e.toNodeId)!.push({ ...e, fromNodeId: e.toNodeId, toNodeId: e.fromNodeId });
    }
  }

  const start = nodes.get(startId);
  const goal = nodes.get(goalId);
  if (!start || !goal) return null;

  const h = (id: Id) => {
    const a = nodes.get(id)!;
    const floorPenalty = a.position.floorId === goal.position.floorId ? 0 : 20;
    return Math.hypot(a.position.x - goal.position.x, a.position.y - goal.position.y) + floorPenalty;
  };

  const open = new Set<Id>([startId]);
  const cameFrom = new Map<Id, Id>();
  const gScore = new Map<Id, number>([[startId, 0]]);
  const fScore = new Map<Id, number>([[startId, h(startId)]]);

  while (open.size > 0) {
    let currentId: Id | null = null;
    let currentF = Infinity;
    for (const id of open) {
      const f = fScore.get(id) ?? Infinity;
      if (f < currentF) {
        currentF = f;
        currentId = id;
      }
    }
    if (!currentId) break;
    if (currentId === goalId) {
      const path: GraphNode[] = [nodes.get(currentId)!];
      while (cameFrom.has(currentId!)) {
        currentId = cameFrom.get(currentId!)!;
        path.unshift(nodes.get(currentId)!);
      }
      return path;
    }
    open.delete(currentId);
    const neighbors = edges.get(currentId) ?? [];
    for (const edge of neighbors) {
      const tentativeG = (gScore.get(currentId) ?? Infinity) + edge.distanceMeters;
      if (tentativeG < (gScore.get(edge.toNodeId) ?? Infinity)) {
        cameFrom.set(edge.toNodeId, currentId);
        gScore.set(edge.toNodeId, tentativeG);
        fScore.set(edge.toNodeId, tentativeG + h(edge.toNodeId));
        open.add(edge.toNodeId);
      }
    }
  }

  return null;
}

function buildSteps(path: GraphNode[], _graph: VenueGraph, destination: Destination, speed: number): RouteStep[] {
  const steps: RouteStep[] = [];
  if (path.length < 2) {
    steps.push({
      id: makeId('step'),
      index: 0,
      instruction: `Arrive at ${destination.name}`,
      maneuver: 'arrive',
      distanceMeters: 0,
      durationSec: 0,
      fromPosition: path[0]?.position ?? destination.position,
      toPosition: destination.position,
      polyline: [{ x: destination.position.x, y: destination.position.y, floorId: destination.floorId }],
    });
    return steps;
  }

  for (let i = 0; i < path.length - 1; i++) {
    const a = path[i]!;
    const b = path[i + 1]!;
    const sameFloor = a.position.floorId === b.position.floorId;

    if (!sameFloor && a.transition) {
      const change: FloorChange = {
        method: a.transition.method,
        fromFloorId: a.position.floorId,
        toFloorId: b.position.floorId,
        transitionNodeId: a.id,
        isAccessible: a.transition.isAccessible,
      };
      const maneuver: Maneuver =
        change.method === 'elevator'
          ? 'take_elevator'
          : change.method === 'escalator'
            ? 'take_escalator'
            : change.method === 'stairs'
              ? 'take_stairs'
              : 'enter_building';
      steps.push({
        id: makeId('step'),
        index: steps.length,
        instruction: transitionInstruction(change),
        maneuver,
        distanceMeters: change.method === 'bridge' ? 30 : 8,
        durationSec: change.method === 'bridge' ? 25 : 30,
        fromPosition: a.position,
        toPosition: b.position,
        polyline: [
          { x: a.position.x, y: a.position.y, floorId: a.position.floorId },
          { x: b.position.x, y: b.position.y, floorId: b.position.floorId },
        ],
        floorChange: change,
      });
      continue;
    }

    const dist = Math.hypot(b.position.x - a.position.x, b.position.y - a.position.y);
    const prev = path[i - 1];
    const maneuver = i === 0 ? 'depart' : computeManeuver(prev?.position, a.position, b.position);
    const instruction = instructionFor(maneuver, Math.round(dist), b.landmark);

    steps.push({
      id: makeId('step'),
      index: steps.length,
      instruction,
      maneuver,
      distanceMeters: dist,
      durationSec: dist / speed,
      fromPosition: a.position,
      toPosition: b.position,
      polyline: [
        { x: a.position.x, y: a.position.y, floorId: a.position.floorId },
        { x: b.position.x, y: b.position.y, floorId: b.position.floorId },
      ],
      landmarks: b.landmark ? [b.landmark] : undefined,
    });
  }

  steps.push({
    id: makeId('step'),
    index: steps.length,
    instruction: `Arrive at ${destination.name}`,
    maneuver: 'arrive',
    distanceMeters: 0,
    durationSec: 0,
    fromPosition: path[path.length - 1]!.position,
    toPosition: destination.position,
    polyline: [
      {
        x: destination.position.x,
        y: destination.position.y,
        floorId: destination.floorId,
      },
    ],
  });

  return steps;
}

function computeManeuver(
  prev: VenuePosition | undefined,
  here: VenuePosition,
  next: VenuePosition
): Maneuver {
  if (!prev) return 'straight';
  const ax = here.x - prev.x;
  const ay = here.y - prev.y;
  const bx = next.x - here.x;
  const by = next.y - here.y;
  const cross = ax * by - ay * bx;
  const dot = ax * bx + ay * by;
  const angle = (Math.atan2(cross, dot) * 180) / Math.PI;
  if (angle > 30 && angle <= 60) return 'slight_left';
  if (angle > 60 && angle <= 120) return 'turn_left';
  if (angle > 120) return 'sharp_left';
  if (angle < -30 && angle >= -60) return 'slight_right';
  if (angle < -60 && angle >= -120) return 'turn_right';
  if (angle < -120) return 'sharp_right';
  return 'straight';
}

function instructionFor(m: Maneuver, dist: number, landmark?: string): string {
  const tail = landmark ? ` at ${landmark}` : '';
  switch (m) {
    case 'depart':
      return `Head out for ${dist} m${tail}`;
    case 'straight':
      return `Continue straight ${dist} m${tail}`;
    case 'slight_left':
      return `Bear left${tail}`;
    case 'turn_left':
      return `Turn left${tail}`;
    case 'sharp_left':
      return `Sharp left${tail}`;
    case 'slight_right':
      return `Bear right${tail}`;
    case 'turn_right':
      return `Turn right${tail}`;
    case 'sharp_right':
      return `Sharp right${tail}`;
    case 'uturn':
      return `Make a U-turn${tail}`;
    case 'arrive':
      return `You've arrived`;
    default:
      return `Continue ${dist} m`;
  }
}

function transitionInstruction(change: FloorChange): string {
  if (change.method === 'bridge') {
    return `Cross the bridge to the next building`;
  }
  const m =
    change.method === 'elevator'
      ? 'elevator'
      : change.method === 'escalator'
        ? 'escalator'
        : 'stairs';
  const floorLabel = change.toFloorId.split('_').pop() ?? 'the next floor';
  return `Take the ${m} to ${floorLabel.toUpperCase()}`;
}

function directFallbackRoute(origin: VenuePosition, dest: Destination, speed: number): Route {
  const dx = dest.position.x - origin.x;
  const dy = dest.position.y - origin.y;
  const dist = Math.hypot(dx, dy);
  const step: RouteStep = {
    id: makeId('step'),
    index: 0,
    instruction: `Head directly to ${dest.name}`,
    maneuver: 'straight',
    distanceMeters: dist,
    durationSec: dist / speed,
    fromPosition: origin,
    toPosition: dest.position,
    polyline: [
      { x: origin.x, y: origin.y, floorId: origin.floorId },
      { x: dest.position.x, y: dest.position.y, floorId: dest.floorId },
    ],
  };
  return {
    id: makeId('route'),
    origin,
    destinationId: dest.id,
    destination: dest.position,
    steps: [step],
    totalDistanceMeters: Math.round(dist),
    estimatedDurationSec: Math.round(dist / speed),
    hasFloorChange: origin.floorId !== dest.floorId,
    crossesBuildings: origin.buildingId !== dest.buildingId,
    summaryPolyline: step.polyline,
    generatedAt: Date.now(),
  };
}

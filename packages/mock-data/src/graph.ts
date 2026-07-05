import type { VenueGraph, GraphNode, GraphEdge } from '@javits/domain';

/**
 * Seed venue graph — SAMPLE DATA matching the Javits-flavored destinations.
 *
 * Invariants:
 *  - Every navigable Destination has a node with `destinationId` set.
 *  - Floor transitions are node pairs at the same (x,y) on different floors,
 *    joined by a transition edge. Escalators are NOT accessible (step-free
 *    routing excludes them); elevators are; the staff corridor bridge to
 *    Javits North is level and accessible.
 */

const n = (node: GraphNode): GraphNode => node;
const e = (edge: GraphEdge): GraphEdge => edge;

// ---------- nodes ----------

const nodes: GraphNode[] = [
  // ===== Main · Level 1 =====
  n({ id: 'm1_entrance_cp', type: 'entrance', destinationId: 'dest_crystal_palace_entrance',
      position: { buildingId: 'bldg_main', floorId: 'floor_main_l1', x: -100, y: 0 }, landmark: 'Crystal Palace Entrance' }),
  n({ id: 'm1_subway', type: 'destination', destinationId: 'dest_subway_hudson_yards',
      position: { buildingId: 'bldg_main', floorId: 'floor_main_l1', x: -115, y: 0 } }),
  n({ id: 'm1_taxi', type: 'destination', destinationId: 'dest_taxi_stand',
      position: { buildingId: 'bldg_main', floorId: 'floor_main_l1', x: -105, y: -30 } }),
  n({ id: 'm1_rideshare', type: 'destination', destinationId: 'dest_rideshare_pickup',
      position: { buildingId: 'bldg_main', floorId: 'floor_main_l1', x: -105, y: 30 } }),
  n({ id: 'm1_lobby_j', type: 'junction',
      position: { buildingId: 'bldg_main', floorId: 'floor_main_l1', x: -60, y: 0 }, landmark: 'Crystal Palace Lobby' }),
  n({ id: 'm1_reg', type: 'destination', destinationId: 'dest_registration',
      position: { buildingId: 'bldg_main', floorId: 'floor_main_l1', x: -40, y: -40 } }),
  n({ id: 'm1_coat', type: 'destination', destinationId: 'dest_coat_check',
      position: { buildingId: 'bldg_main', floorId: 'floor_main_l1', x: -40, y: 40 } }),
  n({ id: 'm1_access_svc', type: 'destination', destinationId: 'dest_accessibility_services',
      position: { buildingId: 'bldg_main', floorId: 'floor_main_l1', x: -20, y: 40 } }),
  n({ id: 'm1_escalator', type: 'transition', destinationId: 'dest_escalator_main',
      position: { buildingId: 'bldg_main', floorId: 'floor_main_l1', x: -20, y: 0 },
      transition: { method: 'escalator', connectsFloorIds: ['floor_main_l1', 'floor_main_l3'], isAccessible: false } }),
  n({ id: 'm1_mid_j', type: 'junction',
      position: { buildingId: 'bldg_main', floorId: 'floor_main_l1', x: 10, y: 0 } }),
  n({ id: 'm1_restroom', type: 'destination', destinationId: 'dest_restroom_main_l1',
      position: { buildingId: 'bldg_main', floorId: 'floor_main_l1', x: 20, y: 30 } }),
  n({ id: 'm1_elevator', type: 'transition', destinationId: 'dest_elevator_main',
      position: { buildingId: 'bldg_main', floorId: 'floor_main_l1', x: 50, y: 0 },
      transition: { method: 'elevator', connectsFloorIds: ['floor_main_l1', 'floor_main_l3', 'floor_main_l4'], isAccessible: true } }),
  n({ id: 'm1_bridge', type: 'transition',
      position: { buildingId: 'bldg_main', floorId: 'floor_main_l1', x: 110, y: 0 },
      transition: { method: 'bridge', connectsFloorIds: ['floor_main_l1', 'floor_north_l1'], isAccessible: true } }),

  // ===== Main · Level 3 =====
  n({ id: 'm3_escalator', type: 'transition',
      position: { buildingId: 'bldg_main', floorId: 'floor_main_l3', x: -20, y: 0 },
      transition: { method: 'escalator', connectsFloorIds: ['floor_main_l1', 'floor_main_l3'], isAccessible: false } }),
  n({ id: 'm3_elevator', type: 'transition',
      position: { buildingId: 'bldg_main', floorId: 'floor_main_l3', x: 50, y: 0 },
      transition: { method: 'elevator', connectsFloorIds: ['floor_main_l1', 'floor_main_l3', 'floor_main_l4'], isAccessible: true } }),
  n({ id: 'm3_mid_j', type: 'junction',
      position: { buildingId: 'bldg_main', floorId: 'floor_main_l3', x: 10, y: 0 }, landmark: 'Level 3 Concourse' }),
  n({ id: 'm3_food', type: 'destination', destinationId: 'dest_food_court',
      position: { buildingId: 'bldg_main', floorId: 'floor_main_l3', x: 0, y: -30 }, landmark: 'Food Court' }),
  n({ id: 'm3_restroom', type: 'destination', destinationId: 'dest_restroom_main_l3',
      position: { buildingId: 'bldg_main', floorId: 'floor_main_l3', x: 20, y: 30 } }),
  n({ id: 'm3_exh_desk', type: 'destination', destinationId: 'dest_exhibitor_service_desk',
      position: { buildingId: 'bldg_main', floorId: 'floor_main_l3', x: -40, y: 30 } }),
  n({ id: 'm3_tech_desk', type: 'destination', destinationId: 'dest_tech_solutions_desk',
      position: { buildingId: 'bldg_main', floorId: 'floor_main_l3', x: -40, y: -30 } }),
  n({ id: 'm3_hall_3a', type: 'destination', destinationId: 'dest_hall_3a',
      position: { buildingId: 'bldg_main', floorId: 'floor_main_l3', x: 60, y: -40 }, landmark: 'Hall 3A entrance' }),
  n({ id: 'm3_hall_3b', type: 'destination', destinationId: 'dest_hall_3b',
      position: { buildingId: 'bldg_main', floorId: 'floor_main_l3', x: 60, y: 40 }, landmark: 'Hall 3B entrance' }),
  n({ id: 'm3_booth_1845', type: 'destination', destinationId: 'dest_booth_1845',
      position: { buildingId: 'bldg_main', floorId: 'floor_main_l3', x: 80, y: -60 } }),
  n({ id: 'm3_booth_3481', type: 'destination', destinationId: 'dest_booth_3481',
      position: { buildingId: 'bldg_main', floorId: 'floor_main_l3', x: 80, y: 60 } }),

  // ===== Main · Level 4 =====
  n({ id: 'm4_elevator', type: 'transition',
      position: { buildingId: 'bldg_main', floorId: 'floor_main_l4', x: 50, y: 0 },
      transition: { method: 'elevator', connectsFloorIds: ['floor_main_l1', 'floor_main_l3', 'floor_main_l4'], isAccessible: true } }),
  n({ id: 'm4_j', type: 'junction',
      position: { buildingId: 'bldg_main', floorId: 'floor_main_l4', x: 0, y: 0 }, landmark: 'Level 4 landing' }),
  n({ id: 'm4_room_409', type: 'destination', destinationId: 'dest_room_409',
      position: { buildingId: 'bldg_main', floorId: 'floor_main_l4', x: -40, y: 30 } }),
  n({ id: 'm4_river', type: 'destination', destinationId: 'dest_river_pavilion',
      position: { buildingId: 'bldg_main', floorId: 'floor_main_l4', x: 60, y: -40 } }),
  n({ id: 'm4_special', type: 'destination', destinationId: 'dest_special_events_hall',
      position: { buildingId: 'bldg_main', floorId: 'floor_main_l4', x: -40, y: -40 } }),

  // ===== Javits North · Level 1 (staff) =====
  n({ id: 'n1_bridge', type: 'transition',
      position: { buildingId: 'bldg_north', floorId: 'floor_north_l1', x: -110, y: 0 },
      transition: { method: 'bridge', connectsFloorIds: ['floor_main_l1', 'floor_north_l1'], isAccessible: true } }),
  n({ id: 'n1_corridor_j', type: 'junction',
      position: { buildingId: 'bldg_north', floorId: 'floor_north_l1', x: -60, y: 0 }, landmark: 'Service Corridor' }),
  n({ id: 'n1_loading', type: 'destination', destinationId: 'dest_loading_dock',
      position: { buildingId: 'bldg_north', floorId: 'floor_north_l1', x: 0, y: -40 } }),
  n({ id: 'n1_command', type: 'destination', destinationId: 'dest_command_center',
      position: { buildingId: 'bldg_north', floorId: 'floor_north_l1', x: 0, y: 40 } }),
];

// ---------- edges ----------

function dist(a: string, b: string): number {
  const na = nodes.find((x) => x.id === a)!;
  const nb = nodes.find((x) => x.id === b)!;
  return Math.hypot(na.position.x - nb.position.x, na.position.y - nb.position.y);
}

function walk(from: string, to: string, accessible = true): GraphEdge {
  return e({ id: `edge_${from}__${to}`, fromNodeId: from, toNodeId: to, distanceMeters: dist(from, to), isAccessible: accessible, isOneWay: false });
}

function transition(from: string, to: string, accessible: boolean): GraphEdge {
  const isBridge =
    nodes.find((x) => x.id === from)?.transition?.method === 'bridge' &&
    nodes.find((x) => x.id === to)?.transition?.method === 'bridge';
  return e({
    id: `edge_${from}__${to}`,
    fromNodeId: from,
    toNodeId: to,
    distanceMeters: isBridge ? 30 : 8,
    isAccessible: accessible,
    isOneWay: false,
  });
}

const edges: GraphEdge[] = [
  // Main L1 — lobby and transport
  walk('m1_subway', 'm1_entrance_cp'),
  walk('m1_taxi', 'm1_entrance_cp'),
  walk('m1_rideshare', 'm1_entrance_cp'),
  walk('m1_entrance_cp', 'm1_lobby_j'),
  walk('m1_lobby_j', 'm1_reg'),
  walk('m1_lobby_j', 'm1_coat'),
  walk('m1_coat', 'm1_access_svc'),
  walk('m1_lobby_j', 'm1_escalator'),
  walk('m1_escalator', 'm1_mid_j'),
  walk('m1_mid_j', 'm1_restroom'),
  walk('m1_mid_j', 'm1_elevator'),
  walk('m1_elevator', 'm1_bridge'),

  // Main L1 <-> L3: escalator (not step-free) and elevator (accessible)
  transition('m1_escalator', 'm3_escalator', false),
  transition('m1_elevator', 'm3_elevator', true),

  // Main L3 — concourse, halls, services
  walk('m3_escalator', 'm3_mid_j'),
  walk('m3_mid_j', 'm3_elevator'),
  walk('m3_mid_j', 'm3_food'),
  walk('m3_mid_j', 'm3_restroom'),
  walk('m3_escalator', 'm3_exh_desk'),
  walk('m3_food', 'm3_tech_desk'),
  walk('m3_elevator', 'm3_hall_3a'),
  walk('m3_elevator', 'm3_hall_3b'),
  walk('m3_hall_3a', 'm3_booth_1845'),
  walk('m3_hall_3b', 'm3_booth_3481'),

  // Main L3 <-> L4 via elevator
  transition('m3_elevator', 'm4_elevator', true),

  // Main L4 — pavilion and meeting rooms
  walk('m4_elevator', 'm4_j'),
  walk('m4_elevator', 'm4_river'),
  walk('m4_j', 'm4_room_409'),
  walk('m4_j', 'm4_special'),

  // Main L1 <-> Javits North via staff corridor bridge
  transition('m1_bridge', 'n1_bridge', true),

  // Javits North L1
  walk('n1_bridge', 'n1_corridor_j'),
  walk('n1_corridor_j', 'n1_loading'),
  walk('n1_corridor_j', 'n1_command'),
];

export const seedGraph: VenueGraph = {
  venueId: 'venue_javits',
  nodes,
  edges,
};

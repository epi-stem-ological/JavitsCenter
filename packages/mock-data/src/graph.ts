import type { VenueGraph, GraphNode, GraphEdge } from '@javits/domain';

/**
 * Seed venue graph. Wires destinations + junctions + transitions with edges
 * so that A* can produce multi-floor and multi-building routes.
 *
 * Invariants:
 *  - Every `Destination` that users can navigate to has a node with
 *    `destinationId` set.
 *  - Floor transitions (elevator/stairs) are modeled as two nodes at the same
 *    (x,y) on different floors, connected by a single edge. The `transition`
 *    on the node identifies the method and accessibility.
 *  - A single "bridge" connects North L1 to South L1 via a transition pair.
 */

const n = (node: GraphNode): GraphNode => node;
const e = (edge: GraphEdge): GraphEdge => edge;

// ---------- nodes ----------

const nodes: GraphNode[] = [
  // ===== North L1 =====
  n({ id: 'n_entrance_n', type: 'entrance', destinationId: 'dest_north_entrance',
      position: { buildingId: 'bldg_north', floorId: 'floor_north_l1', x: -100, y: 0 } }),
  n({ id: 'n_l1_lobby_j', type: 'junction',
      position: { buildingId: 'bldg_north', floorId: 'floor_north_l1', x: -60, y: 0 }, landmark: 'North Lobby' }),
  n({ id: 'n_reg', type: 'destination', destinationId: 'dest_registration',
      position: { buildingId: 'bldg_north', floorId: 'floor_north_l1', x: -40, y: -40 } }),
  n({ id: 'n_help_n', type: 'destination', destinationId: 'dest_help_desk_n',
      position: { buildingId: 'bldg_north', floorId: 'floor_north_l1', x: -40, y: 40 } }),
  n({ id: 'n_stairs_l1', type: 'transition',
      position: { buildingId: 'bldg_north', floorId: 'floor_north_l1', x: -20, y: 0 },
      transition: { method: 'stairs', connectsFloorIds: ['floor_north_l1', 'floor_north_l2'], isAccessible: false } }),
  n({ id: 'n_cafe_42', type: 'destination', destinationId: 'dest_cafe_42',
      position: { buildingId: 'bldg_north', floorId: 'floor_north_l1', x: 0, y: -20 }, landmark: 'Café 42' }),
  n({ id: 'n_l1_mid_j', type: 'junction',
      position: { buildingId: 'bldg_north', floorId: 'floor_north_l1', x: 10, y: 0 } }),
  n({ id: 'n_restroom_l1', type: 'destination', destinationId: 'dest_restroom_n_l1',
      position: { buildingId: 'bldg_north', floorId: 'floor_north_l1', x: 20, y: 30 } }),
  n({ id: 'n_elev_l1', type: 'transition', destinationId: 'dest_elev_n_l1',
      position: { buildingId: 'bldg_north', floorId: 'floor_north_l1', x: 50, y: 0 },
      transition: { method: 'elevator', connectsFloorIds: ['floor_north_l1', 'floor_north_l2', 'floor_north_l4'], isAccessible: true } }),
  n({ id: 'n_hall_a', type: 'destination', destinationId: 'dest_hall_a',
      position: { buildingId: 'bldg_north', floorId: 'floor_north_l1', x: 60, y: -40 } }),
  n({ id: 'n_hall_b', type: 'destination', destinationId: 'dest_hall_b',
      position: { buildingId: 'bldg_north', floorId: 'floor_north_l1', x: 60, y: 40 } }),
  n({ id: 'n_booth_3481', type: 'destination', destinationId: 'dest_booth_3481',
      position: { buildingId: 'bldg_north', floorId: 'floor_north_l1', x: 80, y: -60 } }),
  n({ id: 'n_exit_n', type: 'destination', destinationId: 'dest_exit_n',
      position: { buildingId: 'bldg_north', floorId: 'floor_north_l1', x: 100, y: -75 } }),
  n({ id: 'n_bridge_n', type: 'transition',
      position: { buildingId: 'bldg_north', floorId: 'floor_north_l1', x: 110, y: 0 },
      transition: { method: 'bridge', connectsFloorIds: ['floor_north_l1', 'floor_south_l1'], isAccessible: true } }),

  // ===== North L2 =====
  n({ id: 'n_stairs_l2', type: 'transition',
      position: { buildingId: 'bldg_north', floorId: 'floor_north_l2', x: -20, y: 0 },
      transition: { method: 'stairs', connectsFloorIds: ['floor_north_l1', 'floor_north_l2'], isAccessible: false } }),
  n({ id: 'n_elev_l2', type: 'transition',
      position: { buildingId: 'bldg_north', floorId: 'floor_north_l2', x: 50, y: 0 },
      transition: { method: 'elevator', connectsFloorIds: ['floor_north_l1', 'floor_north_l2', 'floor_north_l4'], isAccessible: true } }),
  n({ id: 'n_l2_j', type: 'junction',
      position: { buildingId: 'bldg_north', floorId: 'floor_north_l2', x: 10, y: 0 } }),
  n({ id: 'n_food', type: 'destination', destinationId: 'dest_food_court',
      position: { buildingId: 'bldg_north', floorId: 'floor_north_l2', x: 0, y: -20 } }),
  n({ id: 'n_sbux', type: 'destination', destinationId: 'dest_starbucks',
      position: { buildingId: 'bldg_north', floorId: 'floor_north_l2', x: -30, y: -40 } }),
  n({ id: 'n_lounge', type: 'destination', destinationId: 'dest_lounge',
      position: { buildingId: 'bldg_north', floorId: 'floor_north_l2', x: 30, y: 40 } }),
  n({ id: 'n_restroom_l2', type: 'destination', destinationId: 'dest_restroom_n_l2',
      position: { buildingId: 'bldg_north', floorId: 'floor_north_l2', x: 20, y: 30 } }),

  // ===== North L4 =====
  n({ id: 'n_elev_l4', type: 'transition',
      position: { buildingId: 'bldg_north', floorId: 'floor_north_l4', x: 50, y: 0 },
      transition: { method: 'elevator', connectsFloorIds: ['floor_north_l1', 'floor_north_l2', 'floor_north_l4'], isAccessible: true } }),
  n({ id: 'n_l4_j', type: 'junction',
      position: { buildingId: 'bldg_north', floorId: 'floor_north_l4', x: 0, y: 0 } }),
  n({ id: 'n_l4_j_west', type: 'junction',
      position: { buildingId: 'bldg_north', floorId: 'floor_north_l4', x: -30, y: 20 } }),
  n({ id: 'n_l4_j_east', type: 'junction',
      position: { buildingId: 'bldg_north', floorId: 'floor_north_l4', x: 40, y: 20 } }),
  n({ id: 'n_room_402', type: 'destination', destinationId: 'dest_room_402',
      position: { buildingId: 'bldg_north', floorId: 'floor_north_l4', x: -40, y: 30 } }),
  n({ id: 'n_room_411', type: 'destination', destinationId: 'dest_room_411',
      position: { buildingId: 'bldg_north', floorId: 'floor_north_l4', x: 40, y: 30 } }),
  n({ id: 'n_room_415', type: 'destination', destinationId: 'dest_room_415',
      position: { buildingId: 'bldg_north', floorId: 'floor_north_l4', x: 80, y: -30 } }),

  // ===== South L1 =====
  n({ id: 's_bridge_s', type: 'transition',
      position: { buildingId: 'bldg_south', floorId: 'floor_south_l1', x: -110, y: 0 },
      transition: { method: 'bridge', connectsFloorIds: ['floor_north_l1', 'floor_south_l1'], isAccessible: true } }),
  n({ id: 's_entrance', type: 'entrance', destinationId: 'dest_south_entrance',
      position: { buildingId: 'bldg_south', floorId: 'floor_south_l1', x: -100, y: 0 } }),
  n({ id: 's_lobby_j', type: 'junction',
      position: { buildingId: 'bldg_south', floorId: 'floor_south_l1', x: -60, y: 0 }, landmark: 'South Lobby' }),
  n({ id: 's_corridor_j', type: 'junction',
      position: { buildingId: 'bldg_south', floorId: 'floor_south_l1', x: 0, y: 0 } }),
  n({ id: 's_restroom', type: 'destination', destinationId: 'dest_restroom_s_l1',
      position: { buildingId: 'bldg_south', floorId: 'floor_south_l1', x: 20, y: 40 } }),
  n({ id: 's_hall_s', type: 'destination', destinationId: 'dest_hall_s',
      position: { buildingId: 'bldg_south', floorId: 'floor_south_l1', x: 40, y: 0 } }),
  n({ id: 's_elev_l1', type: 'transition',
      position: { buildingId: 'bldg_south', floorId: 'floor_south_l1', x: 60, y: 0 },
      transition: { method: 'elevator', connectsFloorIds: ['floor_south_l1', 'floor_south_l2'], isAccessible: true } }),
  n({ id: 's_booth_4512', type: 'destination', destinationId: 'dest_booth_4512',
      position: { buildingId: 'bldg_south', floorId: 'floor_south_l1', x: 70, y: -20 } }),

  // ===== South L2 =====
  n({ id: 's_elev_l2', type: 'transition',
      position: { buildingId: 'bldg_south', floorId: 'floor_south_l2', x: 60, y: 0 },
      transition: { method: 'elevator', connectsFloorIds: ['floor_south_l1', 'floor_south_l2'], isAccessible: true } }),
  n({ id: 's_press_j', type: 'junction',
      position: { buildingId: 'bldg_south', floorId: 'floor_south_l2', x: 20, y: 0 } }),
  n({ id: 's_press', type: 'destination', destinationId: 'dest_press_center',
      position: { buildingId: 'bldg_south', floorId: 'floor_south_l2', x: 0, y: 0 } }),
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
  // Distance set to 8 m to approximate elevator/stairs traversal; 30 m for bridge.
  const bothBridge =
    nodes.find((n) => n.id === from)?.transition?.method === 'bridge' &&
    nodes.find((n) => n.id === to)?.transition?.method === 'bridge';
  return e({
    id: `edge_${from}__${to}`,
    fromNodeId: from,
    toNodeId: to,
    distanceMeters: bothBridge ? 30 : 8,
    isAccessible: accessible,
    isOneWay: false,
  });
}

const edges: GraphEdge[] = [
  // North L1 backbone
  walk('n_entrance_n', 'n_l1_lobby_j'),
  walk('n_l1_lobby_j', 'n_reg'),
  walk('n_l1_lobby_j', 'n_help_n'),
  walk('n_l1_lobby_j', 'n_stairs_l1', false), // stairs not accessible
  walk('n_stairs_l1', 'n_l1_mid_j', false),
  walk('n_l1_lobby_j', 'n_cafe_42'),
  walk('n_cafe_42', 'n_l1_mid_j'),
  walk('n_l1_mid_j', 'n_restroom_l1'),
  walk('n_l1_mid_j', 'n_elev_l1'),
  walk('n_elev_l1', 'n_hall_a'),
  walk('n_elev_l1', 'n_hall_b'),
  walk('n_hall_a', 'n_booth_3481'),
  walk('n_hall_a', 'n_exit_n'),
  walk('n_elev_l1', 'n_bridge_n'),

  // North L1 <-> L2 via elevator (accessible) and stairs (not accessible)
  transition('n_elev_l1', 'n_elev_l2', true),
  transition('n_stairs_l1', 'n_stairs_l2', false),

  // North L2 backbone
  walk('n_elev_l2', 'n_l2_j'),
  walk('n_stairs_l2', 'n_l2_j', false),
  walk('n_l2_j', 'n_food'),
  walk('n_food', 'n_sbux'),
  walk('n_l2_j', 'n_lounge'),
  walk('n_l2_j', 'n_restroom_l2'),

  // North L2 <-> L4 via elevator
  transition('n_elev_l2', 'n_elev_l4', true),

  // North L4 backbone
  walk('n_elev_l4', 'n_l4_j'),
  walk('n_l4_j', 'n_l4_j_west'),
  walk('n_l4_j', 'n_l4_j_east'),
  walk('n_l4_j_west', 'n_room_402'),
  walk('n_l4_j_east', 'n_room_411'),
  walk('n_elev_l4', 'n_room_415'),

  // North L1 <-> South L1 via bridge
  transition('n_bridge_n', 's_bridge_s', true),

  // South L1 backbone
  walk('s_bridge_s', 's_corridor_j'),
  walk('s_entrance', 's_lobby_j'),
  walk('s_lobby_j', 's_corridor_j'),
  walk('s_corridor_j', 's_restroom'),
  walk('s_corridor_j', 's_hall_s'),
  walk('s_hall_s', 's_elev_l1'),
  walk('s_hall_s', 's_booth_4512'),

  // South L1 <-> L2 via elevator
  transition('s_elev_l1', 's_elev_l2', true),

  // South L2 backbone
  walk('s_elev_l2', 's_press_j'),
  walk('s_press_j', 's_press'),
];

export const seedGraph: VenueGraph = {
  venueId: 'venue_javits',
  nodes,
  edges,
};

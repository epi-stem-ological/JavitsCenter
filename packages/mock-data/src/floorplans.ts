import type { FloorplanAsset } from '@javits/domain';

/**
 * Placeholder floor plan asset descriptors. In production, `uri` resolves to
 * a real floor plan (vector tiles, SVG, or a native map layer handle).
 * In the prototype, the UI draws simple geometry from the floor bounds and
 * graph — these `uri`s are not loaded. Included so the shape of the asset
 * descriptor is exercised by the provider contract.
 */
export const seedFloorplanAssets: FloorplanAsset[] = [
  {
    floorId: 'floor_north_l1',
    kind: 'svg',
    uri: 'mock://floorplan/north/l1.svg',
    bounds: { min: { x: -120, y: -80 }, max: { x: 120, y: 80 } },
  },
  {
    floorId: 'floor_north_l2',
    kind: 'svg',
    uri: 'mock://floorplan/north/l2.svg',
    bounds: { min: { x: -120, y: -80 }, max: { x: 120, y: 80 } },
  },
  {
    floorId: 'floor_north_l4',
    kind: 'svg',
    uri: 'mock://floorplan/north/l4.svg',
    bounds: { min: { x: -120, y: -80 }, max: { x: 120, y: 80 } },
  },
  {
    floorId: 'floor_south_l1',
    kind: 'svg',
    uri: 'mock://floorplan/south/l1.svg',
    bounds: { min: { x: -120, y: -80 }, max: { x: 120, y: 80 } },
  },
  {
    floorId: 'floor_south_l2',
    kind: 'svg',
    uri: 'mock://floorplan/south/l2.svg',
    bounds: { min: { x: -120, y: -80 }, max: { x: 120, y: 80 } },
  },
];

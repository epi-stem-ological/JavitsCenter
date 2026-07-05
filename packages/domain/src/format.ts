export type Units = 'metric' | 'imperial';

const FEET_PER_METER = 3.28084;

/**
 * Human distance label. Internal geometry is always meters; display defaults
 * to imperial for a US venue ("220 ft", "0.3 mi").
 */
export function formatDistance(meters: number, units: Units = 'imperial'): string {
  if (units === 'metric') {
    if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
    return `${Math.round(meters)} m`;
  }
  const feet = meters * FEET_PER_METER;
  if (feet >= 1000) return `${(feet / 5280).toFixed(1)} mi`;
  // Round to the nearest 5 ft — false precision reads as noise while walking.
  return `${Math.max(5, Math.round(feet / 5) * 5)} ft`;
}

/** "3 min" — never shows less than 1 minute. */
export function formatWalkTime(durationSec: number): string {
  return `${Math.max(1, Math.round(durationSec / 60))} min`;
}

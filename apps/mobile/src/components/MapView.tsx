import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Circle, G, Path, Rect } from 'react-native-svg';
import type { Floor, Route, UserPosition, VenuePosition } from '@javits/domain';
import { useTheme } from '../design/ThemeProvider';

/**
 * MOCK — a minimal SVG map renderer. Draws:
 *   - floor bounds as a rectangle (represents the floor plan body)
 *   - the route polyline (origin-floor segments only, for simplicity)
 *   - origin, destination, and user markers
 *
 * Production: swap with a native map view driven by the `MapProvider`.
 * No production logic here; this is a placeholder suitable for demos.
 */
export function MapView({
  floor,
  route,
  origin,
  destination,
  userPosition,
  width,
  height,
}: {
  floor: Floor;
  route?: Route;
  origin?: VenuePosition;
  destination?: VenuePosition;
  userPosition?: UserPosition | null;
  width: number;
  height: number;
}) {
  const t = useTheme();
  const { toSvg, bounds } = useMemo(() => {
    const b = floor.bounds;
    const pad = 8;
    const w = b.max.x - b.min.x + pad * 2;
    const h = b.max.y - b.min.y + pad * 2;
    const sx = width / w;
    const sy = height / h;
    const s = Math.min(sx, sy);
    const offsetX = (width - (b.max.x - b.min.x) * s) / 2 - b.min.x * s;
    const offsetY = (height - (b.max.y - b.min.y) * s) / 2 - b.min.y * s;
    return {
      bounds: b,
      toSvg: (x: number, y: number) => ({ x: x * s + offsetX, y: -y * s + height - offsetY + b.min.y * s * 2 }),
    };
  }, [floor.bounds, width, height]);

  // Build route path for current floor.
  const routePath = useMemo(() => {
    if (!route) return null;
    const floorPts = route.summaryPolyline.filter((p) => p.floorId === floor.id);
    if (floorPts.length < 2) return null;
    const parts = floorPts.map((p, i) => {
      const s = toSvg(p.x, p.y);
      return `${i === 0 ? 'M' : 'L'} ${s.x.toFixed(1)} ${s.y.toFixed(1)}`;
    });
    return parts.join(' ');
  }, [route, floor.id, toSvg]);

  const bgRect = toSvg(bounds.min.x, bounds.min.y);
  const bgRectMax = toSvg(bounds.max.x, bounds.max.y);

  return (
    <View style={{ width, height, backgroundColor: t.color.bg.sunken, borderRadius: t.radius.md, overflow: 'hidden' }}>
      <Svg width={width} height={height}>
        {/* Floor body */}
        <Rect
          x={Math.min(bgRect.x, bgRectMax.x)}
          y={Math.min(bgRect.y, bgRectMax.y)}
          width={Math.abs(bgRectMax.x - bgRect.x)}
          height={Math.abs(bgRectMax.y - bgRect.y)}
          fill={t.color.bg.raised}
          stroke={t.color.line}
          strokeWidth={1}
          rx={8}
        />

        {/* Route polyline */}
        {routePath ? (
          <Path
            d={routePath}
            stroke={t.color.accent.primary}
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity={0.9}
          />
        ) : null}

        {/* Origin marker */}
        {origin && origin.floorId === floor.id ? (
          <Marker p={toSvg(origin.x, origin.y)} color={t.color.fg.secondary} label="origin" />
        ) : null}

        {/* Destination marker */}
        {destination && destination.floorId === floor.id ? (
          <DestinationPin p={toSvg(destination.x, destination.y)} color={t.color.status.danger} />
        ) : null}

        {/* User blue dot */}
        {userPosition && userPosition.floorId === floor.id ? (
          <G>
            <Circle cx={toSvg(userPosition.x, userPosition.y).x} cy={toSvg(userPosition.x, userPosition.y).y} r={14} fill={t.color.accent.primary} opacity={0.2} />
            <Circle cx={toSvg(userPosition.x, userPosition.y).x} cy={toSvg(userPosition.x, userPosition.y).y} r={7} fill={t.color.accent.primary} stroke="#FFFFFF" strokeWidth={2} />
          </G>
        ) : null}
      </Svg>
    </View>
  );
}

function Marker({ p, color }: { p: { x: number; y: number }; color: string; label: string }) {
  return <Circle cx={p.x} cy={p.y} r={6} fill={color} stroke="#FFFFFF" strokeWidth={2} />;
}

function DestinationPin({ p, color }: { p: { x: number; y: number }; color: string }) {
  return (
    <G>
      <Circle cx={p.x} cy={p.y - 10} r={9} fill={color} stroke="#FFFFFF" strokeWidth={2} />
      <Path d={`M ${p.x - 4} ${p.y - 5} L ${p.x} ${p.y} L ${p.x + 4} ${p.y - 5} Z`} fill={color} />
    </G>
  );
}

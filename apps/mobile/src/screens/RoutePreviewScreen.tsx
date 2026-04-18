import React, { useEffect, useState } from 'react';
import { View, ScrollView, useWindowDimensions } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import type { Destination, Floor, Route } from '@javits/domain';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { MapView } from '../components/MapView';
import { useTheme } from '../design/ThemeProvider';
import { useProviders } from '../providers/ProvidersContext';
import { useUserPosition } from '../hooks/useUserPosition';
import { iconForManeuver } from '../components/iconForCategory';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'RoutePreview'>;

export function RoutePreviewScreen({ route, navigation }: Props) {
  const t = useTheme();
  const { destinations, buildings, routing, analytics } = useProviders();
  const pos = useUserPosition();
  const [dest, setDest] = useState<Destination | null>(null);
  const [plannedRoute, setPlannedRoute] = useState<Route | null>(null);
  const [originFloor, setOriginFloor] = useState<Floor | null>(null);
  const { width } = useWindowDimensions();

  useEffect(() => {
    destinations.getDestination(route.params.destinationId).then(setDest);
  }, [destinations, route.params.destinationId]);

  useEffect(() => {
    if (!dest || !pos) return;
    let cancelled = false;
    (async () => {
      const r = await routing.planRoute({
        origin: { buildingId: pos.buildingId, floorId: pos.floorId, x: pos.x, y: pos.y },
        destinationId: dest.id,
      });
      if (cancelled) return;
      setPlannedRoute(r);
      const floor = await buildings.getFloor(pos.floorId);
      if (cancelled) return;
      setOriginFloor(floor);
      const floorChanges = r.steps.filter((s) => s.floorChange).length;
      analytics.track({
        name: 'route_previewed',
        properties: {
          destinationId: dest.id,
          distanceMeters: r.totalDistanceMeters,
          durationSec: r.estimatedDurationSec,
          floorChanges,
        },
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [dest, pos, routing, buildings, analytics]);

  if (!dest || !pos || !plannedRoute || !originFloor) {
    return (
      <Screen>
        <Text variant="body" tone="secondary">Planning your route…</Text>
      </Screen>
    );
  }

  const mapSize = Math.min(width - t.space(4) * 2, 420);

  const onStart = async () => {
    const session = await routing.startNavigation(plannedRoute);
    analytics.track({ name: 'navigation_started', properties: { sessionId: session.id, destinationId: dest.id } });
    navigation.replace('ActiveNavigation', { sessionId: session.id, destinationId: dest.id });
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingBottom: t.space(10), gap: t.space(4) }}>
        <Text variant="title">Route to {dest.name}</Text>

        <View style={{ alignItems: 'center' }}>
          <MapView
            floor={originFloor}
            route={plannedRoute}
            origin={{ buildingId: pos.buildingId, floorId: pos.floorId, x: pos.x, y: pos.y }}
            destination={dest.position}
            userPosition={pos}
            width={mapSize}
            height={240}
          />
        </View>

        <View style={{ flexDirection: 'row', gap: t.space(2) }}>
          <Stat label="Distance" value={`${plannedRoute.totalDistanceMeters} m`} />
          <Stat label="Time" value={`~${Math.max(1, Math.round(plannedRoute.estimatedDurationSec / 60))} min`} />
          <Stat label="Floors" value={plannedRoute.hasFloorChange ? `${floorsInvolved(plannedRoute)}` : '1'} />
        </View>

        <View style={{ gap: t.space(2) }}>
          <Text variant="heading">Steps</Text>
          {plannedRoute.steps.map((s) => (
            <Card key={s.id}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: t.space(3) }}>
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: t.radius.sm,
                    backgroundColor: t.color.bg.sunken,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons name={iconForManeuver(s.maneuver)} size={20} color={t.color.fg.secondary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text variant="bodyLarge" numberOfLines={2}>{s.instruction}</Text>
                  {s.distanceMeters > 0 ? (
                    <Text variant="body" tone="secondary">
                      {Math.round(s.distanceMeters)} m · ~{Math.max(1, Math.round(s.durationSec / 60))} min
                    </Text>
                  ) : null}
                </View>
              </View>
            </Card>
          ))}
        </View>

        <Button title="Start Navigation" fullWidth onPress={onStart} />
      </ScrollView>
    </Screen>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  const t = useTheme();
  return (
    <View style={{ flex: 1, padding: t.space(3), borderRadius: t.radius.md, backgroundColor: t.color.bg.raised, borderWidth: 1, borderColor: t.color.line }}>
      <Text variant="caption" tone="secondary">{label}</Text>
      <Text variant="heading">{value}</Text>
    </View>
  );
}

function floorsInvolved(r: Route): number {
  const floors = new Set(r.summaryPolyline.map((p) => p.floorId));
  return floors.size;
}

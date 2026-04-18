import React, { useEffect, useState } from 'react';
import { View, useWindowDimensions, Pressable } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import type { Destination, Floor, RouteStep, FloorChange } from '@javits/domain';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { NavBanner } from '../components/NavBanner';
import { MapView } from '../components/MapView';
import { Card } from '../components/Card';
import { useTheme } from '../design/ThemeProvider';
import { useProviders } from '../providers/ProvidersContext';
import { useUserPosition } from '../hooks/useUserPosition';
import { useNavigationSession } from '../hooks/useNavigationSession';
import type { MockLocationProvider } from '@javits/providers/mock/MockLocationProvider';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'ActiveNavigation'>;

export function ActiveNavigationScreen({ route, navigation }: Props) {
  const t = useTheme();
  const { buildings, routing, location, analytics } = useProviders();
  const session = useNavigationSession(route.params.sessionId);
  const pos = useUserPosition();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [currentFloor, setCurrentFloor] = useState<Floor | null>(null);
  const { width, height } = useWindowDimensions();

  useEffect(() => {
    if (!session) return;
    (async () => {
      const floor = await buildings.getFloor(session.route.origin.floorId);
      setCurrentFloor(floor);
    })();
  }, [session, buildings]);

  useEffect(() => {
    if (!pos || !currentFloor) return;
    if (pos.floorId !== currentFloor.id) {
      buildings.getFloor(pos.floorId).then(setCurrentFloor);
    }
  }, [pos, currentFloor, buildings]);

  useEffect(() => {
    if (!session) return;
    const destId = session.route.destinationId;
    // Cheap lookup via destination provider; intentionally not cached per-session.
    import('@javits/mock-data').then(({ seedDestinations }) => {
      const d = seedDestinations.find((x) => x.id === destId) ?? null;
      setDestination(d);
    });
  }, [session]);

  useEffect(() => {
    if (session?.state === 'arrived') {
      analytics.track({
        name: 'navigation_arrived',
        properties: {
          sessionId: session.id,
          destinationId: session.route.destinationId,
          durationSec: Math.round((Date.now() - session.startedAt) / 1000),
        },
      });
    }
  }, [session?.state, session?.id, session?.route.destinationId, session?.startedAt, analytics]);

  if (!session || !currentFloor) {
    return (
      <Screen>
        <Text variant="body" tone="secondary">Starting navigation…</Text>
      </Screen>
    );
  }

  const currentStep: RouteStep | undefined = session.route.steps[session.currentStepIndex];
  const nextStep: RouteStep | undefined = session.route.steps[session.currentStepIndex + 1];
  const distanceToNext =
    currentStep && pos
      ? Math.round(Math.hypot(currentStep.toPosition.x - pos.x, currentStep.toPosition.y - pos.y))
      : currentStep?.distanceMeters ?? 0;

  const pendingFloorChange: FloorChange | null = currentStep?.floorChange ?? null;

  const onCancel = async () => {
    await routing.cancelNavigation(session.id);
    analytics.track({ name: 'navigation_cancelled', properties: { sessionId: session.id, stepIndex: session.currentStepIndex } });
    navigation.popToTop();
  };

  const onAcknowledgeFloor = () => {
    if (!pendingFloorChange) return;
    // Mock-only: tell the mock location provider we've switched floors.
    (location as unknown as MockLocationProvider).confirmFloorTransition?.(pendingFloorChange.toFloorId);
  };

  if (session.state === 'arrived') {
    return (
      <Screen>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: t.space(5) }}>
          <View
            style={{
              width: 96,
              height: 96,
              borderRadius: 48,
              backgroundColor: t.color.status.success,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="flag" size={44} color="#FFFFFF" />
          </View>
          <Text variant="title">You've arrived</Text>
          {destination ? <Text variant="body" tone="secondary">{destination.name}</Text> : null}
          <Button title="Done" fullWidth onPress={() => navigation.popToTop()} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen padded={false}>
      <View style={{ paddingHorizontal: t.space(4), paddingTop: t.space(4) }}>
        {currentStep ? <NavBanner step={currentStep} distanceToNext={distanceToNext} /> : null}
      </View>

      <View style={{ flex: 1, paddingHorizontal: t.space(4), paddingTop: t.space(3) }}>
        <MapView
          floor={currentFloor}
          route={session.route}
          origin={session.route.origin}
          destination={session.route.destination}
          userPosition={pos}
          width={width - t.space(4) * 2}
          height={height * 0.45}
        />
      </View>

      {pendingFloorChange && pos?.floorId === pendingFloorChange.fromFloorId ? (
        <View style={{ paddingHorizontal: t.space(4), paddingBottom: t.space(3) }}>
          <Card>
            <Text variant="heading">
              {pendingFloorChange.method === 'bridge'
                ? 'Cross the bridge to the next building'
                : `Take the ${pendingFloorChange.method} to ${pendingFloorChange.toFloorId.split('_').pop()?.toUpperCase()}`}
            </Text>
            <Text variant="body" tone="secondary" style={{ marginTop: t.space(1) }}>
              {pendingFloorChange.isAccessible ? 'Step-free · ' : ''}
              Tap below when you've arrived on the next floor.
            </Text>
            <View style={{ marginTop: t.space(3) }}>
              <Button title="I'm on the next floor" fullWidth onPress={onAcknowledgeFloor} />
            </View>
          </Card>
        </View>
      ) : null}

      <View style={{ paddingHorizontal: t.space(4), paddingBottom: t.space(5), gap: t.space(2) }}>
        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>
              <Text variant="bodyLarge">
                {Math.max(1, Math.round(session.remainingDurationSec / 60))} min · {session.remainingDistanceMeters} m remaining
              </Text>
              {nextStep ? (
                <Text variant="body" tone="secondary" numberOfLines={1}>
                  Next: {nextStep.instruction}
                </Text>
              ) : null}
            </View>
            <Pressable
              onPress={onCancel}
              accessibilityRole="button"
              accessibilityLabel="End navigation"
              style={{
                paddingVertical: t.space(2),
                paddingHorizontal: t.space(3),
                borderRadius: t.radius.sm,
                backgroundColor: t.color.bg.sunken,
              }}
            >
              <Text variant="label" tone="danger">End</Text>
            </Pressable>
          </View>
        </Card>

        {session.state === 'rerouting' || session.offRoute ? (
          <Card>
            <Text variant="heading" tone="accent">Rerouting…</Text>
            <Text variant="body" tone="secondary">You've drifted from the path. Finding a new route.</Text>
          </Card>
        ) : null}
      </View>
    </Screen>
  );
}

import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import type { Destination } from '@javits/domain';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { FloorBadge } from '../components/FloorBadge';
import { useTheme } from '../design/ThemeProvider';
import { useProviders } from '../providers/ProvidersContext';
import { useUserPosition } from '../hooks/useUserPosition';
import { categoryColorKey, categoryLabel } from '../design/categoryColor';
import { iconForCategory } from '../components/iconForCategory';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'DestinationDetail'>;

export function DestinationDetailScreen({ route, navigation }: Props) {
  const t = useTheme();
  const { destinations, analytics } = useProviders();
  const pos = useUserPosition();
  const [dest, setDest] = useState<Destination | null>(null);

  useEffect(() => {
    destinations.getDestination(route.params.destinationId).then(setDest);
    analytics.track({ name: 'destination_viewed', properties: { destinationId: route.params.destinationId, source: 'app' } });
  }, [destinations, route.params.destinationId, analytics]);

  const { distance, etaMin } = useMemo(() => {
    if (!dest || !pos) return { distance: null, etaMin: null } as const;
    if (pos.floorId !== dest.floorId) return { distance: null, etaMin: null } as const;
    const d = Math.round(Math.hypot(dest.position.x - pos.x, dest.position.y - pos.y));
    return { distance: d, etaMin: Math.max(1, Math.round(d / 1.2 / 60)) } as const;
  }, [dest, pos]);

  if (!dest) {
    return (
      <Screen>
        <Text variant="body" tone="secondary">Loading destination…</Text>
      </Screen>
    );
  }

  const colors = t.color.category[categoryColorKey(dest.category)];

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingBottom: t.space(10), gap: t.space(4) }}>
        <View
          style={{
            height: 140,
            borderRadius: t.radius.lg,
            backgroundColor: colors.bg,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name={iconForCategory(dest.category)} size={56} color={colors.fg} />
        </View>

        <View style={{ gap: t.space(2) }}>
          <Text variant="title">{dest.name}</Text>
          <View style={{ flexDirection: 'row', gap: t.space(2), alignItems: 'center', flexWrap: 'wrap' }}>
            <FloorBadge label={categoryLabel(dest.category)} />
            <FloorBadge label={friendlyFloor(dest.floorId)} />
            {dest.displayCode ? <FloorBadge label={dest.displayCode} /> : null}
          </View>
        </View>

        {distance !== null ? (
          <Card>
            <View style={{ flexDirection: 'row', gap: t.space(3) }}>
              <Ionicons name="walk" size={24} color={t.color.fg.secondary} />
              <View style={{ flex: 1 }}>
                <Text variant="bodyLarge">{distance} m · ~{etaMin} min walk</Text>
                <Text variant="body" tone="secondary">From your current position</Text>
              </View>
            </View>
          </Card>
        ) : (
          <Card>
            <Text variant="body" tone="secondary">
              Different floor — route preview will include the floor change.
            </Text>
          </Card>
        )}

        {dest.description ? (
          <View style={{ gap: t.space(2) }}>
            <Text variant="heading">About</Text>
            <Text variant="body">{dest.description}</Text>
          </View>
        ) : null}

        <View style={{ marginTop: t.space(3) }}>
          <Button
            title="Preview Route"
            fullWidth
            onPress={() => navigation.navigate('RoutePreview', { destinationId: dest.id })}
            accessibilityLabel={`Preview route to ${dest.name}`}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}

function friendlyFloor(floorId: string): string {
  const b = floorId.includes('north') ? 'North' : floorId.includes('south') ? 'South' : '';
  const l = floorId.split('_').pop()?.toUpperCase() ?? '';
  return [b, l].filter(Boolean).join(' · ');
}

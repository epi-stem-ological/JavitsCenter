import React, { useEffect, useState } from 'react';
import { ScrollView, View, Pressable } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import type { Destination } from '@javits/domain';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Card } from '../components/Card';
import { SearchField } from '../components/SearchField';
import { CategoryChip } from '../components/CategoryChip';
import { FloorBadge } from '../components/FloorBadge';
import { useTheme } from '../design/ThemeProvider';
import { useProviders } from '../providers/ProvidersContext';
import { useUserPosition } from '../hooks/useUserPosition';
import type { RootStackParamList } from '../navigation/types';
import { seedVenues } from '@javits/mock-data';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const t = useTheme();
  const { destinations } = useProviders();
  const pos = useUserPosition();
  const [featured, setFeatured] = useState<Destination[]>([]);
  const venue = seedVenues[0]!;

  useEffect(() => {
    destinations.listFeatured(venue.id).then(setFeatured);
  }, [destinations, venue.id]);

  const currentLabel = pos ? formatPositionLabel(pos.buildingId, pos.floorId) : 'Locating…';

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingBottom: t.space(8), gap: t.space(5) }} showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <Text variant="caption" tone="secondary">
              You are at
            </Text>
            <Text variant="heading">{currentLabel}</Text>
          </View>
          <Pressable onPress={() => navigation.navigate('Settings')} accessibilityLabel="Settings" hitSlop={12}>
            <Ionicons name="settings-outline" size={24} color={t.color.fg.secondary} />
          </Pressable>
        </View>

        <Pressable onPress={() => navigation.navigate('Search')} accessibilityRole="search">
          <SearchField value="" onChangeText={() => {}} placeholder="Search halls, booths, food…" />
        </Pressable>

        <View>
          <Text variant="heading" style={{ marginBottom: t.space(3) }}>
            Quick Access
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: t.space(2) }}>
            <CategoryChip category="hall" label="Halls" icon="business" onPress={() => navigation.navigate('Search', { initialQuery: 'hall' })} />
            <CategoryChip category="food" label="Food" icon="restaurant" onPress={() => navigation.navigate('Search', { initialQuery: 'food' })} />
            <CategoryChip category="restroom" label="WC" icon="man" onPress={() => navigation.navigate('Search', { initialQuery: 'restroom' })} />
            <CategoryChip category="help_desk" label="Help" icon="information-circle" onPress={() => navigation.navigate('Search', { initialQuery: 'help' })} />
            <CategoryChip category="registration" label="Register" icon="barcode" onPress={() => navigation.navigate('Search', { initialQuery: 'registration' })} />
            <CategoryChip category="exit" label="Exit" icon="exit" onPress={() => navigation.navigate('Search', { initialQuery: 'exit' })} />
            <CategoryChip category="elevator" label="Elevators" icon="arrow-up" onPress={() => navigation.navigate('Search', { initialQuery: 'elevator' })} />
            <CategoryChip category="parking" label="Parking" icon="car" onPress={() => navigation.navigate('Search', { initialQuery: 'parking' })} />
          </View>
        </View>

        <View>
          <Text variant="heading" style={{ marginBottom: t.space(3) }}>
            Featured
          </Text>
          <View style={{ gap: t.space(2) }}>
            {featured.map((d) => (
              <Card key={d.id}>
                <Pressable onPress={() => navigation.navigate('DestinationDetail', { destinationId: d.id })} accessibilityRole="button" accessibilityLabel={d.name}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flex: 1, gap: t.space(1) }}>
                      <Text variant="bodyLarge">{d.name}</Text>
                      <Text variant="body" tone="secondary">
                        {formatPositionLabel(d.buildingId, d.floorId)}
                        {d.displayCode ? ` · ${d.displayCode}` : ''}
                      </Text>
                    </View>
                    <FloorBadge label={formatShortFloor(d.floorId)} />
                  </View>
                </Pressable>
              </Card>
            ))}
          </View>
        </View>

        <Card padded style={{ backgroundColor: t.color.bg.raised }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: t.space(3) }}>
            <Ionicons name="information-circle" size={24} color={t.color.fg.secondary} />
            <Text variant="body" tone="secondary" style={{ flex: 1 }}>
              Prototype build — all positions are simulated. Real indoor
              positioning will come from the Cisco Spaces Wayfinding SDK later.
            </Text>
          </View>
        </Card>
      </ScrollView>
    </Screen>
  );
}

function formatPositionLabel(buildingId: string, floorId: string): string {
  const bldg = buildingId.includes('north') ? 'North Building' : buildingId.includes('south') ? 'South Building' : 'Venue';
  const level = floorId.split('_').pop()?.toUpperCase() ?? '';
  return `${bldg} · ${level}`;
}

function formatShortFloor(floorId: string): string {
  const bldg = floorId.includes('north') ? 'N' : floorId.includes('south') ? 'S' : '';
  const level = floorId.split('_').pop()?.toUpperCase() ?? '';
  return `${level} · ${bldg}`;
}

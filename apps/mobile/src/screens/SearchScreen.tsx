import React, { useEffect, useMemo, useState } from 'react';
import { View, FlatList } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { SearchResult } from '@javits/domain';
import { Screen } from '../components/Screen';
import { SearchField } from '../components/SearchField';
import { DestinationRow } from '../components/DestinationRow';
import { Text } from '../components/Text';
import { useTheme } from '../design/ThemeProvider';
import { useProviders } from '../providers/ProvidersContext';
import { useUserPosition } from '../hooks/useUserPosition';
import type { RootStackParamList } from '../navigation/types';
import { seedVenues } from '@javits/mock-data';

type Props = NativeStackScreenProps<RootStackParamList, 'Search'>;

export function SearchScreen({ navigation, route }: Props) {
  const t = useTheme();
  const { destinations, analytics } = useProviders();
  const pos = useUserPosition();
  const [query, setQuery] = useState(route.params?.initialQuery ?? '');
  const [results, setResults] = useState<SearchResult[]>([]);
  const venueId = seedVenues[0]!.id;

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResults([]);
      return;
    }
    let cancelled = false;
    const run = async () => {
      const ctx = {
        venueId,
        limit: 30,
        ...(pos ? { origin: { buildingId: pos.buildingId, floorId: pos.floorId, x: pos.x, y: pos.y } } : {}),
      };
      const out = await destinations.search(q, ctx);
      if (cancelled) return;
      setResults(out);
      analytics.track({ name: 'search_query', properties: { query: q, resultCount: out.length, venueId } });
    };
    const handle = setTimeout(run, 120);
    return () => {
      cancelled = true;
      clearTimeout(handle);
    };
  }, [query, destinations, analytics, pos, venueId]);

  const empty = useMemo(() => query.trim().length === 0, [query]);

  return (
    <Screen>
      <View style={{ gap: t.space(4) }}>
        <SearchField value={query} onChangeText={setQuery} autoFocus />
      </View>

      {empty ? (
        <View style={{ marginTop: t.space(6), gap: t.space(2) }}>
          <Text variant="heading">Try searching for…</Text>
          <Text variant="body" tone="secondary">"hall a", "booth 4512", "food", "help"</Text>
        </View>
      ) : results.length === 0 ? (
        <View style={{ marginTop: t.space(6), gap: t.space(2) }}>
          <Text variant="heading">No matches</Text>
          <Text variant="body" tone="secondary">Check for typos or try a broader term.</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(r) => r.destination.id}
          contentContainerStyle={{ paddingTop: t.space(3), paddingBottom: t.space(8) }}
          ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: t.color.line }} />}
          renderItem={({ item }) => {
            const rowProps: React.ComponentProps<typeof DestinationRow> = {
              destination: item.destination,
              onPress: () => navigation.navigate('DestinationDetail', { destinationId: item.destination.id }),
            };
            if (typeof item.distanceMeters === 'number') rowProps.distanceMeters = item.distanceMeters;
            if (typeof item.etaSec === 'number') rowProps.etaSec = item.etaSec;
            return <DestinationRow {...rowProps} />;
          }}
        />
      )}
    </Screen>
  );
}

import React from 'react';
import { View, ScrollView } from 'react-native';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Card } from '../components/Card';
import { useTheme } from '../design/ThemeProvider';
import { useProviders } from '../providers/ProvidersContext';

export function SettingsScreen() {
  const t = useTheme();
  const providers = useProviders();
  return (
    <Screen>
      <ScrollView contentContainerStyle={{ gap: t.space(4), paddingBottom: t.space(8) }}>
        <Card>
          <Text variant="heading">Prototype mode</Text>
          <Text variant="body" tone="secondary" style={{ marginTop: t.space(2) }}>
            This build uses mock providers ({providers.kind}). Indoor position
            and routing are simulated. Real indoor positioning will come from
            the Cisco Spaces Wayfinding SDK in a future build.
          </Text>
        </Card>

        <Card>
          <Text variant="heading">Accessibility</Text>
          <Text variant="body" tone="secondary" style={{ marginTop: t.space(2) }}>
            Step-free routing preference — toggle to be added in a future
            build. Graph already supports accessibility filtering.
          </Text>
        </Card>

        <Card>
          <Text variant="heading">Units</Text>
          <Text variant="body" tone="secondary" style={{ marginTop: t.space(2) }}>
            Meters (default). Imperial support is defined in the domain but
            not yet surfaced in UI.
          </Text>
        </Card>

        <View style={{ paddingHorizontal: t.space(2) }}>
          <Text variant="caption" tone="tertiary">Javits Wayfinder · v0.1.0 · prototype</Text>
        </View>
      </ScrollView>
    </Screen>
  );
}

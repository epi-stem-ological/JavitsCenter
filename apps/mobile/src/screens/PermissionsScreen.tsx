import React from 'react';
import { View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { useTheme } from '../design/ThemeProvider';
import { useProviders } from '../providers/ProvidersContext';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Permissions'>;

export function PermissionsScreen({ navigation }: Props) {
  const t = useTheme();
  const { location, analytics } = useProviders();

  const onGrant = async () => {
    const result = await location.requestPermission();
    analytics.track({ name: 'permission_requested', properties: { permission: 'location', result } });
    navigation.goBack();
  };

  return (
    <Screen>
      <View style={{ flex: 1, gap: t.space(5), justifyContent: 'center' }}>
        <View
          style={{
            alignSelf: 'center',
            width: 96,
            height: 96,
            borderRadius: 48,
            backgroundColor: t.color.bg.raised,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="navigate" size={48} color={t.color.accent.primary} />
        </View>
        <View style={{ gap: t.space(2) }}>
          <Text variant="title" style={{ textAlign: 'center' }}>Allow location to find you inside</Text>
          <Text variant="body" tone="secondary" style={{ textAlign: 'center' }}>
            We use indoor positioning to draw your blue dot and give you
            turn-by-turn directions. It only runs while the app is open.
          </Text>
        </View>
        <View style={{ gap: t.space(2) }}>
          <Button title="Allow location" fullWidth onPress={onGrant} />
          <Button title="Not now" variant="ghost" fullWidth onPress={() => navigation.goBack()} />
        </View>
      </View>
    </Screen>
  );
}

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Linking from 'expo-linking';
import { useTheme } from '../design/ThemeProvider';
import type { RootStackParamList } from './types';
import { HomeScreen } from '../screens/HomeScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { DestinationDetailScreen } from '../screens/DestinationDetailScreen';
import { RoutePreviewScreen } from '../screens/RoutePreviewScreen';
import { ActiveNavigationScreen } from '../screens/ActiveNavigationScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { PermissionsScreen } from '../screens/PermissionsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Deep-link config:
 *   wayfinder://destination/:destinationId  → DestinationDetail
 *   wayfinder://event/:eventId              → (future)
 *   wayfinder://exhibitor/:exhibitorId      → (future)
 *   https://wayfinder.example/d/:id         → DestinationDetail (universal link, future)
 */
const linking = {
  prefixes: [Linking.createURL('/'), 'wayfinder://', 'https://wayfinder.example'],
  config: {
    screens: {
      Home: '',
      Search: 'search',
      DestinationDetail: 'destination/:destinationId',
      RoutePreview: 'route/:destinationId',
      ActiveNavigation: 'navigate/:sessionId/:destinationId',
      Permissions: 'permissions',
      Settings: 'settings',
    },
  },
};

export function RootNavigator() {
  const t = useTheme();
  return (
    <NavigationContainer
      linking={linking}
      theme={{
        dark: t.name === 'dark',
        colors: {
          primary: t.color.accent.primary,
          background: t.color.bg.base,
          card: t.color.bg.base,
          text: t.color.fg.primary,
          border: t.color.line,
          notification: t.color.status.danger,
        },
        fonts: undefined as any,
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerShadowVisible: false,
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: t.color.bg.base },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Javits Center' }} />
        <Stack.Screen name="Search" component={SearchScreen} options={{ title: 'Search' }} />
        <Stack.Screen name="DestinationDetail" component={DestinationDetailScreen} options={{ title: '' }} />
        <Stack.Screen name="RoutePreview" component={RoutePreviewScreen} options={{ title: 'Route' }} />
        <Stack.Screen name="ActiveNavigation" component={ActiveNavigationScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
        <Stack.Screen name="Permissions" component={PermissionsScreen} options={{ title: 'Location access' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

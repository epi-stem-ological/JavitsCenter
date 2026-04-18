import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from './src/design/ThemeProvider';
import { ProvidersProvider } from './src/providers/ProvidersContext';
import { RootNavigator } from './src/navigation/RootNavigator';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <ProvidersProvider>
            <StatusBar style="auto" />
            <RootNavigator />
          </ProvidersProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

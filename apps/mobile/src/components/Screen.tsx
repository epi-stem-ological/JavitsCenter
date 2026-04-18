import React from 'react';
import { View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../design/ThemeProvider';

export function Screen({ children, style, padded = true }: { children: React.ReactNode; style?: ViewStyle; padded?: boolean }) {
  const t = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.color.bg.base }} edges={['top', 'left', 'right']}>
      <View style={[{ flex: 1, paddingHorizontal: padded ? t.space(4) : 0, paddingTop: padded ? t.space(2) : 0 }, style]}>
        {children}
      </View>
    </SafeAreaView>
  );
}

import React from 'react';
import { View, type ViewStyle } from 'react-native';
import { useTheme } from '../design/ThemeProvider';

export function Card({ children, style, padded = true }: { children: React.ReactNode; style?: ViewStyle; padded?: boolean }) {
  const t = useTheme();
  return (
    <View
      style={[
        {
          backgroundColor: t.color.bg.raised,
          borderRadius: t.radius.md,
          padding: padded ? t.space(4) : 0,
          borderWidth: 1,
          borderColor: t.color.line,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

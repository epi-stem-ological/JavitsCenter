import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../design/ThemeProvider';
import { Text } from './Text';

export function FloorBadge({ label }: { label: string }) {
  const t = useTheme();
  return (
    <View
      style={{
        paddingHorizontal: t.space(2),
        paddingVertical: t.space(1),
        borderRadius: t.radius.sm,
        backgroundColor: t.color.bg.raised,
        borderWidth: 1,
        borderColor: t.color.line,
        alignSelf: 'flex-start',
      }}
    >
      <Text variant="label" tone="secondary">
        {label}
      </Text>
    </View>
  );
}

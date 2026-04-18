import React from 'react';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../design/ThemeProvider';
import { Text } from './Text';
import type { DestinationCategory } from '@javits/domain';
import { categoryColorKey } from '../design/categoryColor';

export function CategoryChip({
  category,
  label,
  icon,
  onPress,
}: {
  category: DestinationCategory;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
}) {
  const t = useTheme();
  const colors = t.color.category[categoryColorKey(category)];
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => ({
        flexGrow: 1,
        flexBasis: '22%',
        minWidth: 80,
        minHeight: 80,
        padding: t.space(3),
        borderRadius: t.radius.md,
        backgroundColor: colors.bg,
        alignItems: 'center',
        justifyContent: 'center',
        gap: t.space(1),
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <View style={{ marginBottom: t.space(1) }}>
        <Ionicons name={icon} size={24} color={colors.fg} />
      </View>
      <Text variant="label" style={{ color: colors.fg, textAlign: 'center' }}>
        {label}
      </Text>
    </Pressable>
  );
}

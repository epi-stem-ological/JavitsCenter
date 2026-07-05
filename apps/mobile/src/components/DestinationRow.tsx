import React from 'react';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatDistance, type Destination } from '@javits/domain';
import { useTheme } from '../design/ThemeProvider';
import { Text } from './Text';
import { categoryColorKey, categoryLabel } from '../design/categoryColor';
import { iconForCategory } from './iconForCategory';

export function DestinationRow({
  destination,
  distanceMeters,
  etaSec,
  onPress,
}: {
  destination: Destination;
  distanceMeters?: number;
  etaSec?: number;
  onPress?: () => void;
}) {
  const t = useTheme();
  const colors = t.color.category[categoryColorKey(destination.category)];
  const floorLabel = formatFloor(destination.floorId);
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${destination.name}, ${categoryLabel(destination.category)}, ${floorLabel}`}
      style={({ pressed }) => ({
        minHeight: t.touch.minRow,
        flexDirection: 'row',
        alignItems: 'center',
        gap: t.space(3),
        paddingVertical: t.space(3),
        opacity: pressed ? 0.8 : 1,
      })}
    >
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: t.radius.sm,
          backgroundColor: colors.bg,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons name={iconForCategory(destination.category)} size={22} color={colors.fg} />
      </View>
      <View style={{ flex: 1 }}>
        <Text variant="bodyLarge" numberOfLines={1}>
          {destination.name}
        </Text>
        <Text variant="body" tone="secondary" numberOfLines={1}>
          {[categoryLabel(destination.category), floorLabel].filter(Boolean).join(' · ')}
          {typeof distanceMeters === 'number' ? ` · ${formatDistance(distanceMeters)}` : ''}
          {typeof etaSec === 'number' ? ` · ${Math.max(1, Math.round(etaSec / 60))} min` : ''}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={t.color.fg.tertiary} />
    </Pressable>
  );
}

function formatFloor(floorId: string): string {
  // Seed floorIds look like `floor_main_l3`. Human label: "Level 3".
  const parts = floorId.split('_');
  const level = parts[parts.length - 1] ?? '';
  const bldg = parts[1];
  const levelLabel = level.startsWith('l') ? `Level ${level.slice(1)}` : level.toUpperCase();
  const wing = bldg === 'north' ? 'Javits North' : '';
  return [levelLabel, wing].filter(Boolean).join(' · ');
}

import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { RouteStep } from '@javits/domain';
import { useTheme } from '../design/ThemeProvider';
import { Text } from './Text';
import { iconForManeuver } from './iconForCategory';

export function NavBanner({ step, distanceToNext }: { step: RouteStep; distanceToNext: number }) {
  const t = useTheme();
  return (
    <View
      accessibilityLiveRegion="polite"
      accessibilityRole="alert"
      style={{
        backgroundColor: t.color.fg.primary,
        borderRadius: t.radius.md,
        padding: t.space(4),
        flexDirection: 'row',
        alignItems: 'center',
        gap: t.space(3),
      }}
    >
      <View
        style={{
          width: 56,
          height: 56,
          borderRadius: t.radius.md,
          backgroundColor: t.color.accent.primary,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons name={iconForManeuver(step.maneuver)} size={28} color={t.color.accent.onPrimary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text variant="navStep" style={{ color: t.color.bg.base }}>
          {distanceToNext > 0 ? `In ${distanceToNext} m` : 'Now'}
        </Text>
        <Text variant="bodyLarge" style={{ color: t.color.bg.base }} numberOfLines={2}>
          {step.instruction}
        </Text>
      </View>
    </View>
  );
}

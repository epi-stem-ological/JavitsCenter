import React from 'react';
import { Pressable, View, type PressableProps } from 'react-native';
import { useTheme } from '../design/ThemeProvider';
import { Text } from './Text';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'md' | 'lg';

export interface ButtonProps extends Omit<PressableProps, 'children' | 'style'> {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  leading?: React.ReactNode;
}

export function Button({ title, variant = 'primary', size = 'lg', fullWidth, leading, accessibilityLabel, ...rest }: ButtonProps) {
  const t = useTheme();
  const height = size === 'lg' ? t.touch.minCta : 44;
  const { bg, fg, borderColor } = pickColors(t, variant);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      {...rest}
      style={({ pressed }) => [
        {
          height,
          borderRadius: t.radius.md,
          paddingHorizontal: t.space(5),
          backgroundColor: bg,
          borderWidth: variant === 'ghost' || variant === 'secondary' ? 1 : 0,
          borderColor,
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
          opacity: pressed ? 0.85 : 1,
          flexDirection: 'row',
          gap: t.space(2),
        },
      ]}
    >
      {leading ? <View>{leading}</View> : null}
      <Text variant={size === 'lg' ? 'heading' : 'body'} style={{ color: fg }}>
        {title}
      </Text>
    </Pressable>
  );
}

function pickColors(t: ReturnType<typeof useTheme>, variant: ButtonVariant) {
  switch (variant) {
    case 'primary':
      return { bg: t.color.accent.primary, fg: t.color.accent.onPrimary, borderColor: 'transparent' };
    case 'secondary':
      return { bg: t.color.bg.raised, fg: t.color.fg.primary, borderColor: t.color.line };
    case 'ghost':
      return { bg: 'transparent', fg: t.color.fg.primary, borderColor: 'transparent' };
    case 'danger':
      return { bg: t.color.status.danger, fg: '#FFFFFF', borderColor: 'transparent' };
  }
}

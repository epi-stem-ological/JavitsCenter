import React from 'react';
import { Text as RNText, type TextProps } from 'react-native';
import { useTheme, type Theme } from '../design/ThemeProvider';
import type { TypeToken } from '../design/tokens';

export interface AppTextProps extends TextProps {
  variant?: TypeToken;
  tone?: 'primary' | 'secondary' | 'tertiary' | 'accent' | 'danger';
  numberOfLines?: number;
}

export function Text({ variant = 'body', tone = 'primary', style, ...rest }: AppTextProps) {
  const t = useTheme();
  const toneColor = pickTone(t, tone);
  const typeStyle = t.type[variant];
  return (
    <RNText
      {...rest}
      style={[
        {
          color: toneColor,
          fontSize: typeStyle.fontSize,
          lineHeight: typeStyle.lineHeight,
          fontWeight: typeStyle.fontWeight,
        },
        style,
      ]}
    />
  );
}

function pickTone(t: Theme, tone: NonNullable<AppTextProps['tone']>): string {
  switch (tone) {
    case 'primary':
      return t.color.fg.primary;
    case 'secondary':
      return t.color.fg.secondary;
    case 'tertiary':
      return t.color.fg.tertiary;
    case 'accent':
      return t.color.accent.primary;
    case 'danger':
      return t.color.status.danger;
  }
}

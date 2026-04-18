import React from 'react';
import { TextInput, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../design/ThemeProvider';

export function SearchField({
  value,
  onChangeText,
  onSubmit,
  placeholder = 'Search halls, booths, food…',
  autoFocus,
}: {
  value: string;
  onChangeText: (s: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}) {
  const t = useTheme();
  return (
    <View
      style={{
        height: 52,
        borderRadius: t.radius.md,
        backgroundColor: t.color.bg.raised,
        borderWidth: 1,
        borderColor: t.color.line,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: t.space(3),
        gap: t.space(2),
      }}
    >
      <Ionicons name="search" size={20} color={t.color.fg.tertiary} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        placeholder={placeholder}
        placeholderTextColor={t.color.fg.tertiary}
        autoCapitalize="none"
        autoCorrect={false}
        autoFocus={autoFocus}
        returnKeyType="search"
        accessibilityLabel="Search"
        style={{
          flex: 1,
          color: t.color.fg.primary,
          fontSize: 16,
          paddingVertical: 0,
        }}
      />
      {value.length > 0 ? (
        <Pressable onPress={() => onChangeText('')} accessibilityLabel="Clear search">
          <Ionicons name="close-circle" size={20} color={t.color.fg.tertiary} />
        </Pressable>
      ) : null}
    </View>
  );
}

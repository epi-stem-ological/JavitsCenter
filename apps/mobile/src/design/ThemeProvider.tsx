import React, { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme, type Theme } from './tokens';

const ThemeCtx = createContext<Theme>(lightTheme);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? darkTheme : lightTheme;
  return <ThemeCtx.Provider value={theme}>{children}</ThemeCtx.Provider>;
}

export function useTheme(): Theme {
  return useContext(ThemeCtx);
}

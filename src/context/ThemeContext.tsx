import React, { createContext, useContext, ReactNode } from 'react';
import { useAppSelector } from '../hooks';
import { selectTheme } from '../features/ui/uiSlice';
import { lightTheme, darkTheme, Theme } from '../theme/theme';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  isDark: false,
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const themeType = useAppSelector(selectTheme);
  const theme = themeType === 'dark' ? darkTheme : lightTheme;
  const isDark = themeType === 'dark';

  return <ThemeContext.Provider value={{ theme, isDark }}>{children}</ThemeContext.Provider>;
};

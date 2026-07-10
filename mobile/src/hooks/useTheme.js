import { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';
import { useSettings } from './useSettings';

export const LIGHT = {
  bg: '#F9F7F5',
  surface: '#FFFFFF',
  elevated: '#EFEDEA',
  text: '#1B1717',
  subtext: '#989c9a',
  border: '#1c1e24',
  faint: '#D8D5DB',
  accent1: '#d29f22',
  accent2: '#A31E21',
  accent3: '#4F6815',
};

export const DARK = {
  bg: '#161616',
  surface: '#202020',
  elevated: '#2A2A2A',
  text: '#F2EFEA',
  subtext: '#8A8A8A',
  border: '#3A3A3A',
  faint: '#333333',
  accent1: '#d29f22',
  accent2: '#A31E21',
  accent3: '#4F6815',
};

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const { mode } = useSettings();
  const systemScheme = useColorScheme(); // 'light' | 'dark' | null

  const scheme = mode === 'auto' ? (systemScheme ?? 'light') : mode;
  const theme = scheme === 'dark' ? DARK : LIGHT;

  return (
    <ThemeContext.Provider value={{ scheme, mode, theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

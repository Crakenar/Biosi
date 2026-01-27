import React, { createContext, useContext, ReactNode } from 'react';
import { Theme, themes } from '../constants/themes';
import { useSettingsStore } from '../store/settingsStore';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { settings } = useSettingsStore();
  const theme = themes[settings.theme];
  const isDark = settings.theme === 'financial';

  return (
    <ThemeContext.Provider value={{ theme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

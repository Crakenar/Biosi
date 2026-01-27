import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import './src/services/i18n';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { useSettingsStore } from './src/store/settingsStore';
import { useTranslation } from 'react-i18next';
import { usePremiumRestore } from './src/hooks/usePremiumRestore';

function AppContent() {
  const { settings } = useSettingsStore();
  const { i18n } = useTranslation();

  // Automatically restore premium purchases on app startup
  usePremiumRestore();

  useEffect(() => {
    i18n.changeLanguage(settings.language);
  }, [settings.language]);

  return (
    <>
      <RootNavigator />
      <StatusBar style="auto" />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

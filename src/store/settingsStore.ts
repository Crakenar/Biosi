import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from '../services/storage';
import { AppSettings } from '../types/settings';

interface SettingsStore {
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;
  toggleTheme: () => void;
  setTheme: (theme: 'cute' | 'professional' | 'financial') => void;
  setCurrency: (currency: string) => void;
  setLanguage: (language: 'en' | 'fr') => void;
  setDisplayMode: (mode: 'currency' | 'hours') => void;
  unlockPremium: () => void;
  completeOnboarding: () => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: {
        theme: 'cute',
        currency: 'USD',
        language: 'en',
        displayMode: 'currency',
        isPremium: false,
        onboardingCompleted: false,
        compoundInterestRate: 0.07,
      },
      updateSettings: (updates) =>
        set((state) => ({
          settings: { ...state.settings, ...updates },
        })),
      toggleTheme: () =>
        set((state) => ({
          settings: {
            ...state.settings,
            theme: state.settings.theme === 'cute' ? 'professional' : 'cute',
          },
        })),
      setTheme: (theme) =>
        set((state) => ({
          settings: { ...state.settings, theme },
        })),
      setCurrency: (currency) =>
        set((state) => ({
          settings: { ...state.settings, currency },
        })),
      setLanguage: (language) =>
        set((state) => ({
          settings: { ...state.settings, language },
        })),
      setDisplayMode: (mode) =>
        set((state) => ({
          settings: { ...state.settings, displayMode: mode },
        })),
      unlockPremium: () =>
        set((state) => ({
          settings: { ...state.settings, isPremium: true },
        })),
      completeOnboarding: () =>
        set((state) => ({
          settings: { ...state.settings, onboardingCompleted: true },
        })),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);

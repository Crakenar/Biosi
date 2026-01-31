import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from '../services/storage';
import { AppSettings } from '../types/settings';
import RevenueCatService from '../services/revenuecat';

// Check if premium should be forced (for dev testing)
const shouldForcePremium = () => {
  return process.env.EXPO_PUBLIC_FORCE_PREMIUM === 'true';
};

interface SettingsStore {
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;
  toggleTheme: () => void;
  setTheme: (theme: 'cute' | 'professional' | 'financial') => void;
  setCurrency: (currency: string) => void;
  setLanguage: (language: 'en' | 'fr') => void;
  setDisplayMode: (mode: 'currency' | 'hours') => void;
  setPremium: (isPremium: boolean) => void;
  unlockPremium: () => void;
  syncPremiumStatus: () => Promise<void>;
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
        isPremium: shouldForcePremium(), // Force premium if env var is set
        onboardingCompleted: false,
        compoundInterestRate: 0.07,
        workHoursPerDay: 7,
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
      setPremium: (isPremium) =>
        set((state) => ({
          settings: { ...state.settings, isPremium },
        })),
      unlockPremium: () =>
        set((state) => ({
          settings: { ...state.settings, isPremium: true },
        })),
      syncPremiumStatus: async () => {
        try {
          // If premium is forced via env, keep it enabled
          if (shouldForcePremium()) {
            console.log('⚠️ Premium is forced via EXPO_PUBLIC_FORCE_PREMIUM env var');
            set((state) => ({
              settings: { ...state.settings, isPremium: true },
            }));
            return;
          }

          const isPremium = await RevenueCatService.checkPremiumStatus();
          set((state) => ({
            settings: { ...state.settings, isPremium },
          }));
        } catch (error) {
          console.error('Failed to sync premium status:', error);
        }
      },
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

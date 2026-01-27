import { useEffect, useRef } from 'react';
import { useSettingsStore } from '../store/settingsStore';
import { iapService } from '../services/iap';

/**
 * Hook that automatically restores premium purchases on app startup
 * Runs only once per app session
 */
export function usePremiumRestore() {
  const { settings, unlockPremium } = useSettingsStore();
  const hasChecked = useRef(false);

  useEffect(() => {
    // Only check once per app session
    if (hasChecked.current) return;

    // If already premium, no need to check
    if (settings.isPremium) {
      hasChecked.current = true;
      return;
    }

    const checkPremiumStatus = async () => {
      try {
        // Wait a bit for the app to fully initialize and stores to be ready
        await new Promise((resolve) => setTimeout(resolve, 1500));

        console.log('Checking for previous premium purchases...');
        const hasPremium = await iapService.restorePurchases();

        if (hasPremium) {
          console.log('Premium purchase found! Unlocking premium theme...');
          unlockPremium();
        } else {
          console.log('No premium purchase found.');
        }

        hasChecked.current = true;
      } catch (error) {
        console.error('Error checking premium status:', error);
        hasChecked.current = true;
      }
    };

    checkPremiumStatus();
  }, [settings.isPremium, unlockPremium]);
}

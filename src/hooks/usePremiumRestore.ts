import { useEffect, useRef } from 'react';
import { useSettingsStore } from '../store/settingsStore';
import RevenueCatService from '../services/revenuecat';
import { mmkvStorage } from '../services/storage';

/**
 * Hook that automatically initializes RevenueCat and restores premium purchases on app startup
 * Runs only once per app session
 */
export function usePremiumRestore() {
  const { settings, setPremium } = useSettingsStore();
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Only initialize once per app session
    if (hasInitialized.current) return;

    const initializeRevenueCat = async () => {
      try {
        // Wait a bit for the app to fully initialize and stores to be ready
        await new Promise((resolve) => setTimeout(resolve, 500));


        // Get or create a persistent user ID
        let userId = await mmkvStorage.getItem('revenueCat-userId');
        if (!userId) {
          userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          await mmkvStorage.setItem('revenueCat-userId', userId);
        }

        // Initialize RevenueCat SDK with persistent userId
        await RevenueCatService.initialize(userId);

        // Check premium status
        const customerInfo = await RevenueCatService.getCustomerInfo();

        if (customerInfo) {
          const isPremium = RevenueCatService.isPremium(customerInfo);

          // Check if user has any active subscription (fallback for sandbox)
          const hasActiveSubscription = customerInfo.activeSubscriptions &&
                                       customerInfo.activeSubscriptions.length > 0;

          // Check if any entitlement is active (for sandbox testing)
          const hasActiveEntitlement = customerInfo.entitlements.active &&
                                      Object.keys(customerInfo.entitlements.active).length > 0;

          if (isPremium || hasActiveSubscription || hasActiveEntitlement) {
            setPremium(true);
          } else {
            // NEVER force to false - let the user keep premium if they had it
            // This prevents losing premium status on app restart in sandbox mode
          }
        }

        hasInitialized.current = true;
      } catch (error) {
        hasInitialized.current = true;
      }
    };

    initializeRevenueCat();
  }, [setPremium]);
}

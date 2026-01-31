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

        console.log('Initializing RevenueCat...');

        // Get or create a persistent user ID
        let userId = await mmkvStorage.getItem('revenueCat-userId');
        if (!userId) {
          userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          await mmkvStorage.setItem('revenueCat-userId', userId);
          console.log('Created persistent RevenueCat userId:', userId);
        } else {
          console.log('Using existing RevenueCat userId:', userId);
        }

        // Initialize RevenueCat SDK with persistent userId
        await RevenueCatService.initialize(userId);

        // Check premium status
        console.log('Checking for premium subscription...');
        const customerInfo = await RevenueCatService.getCustomerInfo();

        if (customerInfo) {
          console.log('📋 Customer info:', {
            activeSubscriptions: customerInfo.activeSubscriptions,
            entitlements: customerInfo.entitlements.active,
            allEntitlements: customerInfo.entitlements.all,
          });

          const isPremium = RevenueCatService.isPremium(customerInfo);
          console.log('🔍 isPremium check result:', isPremium);

          // Check if user has any active subscription (fallback for sandbox)
          const hasActiveSubscription = customerInfo.activeSubscriptions &&
                                       customerInfo.activeSubscriptions.length > 0;

          // Check if any entitlement is active (for sandbox testing)
          const hasActiveEntitlement = customerInfo.entitlements.active &&
                                      Object.keys(customerInfo.entitlements.active).length > 0;

          console.log('🔍 Checks:', {
            isPremium,
            hasActiveSubscription,
            hasActiveEntitlement,
            currentPremiumStatus: settings.isPremium,
          });

          if (isPremium || hasActiveSubscription || hasActiveEntitlement) {
            console.log('✅ Premium subscription active! Activating premium...');
            setPremium(true);
          } else {
            console.log('ℹ️ No active premium subscription detected');
            // NEVER force to false - let the user keep premium if they had it
            // This prevents losing premium status on app restart in sandbox mode
            console.log('⚠️ Keeping current premium status:', settings.isPremium);
          }
        } else {
          console.log('⚠️ No customer info available, keeping current premium status');
        }

        hasInitialized.current = true;
      } catch (error) {
        console.error('Error initializing RevenueCat:', error);
        hasInitialized.current = true;
      }
    };

    initializeRevenueCat();
  }, [setPremium]);
}

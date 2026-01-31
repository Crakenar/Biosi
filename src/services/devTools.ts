import AsyncStorage from '@react-native-async-storage/async-storage';
import { mmkvStorage } from './storage';

export const DevTools = {
  /**
   * Check if dev mode is enabled
   */
  isDevMode(): boolean {
    return process.env.EXPO_PUBLIC_ENABLE_DEV_MODE === 'true';
  },

  /**
   * Check if premium should be forced (for testing)
   */
  shouldForcePremium(): boolean {
    return process.env.EXPO_PUBLIC_FORCE_PREMIUM === 'true';
  },

  /**
   * Reset all app data (onboarding, transactions, settings, etc.)
   */
  async resetAllData(): Promise<void> {
    try {
      // Clear MMKV storage using the storage interface
      const keys = ['settings-storage', 'transaction-storage', 'user-storage', 'goals-storage', 'budget-storage'];
      keys.forEach((key) => {
        mmkvStorage.removeItem(key);
      });

      // Clear AsyncStorage
      await AsyncStorage.clear();

      console.log('✅ All app data has been reset');
    } catch (error) {
      console.error('❌ Failed to reset app data:', error);
      throw error;
    }
  },

  /**
   * Reset only onboarding (keep other data)
   */
  async resetOnboarding(): Promise<void> {
    try {
      const settingsData = await mmkvStorage.getItem('settings-storage');
      if (settingsData) {
        const settings = JSON.parse(settingsData);
        settings.state.settings.onboardingCompleted = false;
        await mmkvStorage.setItem('settings-storage', JSON.stringify(settings));
      }
      console.log('✅ Onboarding has been reset');
    } catch (error) {
      console.error('❌ Failed to reset onboarding:', error);
      throw error;
    }
  },

  /**
   * Toggle premium status (for testing)
   */
  async togglePremium(): Promise<boolean> {
    try {
      const settingsData = await mmkvStorage.getItem('settings-storage');
      if (settingsData) {
        const settings = JSON.parse(settingsData);
        const newPremiumStatus = !settings.state.settings.isPremium;
        settings.state.settings.isPremium = newPremiumStatus;
        await mmkvStorage.setItem('settings-storage', JSON.stringify(settings));
        console.log(`✅ Premium status toggled to: ${newPremiumStatus}`);
        return newPremiumStatus;
      }
      return false;
    } catch (error) {
      console.error('❌ Failed to toggle premium:', error);
      throw error;
    }
  },

  /**
   * Set premium status
   */
  async setPremium(isPremium: boolean): Promise<void> {
    try {
      const settingsData = await mmkvStorage.getItem('settings-storage');
      if (settingsData) {
        const settings = JSON.parse(settingsData);
        settings.state.settings.isPremium = isPremium;
        await mmkvStorage.setItem('settings-storage', JSON.stringify(settings));
        console.log(`✅ Premium set to: ${isPremium}`);
      }
    } catch (error) {
      console.error('❌ Failed to set premium:', error);
      throw error;
    }
  },

  /**
   * Add mock transactions (for testing)
   * This function is imported and called by DevSettingsScreen with the store
   */
  getMockTransactions(count: number = 20) {
    const categories = ['food', 'shopping', 'entertainment', 'transport', 'health', 'other'];
    const items = [
      'Coffee',
      'Lunch',
      'Movie ticket',
      'Groceries',
      'Uber ride',
      'Gym membership',
      'New shoes',
      'Book',
      'Concert ticket',
      'Phone bill',
    ];

    const mockTransactions = [];
    for (let i = 0; i < count; i++) {
      const daysAgo = Math.floor(Math.random() * 180); // Random date in last 6 months
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);

      const price = Math.random() * 100 + 5;
      const isPurchased = Math.random() > 0.3;

      mockTransactions.push({
        id: `mock_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 9)}`,
        type: isPurchased ? 'purchased' : 'saved',
        itemPrice: parseFloat(price.toFixed(2)),
        hoursOfWork: parseFloat((price / 15).toFixed(2)),
        timestamp: date.toISOString(),
        label: items[Math.floor(Math.random() * items.length)],
        category: categories[Math.floor(Math.random() * categories.length)],
        note: Math.random() > 0.7 ? 'Mock transaction' : undefined,
      });
    }

    return mockTransactions;
  },
};

import { Platform } from 'react-native';

export const REVENUECAT_CONFIG = {
  // RevenueCat API Keys
  // TODO: Replace with your actual RevenueCat API keys from https://app.revenuecat.com/
  apiKey: Platform.select({
    ios: process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY || 'appl_YOUR_IOS_KEY',
    android: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY || 'goog_YOUR_ANDROID_KEY',
    default: '',
  }),

  // Product IDs - must match your App Store Connect / Google Play Console setup
  products: {
    premium: 'premium_monthly', // €1/month premium subscription
  },

  // Entitlement IDs - must match your RevenueCat dashboard setup
  entitlements: {
    premium: 'Biosi Pro', // Premium entitlement identifier (must match RevenueCat dashboard)
  },
};

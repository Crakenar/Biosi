import { Platform } from 'react-native';
import * as RNIap from 'react-native-iap';

// Product IDs for the premium theme
const PREMIUM_THEME_IOS = 'com.biosi.premium_theme';
const PREMIUM_THEME_ANDROID = 'premium_theme';

export const PREMIUM_PRODUCT_ID = Platform.select({
  ios: PREMIUM_THEME_IOS,
  android: PREMIUM_THEME_ANDROID,
}) || PREMIUM_THEME_IOS;

export interface PurchaseError {
  code: string;
  message: string;
}

class IAPService {
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      await RNIap.initConnection();
      this.initialized = true;
      console.log('IAP connection initialized');

      // Set up purchase update listener
      this.setupPurchaseUpdateListener();
    } catch (error) {
      console.error('Error initializing IAP:', error);
      throw error;
    }
  }

  private setupPurchaseUpdateListener() {
    const purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(
      async (purchase) => {
        console.log('Purchase updated:', purchase);
        const receipt = purchase.transactionId;

        if (receipt) {
          try {
            // Acknowledge purchase for Android
            if (Platform.OS === 'android' && purchase.purchaseToken) {
              await RNIap.acknowledgePurchaseAndroid(purchase.purchaseToken);
            }

            // Finish transaction for iOS
            await RNIap.finishTransaction({ purchase });

            console.log('Purchase successfully processed');
          } catch (error) {
            console.error('Error finishing purchase:', error);
          }
        }
      }
    );

    const purchaseErrorSubscription = RNIap.purchaseErrorListener(
      (error) => {
        console.error('Purchase error:', error);
      }
    );
  }

  async getProducts(): Promise<any[]> {
    try {
      await this.initialize();
      const products = await RNIap.fetchProducts({ skus: [PREMIUM_PRODUCT_ID] });
      console.log('Products fetched:', products);
      return products || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  async purchasePremium(): Promise<boolean> {
    try {
      await this.initialize();

      const purchase = await RNIap.requestPurchase({ sku: PREMIUM_PRODUCT_ID } as any);

      console.log('Purchase result:', purchase);
      return true;
    } catch (error: any) {
      console.error('Purchase error:', error);

      // User cancelled
      if (error.code === 'E_USER_CANCELLED') {
        return false;
      }

      throw error;
    }
  }

  async restorePurchases(): Promise<boolean> {
    try {
      await this.initialize();

      const purchases = await RNIap.getAvailablePurchases();
      console.log('Available purchases:', purchases);

      // Check if premium theme was purchased
      const hasPremium = purchases.some(
        (purchase) => purchase.productId === PREMIUM_PRODUCT_ID
      );

      return hasPremium;
    } catch (error: any) {
      console.error('Error restoring purchases:', error);

      // Don't throw error on restore - just return false
      // This prevents blocking the app startup if stores are unavailable
      // (e.g., in development, no network, etc.)
      return false;
    }
  }

  async endConnection(): Promise<void> {
    if (this.initialized) {
      try {
        await RNIap.endConnection();
        this.initialized = false;
        console.log('IAP connection ended');
      } catch (error) {
        console.error('Error ending IAP connection:', error);
      }
    }
  }
}

export const iapService = new IAPService();

import Purchases, {
  CustomerInfo,
  PurchasesOffering,
  PurchasesPackage,
  LOG_LEVEL,
} from 'react-native-purchases';
import { Platform } from 'react-native';
import { REVENUECAT_CONFIG } from '../config/revenuecat';

class RevenueCatService {
  private static instance: RevenueCatService;
  private isConfigured = false;

  private constructor() {}

  static getInstance(): RevenueCatService {
    if (!RevenueCatService.instance) {
      RevenueCatService.instance = new RevenueCatService();
    }
    return RevenueCatService.instance;
  }

  /**
   * Initialize RevenueCat SDK
   * Should be called once at app startup
   */
  async initialize(userId?: string): Promise<void> {
    if (this.isConfigured) {
      console.log('RevenueCat already configured');
      return;
    }

    try {
      const apiKey = REVENUECAT_CONFIG.apiKey;

      if (!apiKey || apiKey.includes('YOUR')) {
        console.warn('⚠️ RevenueCat API key not configured. Premium features will not work.');
        console.warn('Add your API keys to .env file or src/config/revenuecat.ts');
        return;
      }

      // Configure SDK
      Purchases.setLogLevel(LOG_LEVEL.DEBUG); // Change to INFO or ERROR in production

      await Purchases.configure({
        apiKey,
        appUserID: userId, // Optional: anonymous if not provided
      });

      this.isConfigured = true;
      console.log('✅ RevenueCat configured successfully');

      // Set up listener for customer info updates
      Purchases.addCustomerInfoUpdateListener((info) => {
        console.log('Customer info updated:', this.isPremium(info));
      });
    } catch (error) {
      console.error('❌ Failed to configure RevenueCat:', error);
    }
  }

  /**
   * Check if user has premium entitlement
   */
  isPremium(customerInfo: CustomerInfo): boolean {
    return (
      customerInfo.entitlements.active[REVENUECAT_CONFIG.entitlements.premium] !== undefined
    );
  }

  /**
   * Get current customer info (includes premium status)
   */
  async getCustomerInfo(): Promise<CustomerInfo | null> {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      return customerInfo;
    } catch (error) {
      console.error('Failed to get customer info:', error);
      return null;
    }
  }

  /**
   * Check if user is premium
   */
  async checkPremiumStatus(): Promise<boolean> {
    try {
      const customerInfo = await this.getCustomerInfo();
      if (!customerInfo) return false;
      return this.isPremium(customerInfo);
    } catch (error) {
      console.error('Failed to check premium status:', error);
      return false;
    }
  }

  /**
   * Get available offerings (subscription packages)
   */
  async getOfferings(): Promise<PurchasesOffering | null> {
    try {
      const offerings = await Purchases.getOfferings();
      return offerings.current;
    } catch (error) {
      console.error('Failed to get offerings:', error);
      return null;
    }
  }

  /**
   * Purchase a package
   */
  async purchasePackage(packageToBuy: PurchasesPackage): Promise<{
    customerInfo: CustomerInfo | null;
    error: string | null;
  }> {
    try {
      const { customerInfo } = await Purchases.purchasePackage(packageToBuy);
      return { customerInfo, error: null };
    } catch (error: any) {
      if (error.userCancelled) {
        return { customerInfo: null, error: 'Purchase cancelled' };
      }
      console.error('Purchase failed:', error);
      return { customerInfo: null, error: error.message || 'Purchase failed' };
    }
  }

  /**
   * Restore previous purchases
   */
  async restorePurchases(): Promise<{
    customerInfo: CustomerInfo | null;
    error: string | null;
  }> {
    try {
      const customerInfo = await Purchases.restorePurchases();
      return { customerInfo, error: null };
    } catch (error: any) {
      console.error('Restore failed:', error);
      return { customerInfo: null, error: error.message || 'Restore failed' };
    }
  }

  /**
   * Identify user (optional - for linking purchases to a user ID)
   */
  async login(userId: string): Promise<void> {
    try {
      await Purchases.logIn(userId);
      console.log('User logged in to RevenueCat:', userId);
    } catch (error) {
      console.error('Failed to login to RevenueCat:', error);
    }
  }

  /**
   * Log out user
   */
  async logout(): Promise<void> {
    try {
      await Purchases.logOut();
      console.log('User logged out from RevenueCat');
    } catch (error) {
      console.error('Failed to logout from RevenueCat:', error);
    }
  }
}

export default RevenueCatService.getInstance();

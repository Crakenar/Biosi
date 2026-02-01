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
      return;
    }

    try {
      const apiKey = REVENUECAT_CONFIG.apiKey;

      if (!apiKey || apiKey.includes('YOUR')) {
        return;
      }

      // Configure SDK
      Purchases.setLogLevel(LOG_LEVEL.DEBUG); // Change to INFO or ERROR in production

      await Purchases.configure({
        apiKey,
        appUserID: userId, // Optional: anonymous if not provided
      });

      this.isConfigured = true;

      // Set up listener for customer info updates
      Purchases.addCustomerInfoUpdateListener((info) => {
      });
    } catch (error) {
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
      return { customerInfo: null, error: error.message || 'Restore failed' };
    }
  }

  /**
   * Identify user (optional - for linking purchases to a user ID)
   */
  async login(userId: string): Promise<void> {
    try {
      await Purchases.logIn(userId);
    } catch (error) {
    }
  }

  /**
   * Log out user
   */
  async logout(): Promise<void> {
    try {
      await Purchases.logOut();
    } catch (error) {
    }
  }
}

export default RevenueCatService.getInstance();

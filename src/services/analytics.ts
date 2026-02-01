// Analytics Service for tracking user events
// Can be integrated with Firebase Analytics, Segment, Amplitude, etc.

export type AnalyticsEvent =
  | 'purchase_recorded'
  | 'savings_recorded'
  | 'goal_created'
  | 'goal_completed'
  | 'goal_75_percent'
  | 'budget_created'
  | 'budget_alert_triggered'
  | 'budget_exceeded'
  | 'premium_purchased'
  | 'premium_trial_started'
  | 'onboarding_completed'
  | 'export_csv'
  | 'export_summary'
  | 'category_selected'
  | 'theme_changed'
  | 'currency_changed';

interface AnalyticsProperties {
  [key: string]: string | number | boolean | undefined;
}

class AnalyticsService {
  private static instance: AnalyticsService;
  private enabled: boolean = true;

  private constructor() {
    // Initialize analytics SDK here (Firebase, Segment, etc.)
    // For now, this is a placeholder that logs to console in dev mode
  }

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  /**
   * Track an analytics event
   */
  trackEvent(event: AnalyticsEvent, properties?: AnalyticsProperties): void {
    if (!this.enabled) return;

    try {
      // In production, send to analytics service
      // For now, log in dev mode only
      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.log(`[Analytics] ${event}`, properties || {});
      }

      // Example: Firebase Analytics
      // import analytics from '@react-native-firebase/analytics';
      // analytics().logEvent(event, properties);

      // Example: Segment
      // import Analytics from '@segment/analytics-react-native';
      // Analytics.track(event, properties);

      // Example: Amplitude
      // import { Amplitude } from '@amplitude/analytics-react-native';
      // Amplitude.getInstance().logEvent(event, properties);
    } catch (error) {
      // Silently fail - analytics errors shouldn't crash the app
    }
  }

  /**
   * Track purchase event
   */
  trackPurchase(amount: number, currency: string, category?: string): void {
    this.trackEvent('purchase_recorded', {
      amount,
      currency,
      category,
    });
  }

  /**
   * Track savings event
   */
  trackSavings(amount: number, currency: string, category?: string): void {
    this.trackEvent('savings_recorded', {
      amount,
      currency,
      category,
    });
  }

  /**
   * Track goal created
   */
  trackGoalCreated(targetAmount: number, currency: string): void {
    this.trackEvent('goal_created', {
      target_amount: targetAmount,
      currency,
    });
  }

  /**
   * Track goal completed
   */
  trackGoalCompleted(goalName: string, targetAmount: number, daysToComplete: number): void {
    this.trackEvent('goal_completed', {
      goal_name: goalName,
      target_amount: targetAmount,
      days_to_complete: daysToComplete,
    });
  }

  /**
   * Track goal progress milestone (75%)
   */
  trackGoalProgress(goalName: string, percentage: number): void {
    this.trackEvent('goal_75_percent', {
      goal_name: goalName,
      percentage,
    });
  }

  /**
   * Track budget created
   */
  trackBudgetCreated(amount: number, period: 'daily' | 'weekly' | 'monthly'): void {
    this.trackEvent('budget_created', {
      amount,
      period,
    });
  }

  /**
   * Track budget alert triggered
   */
  trackBudgetAlert(percentage: number, period: string): void {
    this.trackEvent('budget_alert_triggered', {
      percentage,
      period,
    });
  }

  /**
   * Track budget exceeded
   */
  trackBudgetExceeded(percentage: number, period: string): void {
    this.trackEvent('budget_exceeded', {
      percentage,
      period,
    });
  }

  /**
   * Track premium purchase
   */
  trackPremiumPurchase(packageId: string, price: number): void {
    this.trackEvent('premium_purchased', {
      package_id: packageId,
      price,
    });
  }

  /**
   * Track data export
   */
  trackExport(type: 'csv' | 'summary' | 'pdf', transactionCount: number): void {
    const event = type === 'csv' ? 'export_csv' : 'export_summary';
    this.trackEvent(event, {
      transaction_count: transactionCount,
    });
  }

  /**
   * Set user properties
   */
  setUserProperties(properties: AnalyticsProperties): void {
    if (!this.enabled) return;

    try {
      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.log('[Analytics] User Properties', properties);
      }

      // Example: Firebase Analytics
      // import analytics from '@react-native-firebase/analytics';
      // analytics().setUserProperties(properties);
    } catch (error) {
      // Silently fail
    }
  }

  /**
   * Set user ID
   */
  setUserId(userId: string): void {
    if (!this.enabled) return;

    try {
      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.log('[Analytics] User ID', userId);
      }

      // Example: Firebase Analytics
      // import analytics from '@react-native-firebase/analytics';
      // analytics().setUserId(userId);
    } catch (error) {
      // Silently fail
    }
  }

  /**
   * Enable/disable analytics
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }
}

export default AnalyticsService.getInstance();

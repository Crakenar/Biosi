import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import i18n from './i18n';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

class NotificationService {
  private static instance: NotificationService;

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async requestPermissions(): Promise<boolean> {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      return finalStatus === 'granted';
    } catch (error) {
      return false;
    }
  }

  async scheduleBudgetAlert(
    budgetId: string,
    title: string,
    body: string
  ): Promise<string | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        return null;
      }

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: { budgetId },
        },
        trigger: null, // Immediate notification
      });

      return notificationId;
    } catch (error) {
      return null;
    }
  }

  async cancelNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
    }
  }

  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
    }
  }

  async scheduleGoalAlert(
    goalId: string,
    title: string,
    body: string
  ): Promise<string | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        return null;
      }

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: { goalId, type: 'goal' },
        },
        trigger: null, // Immediate notification
      });

      return notificationId;
    } catch (error) {
      return null;
    }
  }

  async scheduleGoalCompletionAlert(
    goalId: string,
    goalName: string,
    targetAmount: number,
    currency: string
  ): Promise<string | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        return null;
      }

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: i18n.t('notifications.goalCompleted.title'),
          body: i18n.t('notifications.goalCompleted.body', {
            goalName,
            currency,
            targetAmount: targetAmount.toFixed(2),
          }),
          data: { goalId, type: 'goal_completed' },
        },
        trigger: null, // Immediate notification
      });

      return notificationId;
    } catch (error) {
      return null;
    }
  }

  async scheduleGoalProgressAlert(
    goalId: string,
    goalName: string,
    percentage: number
  ): Promise<string | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        return null;
      }

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: i18n.t('notifications.goalProgress.title'),
          body: i18n.t('notifications.goalProgress.body', {
            percentage: percentage.toFixed(0),
            goalName,
          }),
          data: { goalId, type: 'goal_progress' },
        },
        trigger: null, // Immediate notification
      });

      return notificationId;
    } catch (error) {
      return null;
    }
  }

  async scheduleBudgetExceededAlert(
    budgetId: string,
    period: string,
    percentage: number,
    spent: number,
    budget: number,
    currency: string
  ): Promise<string | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        return null;
      }

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: i18n.t('notifications.budgetExceeded.title'),
          body: i18n.t('notifications.budgetExceeded.body', {
            percentage: percentage.toFixed(0),
            period,
            spent: `${currency}${spent.toFixed(2)}`,
            budget: `${currency}${budget}`,
          }),
          data: { budgetId, type: 'budget_exceeded' },
        },
        trigger: null, // Immediate notification
      });

      return notificationId;
    } catch (error) {
      return null;
    }
  }
}

export default NotificationService.getInstance();

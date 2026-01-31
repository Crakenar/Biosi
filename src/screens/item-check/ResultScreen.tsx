import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { DashboardStackParamList } from '../../navigation/types';
import { useTheme } from '../../contexts/ThemeContext';
import { useUserStore } from '../../store/userStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useBudgetStore } from '../../store/budgetStore';
import { useGoalsStore } from '../../store/goalsStore';
import { useTransactionStore } from '../../store/transactionStore';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { formatHours } from '../../services/calculations';
import { formatCurrency } from '../../utils/formatters';
import { useTranslation } from 'react-i18next';
import { Modal } from '../../components/common/Modal';
import {
  startOfDay,
  startOfWeek,
  startOfMonth,
  isWithinInterval,
  endOfDay,
  endOfWeek,
  endOfMonth,
} from 'date-fns';

type ResultNavigationProp = StackNavigationProp<DashboardStackParamList, 'Result'>;
type ResultRouteProp = RouteProp<DashboardStackParamList, 'Result'>;

export const ResultScreen: React.FC = () => {
  const navigation = useNavigation<ResultNavigationProp>();
  const route = useRoute<ResultRouteProp>();
  const { theme } = useTheme();
  const { user } = useUserStore();
  const { settings } = useSettingsStore();
  const { budgets } = useBudgetStore();
  const { goals, updateGoalProgress } = useGoalsStore();
  const { transactions } = useTransactionStore();
  const { t } = useTranslation();

  const { type, price, hours } = route.params;

  const scaleAnim = new Animated.Value(0);
  const [showBudgetAlert, setShowBudgetAlert] = useState(false);
  const [budgetAlertData, setBudgetAlertData] = useState<{
    percentage: number;
    periodName: string;
    totalSpent: number;
    budgetAmount: number;
  } | null>(null);
  const [showGoalAlert, setShowGoalAlert] = useState(false);
  const [goalAlertData, setGoalAlertData] = useState<{
    goalName: string;
    goalIcon: string;
    percentage: number;
    currentAmount: number;
    targetAmount: number;
    completed: boolean;
  } | null>(null);

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
  }, []);

  const checkBudgetAlertsSync = (): boolean => {
    const now = new Date();

    for (const budget of budgets) {
      if (!budget.enabled) continue;

      let periodStart: Date;
      let periodEnd: Date;

      switch (budget.period) {
        case 'daily':
          periodStart = startOfDay(now);
          periodEnd = endOfDay(now);
          break;
        case 'weekly':
          periodStart = startOfWeek(now, { weekStartsOn: 1 });
          periodEnd = endOfWeek(now, { weekStartsOn: 1 });
          break;
        case 'monthly':
          periodStart = startOfMonth(now);
          periodEnd = endOfMonth(now);
          break;
      }

      const periodTransactions = transactions.filter(
        (t) =>
          t.type === 'purchased' &&
          isWithinInterval(new Date(t.timestamp), { start: periodStart, end: periodEnd })
      );

      const totalSpent = periodTransactions.reduce((sum, t) => sum + t.itemPrice, 0);
      const percentage = (totalSpent / budget.amount) * 100;

      if (percentage >= budget.alertThreshold) {
        const periodName = budget.period === 'daily' ? 'today' : budget.period === 'weekly' ? 'this week' : 'this month';

        setBudgetAlertData({
          percentage,
          periodName,
          totalSpent,
          budgetAmount: budget.amount,
        });
        setShowBudgetAlert(true);
        return true; // Found an alert to show
      }
    }
    return false; // No alerts
  };

  const checkBudgetAlerts = () => {
    checkBudgetAlertsSync();
  };

  const checkGoalAlertsSync = (): boolean => {
    // Sort goals by creation date to prioritize oldest goals first
    const sortedGoals = [...goals].sort((a, b) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    for (const goal of sortedGoals) {
      if (goal.completed) continue; // Skip completed goals

      // Calculate what the new amount would be
      const previousAmount = goal.currentAmount;
      const newCurrentAmount = Math.min(goal.currentAmount + price, goal.targetAmount);
      const percentage = (newCurrentAmount / goal.targetAmount) * 100;
      const previousPercentage = (previousAmount / goal.targetAmount) * 100;

      // Check if we just completed the goal or reached 75%+ for the first time
      const justCompleted = percentage >= 100 && previousPercentage < 100;
      const justReached75 = percentage >= 75 && previousPercentage < 75;

      if (justCompleted || justReached75) {
        // UPDATE THE GOAL PROGRESS
        updateGoalProgress(goal.id, price);

        setGoalAlertData({
          goalName: goal.name,
          goalIcon: goal.icon,
          percentage,
          currentAmount: newCurrentAmount,
          targetAmount: goal.targetAmount,
          completed: justCompleted,
        });
        setShowGoalAlert(true);
        return true;
      }
    }

    // If no alert was triggered, still update the first incomplete goal with the savings
    const firstIncompleteGoal = sortedGoals.find(g => !g.completed);
    if (firstIncompleteGoal) {
      updateGoalProgress(firstIncompleteGoal.id, price);
    }

    return false;
  };

  const handleDone = () => {
    if (settings.isPremium) {
      // Check budget alerts for purchases
      if (type === 'purchased' && budgets.length > 0) {
        if (checkBudgetAlertsSync()) {
          return; // Don't navigate yet, show budget alert first
        }
      }

      // Check goal alerts for savings
      if (type === 'saved' && goals.length > 0) {
        if (checkGoalAlertsSync()) {
          return; // Don't navigate yet, show goal alert first
        }
      }
    }

    navigation.navigate('DashboardMain');
  };

  if (!user) {
    return null;
  }

  const isPurchase = type === 'purchased';
  const emoji = isPurchase ? '💸' : '🎉';
  const title = isPurchase ? 'Purchase Recorded' : 'Great Choice!';
  const message = isPurchase
    ? `You spent ${formatHours(hours, settings.workHoursPerDay)} of work on this item.`
    : `You saved ${formatHours(hours, settings.workHoursPerDay)} of work by not buying this item!`;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: theme.spacing.xl,
        justifyContent: 'center',
      }}
    >
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
        }}
      >
        <Text
          style={{
            fontSize: 80,
            textAlign: 'center',
            marginBottom: theme.spacing.xl,
          }}
        >
          {emoji}
        </Text>

        <Text
          style={{
            fontSize: theme.typography.sizes.xxl,
            fontWeight: 'bold',
            color: theme.colors.text,
            textAlign: 'center',
            marginBottom: theme.spacing.md,
          }}
        >
          {title}
        </Text>

        <Text
          style={{
            fontSize: theme.typography.sizes.lg,
            color: theme.colors.textSecondary,
            textAlign: 'center',
            marginBottom: theme.spacing.xl,
          }}
        >
          {message}
        </Text>

        <Card variant="elevated" style={{ marginBottom: theme.spacing.xl }}>
          <View style={styles.detailRow}>
            <Text
              style={{
                fontSize: theme.typography.sizes.md,
                color: theme.colors.textSecondary,
              }}
            >
              Amount
            </Text>
            <Text
              style={{
                fontSize: theme.typography.sizes.lg,
                fontWeight: 'bold',
                color: theme.colors.text,
              }}
            >
              {formatCurrency(price, user.currency)}
            </Text>
          </View>

          <View
            style={{
              height: 1,
              backgroundColor: theme.colors.border,
              marginVertical: theme.spacing.md,
            }}
          />

          <View style={styles.detailRow}>
            <Text
              style={{
                fontSize: theme.typography.sizes.md,
                color: theme.colors.textSecondary,
              }}
            >
              Hours of Work
            </Text>
            <Text
              style={{
                fontSize: theme.typography.sizes.lg,
                fontWeight: 'bold',
                color: isPurchase ? theme.colors.error : theme.colors.success,
              }}
            >
              {formatHours(hours, settings.workHoursPerDay)}
            </Text>
          </View>
        </Card>

        <Button title="Done" onPress={handleDone} size="large" />
      </Animated.View>

      {/* Budget Alert Modal */}
      {budgetAlertData && (
        <Modal
          visible={showBudgetAlert}
          onClose={() => {
            setShowBudgetAlert(false);
            navigation.navigate('DashboardMain');
          }}
          title={t('budget.alert.title')}
          message={
            budgetAlertData.percentage >= 100
              ? t('budget.alert.exceeded', {
                  percentage: budgetAlertData.percentage.toFixed(0),
                  period: t(`budget.period.${budgetAlertData.periodName}`),
                  spent: formatCurrency(budgetAlertData.totalSpent, user?.currency || 'USD'),
                  budget: formatCurrency(budgetAlertData.budgetAmount, user?.currency || 'USD'),
                })
              : t('budget.alert.reached', {
                  percentage: budgetAlertData.percentage.toFixed(0),
                  period: t(`budget.period.${budgetAlertData.periodName}`),
                  spent: formatCurrency(budgetAlertData.totalSpent, user?.currency || 'USD'),
                  budget: formatCurrency(budgetAlertData.budgetAmount, user?.currency || 'USD'),
                })
          }
          icon="⚠️"
          iconColor="#FFB84D"
          actions={[
            {
              label: t('common.gotIt'),
              onPress: () => {
                setShowBudgetAlert(false);
                navigation.navigate('DashboardMain');
              },
              variant: 'primary',
            },
          ]}
          dismissable={false}
        />
      )}

      {/* Goal Alert Modal */}
      {goalAlertData && (
        <Modal
          visible={showGoalAlert}
          onClose={() => {
            setShowGoalAlert(false);
            navigation.navigate('DashboardMain');
          }}
          title={goalAlertData.completed ? t('goals.alert.completed') : t('goals.alert.progress')}
          message={
            goalAlertData.completed
              ? t('goals.alert.completedMessage', {
                  icon: goalAlertData.goalIcon,
                  name: goalAlertData.goalName,
                  amount: formatCurrency(goalAlertData.targetAmount, user?.currency || 'USD'),
                })
              : t('goals.alert.progressMessage', {
                  icon: goalAlertData.goalIcon,
                  name: goalAlertData.goalName,
                  percentage: goalAlertData.percentage.toFixed(0),
                  current: formatCurrency(goalAlertData.currentAmount, user?.currency || 'USD'),
                  target: formatCurrency(goalAlertData.targetAmount, user?.currency || 'USD'),
                })
          }
          icon={goalAlertData.completed ? '🎉' : '🎯'}
          iconColor={goalAlertData.completed ? '#4ECDC4' : theme.colors.primary}
          actions={[
            {
              label: t('common.gotIt'),
              onPress: () => {
                setShowGoalAlert(false);
                navigation.navigate('DashboardMain');
              },
              variant: 'primary',
            },
          ]}
          dismissable={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

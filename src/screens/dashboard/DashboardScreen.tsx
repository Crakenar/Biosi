import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { DashboardStackParamList } from '../../navigation/types';
import { useTheme } from '../../contexts/ThemeContext';
import { useUserStore } from '../../store/userStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useMonthlyStats } from '../../hooks/useMonthlyStats';
import { useYearlyStats } from '../../hooks/useYearlyStats';
import { Button } from '../../components/common/Button';
import { MetricCard } from '../../components/dashboard/MetricCard';
import { SpendingChart } from '../../components/charts/SpendingChart';
import { SavingsChart } from '../../components/charts/SavingsChart';
import { CompoundInterestChart } from '../../components/charts/CompoundInterestChart';
import { formatCurrency } from '../../utils/formatters';
import { formatHours } from '../../services/calculations';
import { useTranslation } from 'react-i18next';

type DashboardNavigationProp = StackNavigationProp<DashboardStackParamList, 'DashboardMain'>;

export const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<DashboardNavigationProp>();
  const { theme } = useTheme();
  const { user } = useUserStore();
  const { settings } = useSettingsStore();
  const { t } = useTranslation();
  const monthlyStats = useMonthlyStats();
  const yearlyStats = useYearlyStats();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const hasTransactions = monthlyStats.purchaseCount > 0 || monthlyStats.saveCount > 0;

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <View style={{ padding: theme.spacing.xl, paddingTop: theme.spacing.xxl * 1.5 }}>
          <Text
            style={{
              fontSize: theme.typography.sizes.xxl,
              fontWeight: 'bold',
              color: theme.colors.text,
              marginBottom: theme.spacing.xs,
            }}
          >
            {t('dashboard.greeting', { name: user.name })}
          </Text>
          <Text
            style={{
              fontSize: theme.typography.sizes.md,
              color: theme.colors.textSecondary,
            }}
          >
            {t('dashboard.subtitle')}
          </Text>
        </View>

        {/* Monthly Stats */}
        <View style={{ paddingHorizontal: theme.spacing.md, marginBottom: theme.spacing.lg }}>
          <Text
            style={{
              fontSize: theme.typography.sizes.md,
              fontWeight: '600',
              color: theme.colors.text,
              marginBottom: theme.spacing.md,
              paddingHorizontal: theme.spacing.sm,
            }}
          >
            {t('dashboard.thisMonth')}
          </Text>
          <View style={{ flexDirection: 'row' }}>
            <MetricCard
              title={t('dashboard.spent')}
              value={settings.displayMode === 'hours'
                ? formatHours(monthlyStats.totalHoursSpent, settings.workHoursPerDay)
                : formatCurrency(monthlyStats.totalSpent, user.currency)}
              subtitle={monthlyStats.purchaseCount === 1 ? t('dashboard.purchasesOne', { count: monthlyStats.purchaseCount }) : t('dashboard.purchases', { count: monthlyStats.purchaseCount })}
              color="error"
              icon="💸"
            />
            <MetricCard
              title={t('dashboard.saved')}
              value={settings.displayMode === 'hours'
                ? formatHours(monthlyStats.totalHoursSaved, settings.workHoursPerDay)
                : formatCurrency(monthlyStats.totalSaved, user.currency)}
              subtitle={monthlyStats.saveCount === 1 ? t('dashboard.savesOne', { count: monthlyStats.saveCount }) : t('dashboard.saves', { count: monthlyStats.saveCount })}
              color="success"
              icon="🎯"
            />
          </View>
        </View>

        {/* Yearly Stats */}
        <View style={{ paddingHorizontal: theme.spacing.md, marginBottom: theme.spacing.lg }}>
          <Text
            style={{
              fontSize: theme.typography.sizes.md,
              fontWeight: '600',
              color: theme.colors.text,
              marginBottom: theme.spacing.md,
              paddingHorizontal: theme.spacing.sm,
            }}
          >
            {t('dashboard.thisYear')}
          </Text>
          <View style={{ flexDirection: 'row' }}>
            <MetricCard
              title={t('dashboard.spent')}
              value={settings.displayMode === 'hours'
                ? formatHours(yearlyStats.totalHoursSpent, settings.workHoursPerDay)
                : formatCurrency(yearlyStats.totalSpent, user.currency)}
              subtitle={yearlyStats.purchaseCount === 1 ? t('dashboard.purchasesOne', { count: yearlyStats.purchaseCount }) : t('dashboard.purchases', { count: yearlyStats.purchaseCount })}
              color="error"
            />
            <MetricCard
              title={t('dashboard.saved')}
              value={settings.displayMode === 'hours'
                ? formatHours(yearlyStats.totalHoursSaved, settings.workHoursPerDay)
                : formatCurrency(yearlyStats.totalSaved, user.currency)}
              subtitle={yearlyStats.saveCount === 1 ? t('dashboard.savesOne', { count: yearlyStats.saveCount }) : t('dashboard.saves', { count: yearlyStats.saveCount })}
              color="success"
            />
          </View>
        </View>

        {/* Charts */}
        {hasTransactions ? (
          <>
            <SpendingChart />
            <SavingsChart />
            <CompoundInterestChart />
          </>
        ) : (
          <View
            style={{
              padding: theme.spacing.xl,
              alignItems: 'center',
              justifyContent: 'center',
              marginVertical: theme.spacing.xl,
            }}
          >
            <Text style={{ fontSize: 64, marginBottom: theme.spacing.md }}>🤔</Text>
            <Text
              style={{
                fontSize: theme.typography.sizes.lg,
                fontWeight: 'bold',
                color: theme.colors.text,
                textAlign: 'center',
                marginBottom: theme.spacing.sm,
              }}
            >
              {t('dashboard.noTransactions')}
            </Text>
            <Text
              style={{
                fontSize: theme.typography.sizes.md,
                color: theme.colors.textSecondary,
                textAlign: 'center',
              }}
            >
              {t('dashboard.noTransactionsDesc')}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: theme.spacing.sm,
          backgroundColor: theme.colors.background,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
        }}
      >
        <Button
          title={t('dashboard.checkItemWorth')}
          onPress={() => navigation.navigate('ItemCheck')}
          size="large"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});

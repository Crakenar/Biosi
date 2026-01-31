import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useTransactionStore } from '../../store/transactionStore';
import { useUserStore } from '../../store/userStore';
import { formatCurrency } from '../../utils/formatters';
import { DateRangeSelector } from './DateRangeSelector';
import { isWithinInterval, startOfDay, endOfDay, differenceInDays } from 'date-fns';

export function CustomPeriodAnalytics() {
  const { theme } = useTheme();
  const { transactions } = useTransactionStore();
  const { user } = useUserStore();

  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30); // Default: last 30 days
    return date;
  });

  const [endDate, setEndDate] = useState(new Date());

  const analytics = useMemo(() => {
    const range = {
      start: startOfDay(startDate),
      end: endOfDay(endDate),
    };

    const transactionsInRange = transactions.filter((t) =>
      isWithinInterval(new Date(t.timestamp), range)
    );

    const purchased = transactionsInRange.filter((t) => t.type === 'purchased');
    const saved = transactionsInRange.filter((t) => t.type === 'saved');

    const totalSpent = purchased.reduce((sum, t) => sum + t.itemPrice, 0);
    const totalSaved = saved.reduce((sum, t) => sum + t.itemPrice, 0);
    const totalHoursSpent = purchased.reduce((sum, t) => sum + t.hoursOfWork, 0);
    const totalHoursSaved = saved.reduce((sum, t) => sum + t.hoursOfWork, 0);

    const dayCount = differenceInDays(endOfDay(endDate), startOfDay(startDate)) + 1;
    const avgSpendingPerDay = totalSpent / dayCount;

    return {
      totalTransactions: transactionsInRange.length,
      purchaseCount: purchased.length,
      saveCount: saved.length,
      totalSpent,
      totalSaved,
      totalHoursSpent,
      totalHoursSaved,
      dayCount,
      avgSpendingPerDay,
    };
  }, [transactions, startDate, endDate]);

  return (
    <ScrollView style={styles.container}>
      <DateRangeSelector
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
      />

      <View style={[styles.statsContainer, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.statsTitle, { color: theme.colors.text }]}>
          Period Summary
        </Text>

        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              Total Transactions
            </Text>
            <Text style={[styles.statValue, { color: theme.colors.text }]}>
              {analytics.totalTransactions}
            </Text>
          </View>

          <View style={styles.statBox}>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              Days
            </Text>
            <Text style={[styles.statValue, { color: theme.colors.text }]}>
              {analytics.dayCount}
            </Text>
          </View>

          <View style={styles.statBox}>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              Purchases
            </Text>
            <Text style={[styles.statValue, { color: theme.colors.text }]}>
              {analytics.purchaseCount}
            </Text>
          </View>

          <View style={styles.statBox}>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              Items Saved
            </Text>
            <Text style={[styles.statValue, { color: theme.colors.text }]}>
              {analytics.saveCount}
            </Text>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

        <View style={styles.mainStats}>
          <View style={styles.mainStatItem}>
            <Text style={[styles.mainStatLabel, { color: theme.colors.textSecondary }]}>
              Total Spent
            </Text>
            <Text style={[styles.mainStatValue, { color: '#FF6B6B' }]}>
              {user ? formatCurrency(analytics.totalSpent, user.currency) : `$${analytics.totalSpent.toFixed(2)}`}
            </Text>
            <Text style={[styles.mainStatSub, { color: theme.colors.textSecondary }]}>
              {analytics.totalHoursSpent.toFixed(1)} hours of work
            </Text>
          </View>

          <View style={styles.mainStatItem}>
            <Text style={[styles.mainStatLabel, { color: theme.colors.textSecondary }]}>
              Total Saved
            </Text>
            <Text style={[styles.mainStatValue, { color: '#4ECDC4' }]}>
              {user ? formatCurrency(analytics.totalSaved, user.currency) : `$${analytics.totalSaved.toFixed(2)}`}
            </Text>
            <Text style={[styles.mainStatSub, { color: theme.colors.textSecondary }]}>
              {analytics.totalHoursSaved.toFixed(1)} hours saved
            </Text>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

        <View style={styles.insight}>
          <Text style={[styles.insightLabel, { color: theme.colors.textSecondary }]}>
            Average Daily Spending
          </Text>
          <Text style={[styles.insightValue, { color: theme.colors.primary }]}>
            {user
              ? formatCurrency(analytics.avgSpendingPerDay, user.currency)
              : `$${analytics.avgSpendingPerDay.toFixed(2)}`}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statsContainer: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statBox: {
    width: '48%',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  mainStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  mainStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  mainStatLabel: {
    fontSize: 12,
    marginBottom: 8,
  },
  mainStatValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  mainStatSub: {
    fontSize: 11,
  },
  insight: {
    alignItems: 'center',
  },
  insightLabel: {
    fontSize: 12,
    marginBottom: 8,
  },
  insightValue: {
    fontSize: 32,
    fontWeight: 'bold',
  },
});

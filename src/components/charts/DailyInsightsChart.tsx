import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { useTransactionStore } from '../../store/transactionStore';
import { useUserStore } from '../../store/userStore';
import { formatCurrency } from '../../utils/formatters';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameDay } from 'date-fns';

interface DayOfWeekData {
  dayName: string;
  totalSpent: number;
  count: number;
  averageSpent: number;
}

export function DailyInsightsChart() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { transactions } = useTransactionStore();
  const { user } = useUserStore();

  const dayOfWeekData = useMemo(() => {
    const daysMap = new Map<string, { total: number; count: number }>();

    // Initialize all days
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    dayNames.forEach((day) => {
      daysMap.set(day, { total: 0, count: 0 });
    });

    // Aggregate spending by day of week
    transactions
      .filter((t) => t.type === 'purchased')
      .forEach((transaction) => {
        const date = new Date(transaction.timestamp);
        const dayName = format(date, 'EEEE');
        const current = daysMap.get(dayName)!;
        current.total += transaction.itemPrice;
        current.count += 1;
      });

    // Convert to array with averages
    const data: DayOfWeekData[] = dayNames.map((dayName) => {
      const stats = daysMap.get(dayName)!;
      return {
        dayName,
        totalSpent: stats.total,
        count: stats.count,
        averageSpent: stats.count > 0 ? stats.total / stats.count : 0,
      };
    });

    return data;
  }, [transactions]);

  const maxTotal = Math.max(...dayOfWeekData.map((d) => d.totalSpent), 1);

  // Find day with most spending
  const highestSpendingDay = dayOfWeekData.reduce((prev, current) =>
    current.totalSpent > prev.totalSpent ? current : prev
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        {t('analytics.charts.daily.title')}
      </Text>

      <View style={styles.chart}>
        {dayOfWeekData.map((day, index) => {
          const widthPercentage = (day.totalSpent / maxTotal) * 100;

          return (
            <View key={index} style={styles.row}>
              <Text style={[styles.dayName, { color: theme.colors.text }]}>
                {day.dayName.substring(0, 3)}
              </Text>
              <View style={styles.barContainer}>
                <View
                  style={[
                    styles.bar,
                    {
                      width: `${widthPercentage}%`,
                      backgroundColor:
                        day.dayName === highestSpendingDay.dayName
                          ? theme.colors.primary
                          : theme.colors.secondary,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.amount, { color: theme.colors.text }]}>
                {day.totalSpent > 0
                  ? user
                    ? formatCurrency(day.totalSpent, user.currency).replace(/\.\d+$/, '')
                    : `$${Math.round(day.totalSpent)}`
                  : '-'}
              </Text>
            </View>
          );
        })}
      </View>

      {highestSpendingDay.totalSpent > 0 && (
        <View style={styles.insight}>
          <Text style={[styles.insightText, { color: theme.colors.textSecondary }]}>
            💡 {t('analytics.charts.daily.insight', {
              day: highestSpendingDay.dayName,
              amount: user
                ? formatCurrency(highestSpendingDay.totalSpent, user.currency)
                : `$${highestSpendingDay.totalSpent.toFixed(2)}`
            })}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  chart: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dayName: {
    width: 50,
    fontSize: 13,
    fontWeight: '600',
  },
  barContainer: {
    flex: 1,
    height: 24,
    marginHorizontal: 12,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  bar: {
    height: '100%',
    borderRadius: 4,
    minWidth: 2,
  },
  amount: {
    width: 60,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'right',
  },
  insight: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  insightText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

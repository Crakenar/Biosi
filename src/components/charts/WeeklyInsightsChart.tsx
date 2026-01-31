import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useTransactionStore } from '../../store/transactionStore';
import { useUserStore } from '../../store/userStore';
import { formatCurrency } from '../../utils/formatters';
import { startOfWeek, endOfWeek, eachDayOfInterval, format, isSameDay } from 'date-fns';

interface DayData {
  day: string;
  dayShort: string;
  amount: number;
  date: Date;
}

export function WeeklyInsightsChart() {
  const { theme } = useTheme();
  const { transactions } = useTransactionStore();
  const { user } = useUserStore();

  const weeklyData = useMemo(() => {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

    const daysOfWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

    // Initialize data for each day
    const dayData: DayData[] = daysOfWeek.map((date) => ({
      day: format(date, 'EEEE'),
      dayShort: format(date, 'EEE'),
      amount: 0,
      date,
    }));

    // Calculate spending for each day
    transactions
      .filter((t) => t.type === 'purchased')
      .forEach((transaction) => {
        const transactionDate = new Date(transaction.timestamp);
        const dayIndex = dayData.findIndex((d) => isSameDay(d.date, transactionDate));
        if (dayIndex !== -1) {
          dayData[dayIndex].amount += transaction.itemPrice;
        }
      });

    return dayData;
  }, [transactions]);

  const maxAmount = Math.max(...weeklyData.map((d) => d.amount), 1);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        This Week's Spending Pattern
      </Text>

      <View style={styles.chart}>
        {weeklyData.map((day, index) => {
          const heightPercentage = (day.amount / maxAmount) * 100;
          const isToday = isSameDay(day.date, new Date());

          return (
            <View key={index} style={styles.barContainer}>
              <View style={styles.barWrapper}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: `${heightPercentage}%`,
                      backgroundColor: isToday ? theme.colors.primary : theme.colors.secondary,
                    },
                  ]}
                />
              </View>
              <Text
                style={[
                  styles.dayLabel,
                  { color: isToday ? theme.colors.primary : theme.colors.textSecondary },
                ]}
              >
                {day.dayShort}
              </Text>
              <Text style={[styles.amountLabel, { color: theme.colors.textSecondary }]}>
                {day.amount > 0
                  ? user
                    ? formatCurrency(day.amount, user.currency).replace(/\.\d+$/, '')
                    : `$${Math.round(day.amount)}`
                  : '-'}
              </Text>
            </View>
          );
        })}
      </View>

      <View style={styles.summary}>
        <Text style={[styles.summaryText, { color: theme.colors.textSecondary }]}>
          Total this week:{' '}
          <Text style={{ color: theme.colors.text, fontWeight: 'bold' }}>
            {user
              ? formatCurrency(weeklyData.reduce((sum, d) => sum + d.amount, 0), user.currency)
              : `$${weeklyData.reduce((sum, d) => sum + d.amount, 0).toFixed(2)}`}
          </Text>
        </Text>
      </View>
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
    marginBottom: 20,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 180,
    marginBottom: 20,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  barWrapper: {
    width: '100%',
    height: 140,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  bar: {
    width: '80%',
    borderRadius: 4,
    minHeight: 2,
  },
  dayLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 8,
  },
  amountLabel: {
    fontSize: 9,
    marginTop: 2,
  },
  summary: {
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  summaryText: {
    fontSize: 14,
  },
});

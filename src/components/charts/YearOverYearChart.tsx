import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { useTransactionStore } from '../../store/transactionStore';
import { useUserStore } from '../../store/userStore';
import { formatCurrency } from '../../utils/formatters';
import { format, getYear, getMonth, startOfYear, endOfYear, eachMonthOfInterval } from 'date-fns';

interface MonthComparison {
  month: string;
  currentYear: number;
  previousYear: number;
}

export function YearOverYearChart() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { transactions } = useTransactionStore();
  const { user } = useUserStore();

  const comparisonData = useMemo(() => {
    const currentYear = getYear(new Date());
    const previousYear = currentYear - 1;

    // Get all months for comparison
    const months = eachMonthOfInterval({
      start: startOfYear(new Date()),
      end: new Date(),
    });

    const monthData: MonthComparison[] = months.map((monthDate) => {
      const monthIndex = getMonth(monthDate);
      const monthName = format(monthDate, 'MMM');

      // Calculate spending for current year
      const currentYearSpending = transactions
        .filter(
          (t) =>
            t.type === 'purchased' &&
            getYear(new Date(t.timestamp)) === currentYear &&
            getMonth(new Date(t.timestamp)) === monthIndex
        )
        .reduce((sum, t) => sum + t.itemPrice, 0);

      // Calculate spending for previous year
      const previousYearSpending = transactions
        .filter(
          (t) =>
            t.type === 'purchased' &&
            getYear(new Date(t.timestamp)) === previousYear &&
            getMonth(new Date(t.timestamp)) === monthIndex
        )
        .reduce((sum, t) => sum + t.itemPrice, 0);

      return {
        month: monthName,
        currentYear: currentYearSpending,
        previousYear: previousYearSpending,
      };
    });

    return monthData;
  }, [transactions]);

  const maxAmount = Math.max(
    ...comparisonData.map((d) => Math.max(d.currentYear, d.previousYear)),
    1
  );

  const currentYear = getYear(new Date());
  const previousYear = currentYear - 1;

  const currentYearTotal = comparisonData.reduce((sum, d) => sum + d.currentYear, 0);
  const previousYearTotal = comparisonData.reduce((sum, d) => sum + d.previousYear, 0);
  const percentageChange =
    previousYearTotal > 0
      ? ((currentYearTotal - previousYearTotal) / previousYearTotal) * 100
      : 0;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        {t('analytics.charts.yoy.title')}
      </Text>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View
            style={[styles.legendDot, { backgroundColor: theme.colors.primary }]}
          />
          <Text style={[styles.legendText, { color: theme.colors.text }]}>
            {currentYear}
          </Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[styles.legendDot, { backgroundColor: theme.colors.secondary }]}
          />
          <Text style={[styles.legendText, { color: theme.colors.text }]}>
            {previousYear}
          </Text>
        </View>
      </View>

      <View style={styles.chart}>
        {comparisonData.map((data, index) => {
          const currentHeight = (data.currentYear / maxAmount) * 100;
          const previousHeight = (data.previousYear / maxAmount) * 100;

          return (
            <View key={index} style={styles.monthGroup}>
              <View style={styles.bars}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: `${previousHeight}%`,
                      backgroundColor: theme.colors.secondary,
                    },
                  ]}
                />
                <View
                  style={[
                    styles.bar,
                    {
                      height: `${currentHeight}%`,
                      backgroundColor: theme.colors.primary,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.monthLabel, { color: theme.colors.textSecondary }]}>
                {data.month}
              </Text>
            </View>
          );
        })}
      </View>

      <View style={[styles.summary, { borderTopColor: theme.colors.border }]}>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
            {t('analytics.charts.yoy.currentYearTotal', { year: currentYear })}
          </Text>
          <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
            {user
              ? formatCurrency(currentYearTotal, user.currency)
              : `$${currentYearTotal.toFixed(2)}`}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
            {t('analytics.charts.yoy.previousYearTotal', { year: previousYear })}
          </Text>
          <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
            {user
              ? formatCurrency(previousYearTotal, user.currency)
              : `$${previousYearTotal.toFixed(2)}`}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
            {t('analytics.charts.yoy.change')}
          </Text>
          <Text
            style={[
              styles.summaryValue,
              {
                color:
                  percentageChange > 0
                    ? '#FF6B6B'
                    : percentageChange < 0
                    ? '#4ECDC4'
                    : theme.colors.text,
              },
            ]}
          >
            {percentageChange > 0 ? '+' : ''}
            {percentageChange.toFixed(1)}%
          </Text>
        </View>
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
    marginBottom: 16,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 13,
    fontWeight: '600',
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 160,
    marginBottom: 16,
  },
  monthGroup: {
    flex: 1,
    alignItems: 'center',
  },
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 140,
    gap: 2,
    marginBottom: 8,
  },
  bar: {
    width: 6,
    borderRadius: 3,
    minHeight: 2,
  },
  monthLabel: {
    fontSize: 9,
    fontWeight: '600',
  },
  summary: {
    paddingTop: 16,
    borderTopWidth: 1,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

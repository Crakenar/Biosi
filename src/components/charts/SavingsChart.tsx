import React, { useMemo } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useTransactionStore } from '../../store/transactionStore';
import { getLastNMonths, getMonthKey } from '../../utils/dateHelpers';
import { aggregateByMonth } from '../../utils/aggregations';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

const screenWidth = Dimensions.get('window').width;

export const SavingsChart: React.FC = () => {
  const { theme } = useTheme();
  const { transactions } = useTransactionStore();
  const { t } = useTranslation();

  const chartData = useMemo(() => {
    const last12Months = getLastNMonths(12);
    const aggregated = aggregateByMonth(transactions);
    let cumulative = 0;

    return last12Months.map((month) => {
      const monthKey = getMonthKey(month);
      const data = aggregated[monthKey] || { totalSpent: 0, totalSaved: 0 };
      cumulative += data.totalSaved;
      return {
        month: format(month, 'MMM'),
        saved: cumulative,
      };
    });
  }, [transactions]);

  const maxValue = Math.max(...chartData.map((d) => d.saved), 1);

  return (
    <View style={{ padding: theme.spacing.lg }}>
      <Text
        style={{
          fontSize: theme.typography.sizes.lg,
          fontWeight: 'bold',
          color: theme.colors.text,
          marginBottom: theme.spacing.md,
        }}
      >
        {t('dashboard.cumulativeSavings')}
      </Text>

      <View style={{ height: 200, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around' }}>
        {chartData.map((item, index) => {
          const height = (item.saved / maxValue) * 180;
          return (
            <View key={index} style={{ alignItems: 'center', flex: 1 }}>
              <View
                style={{
                  width: 20,
                  height: Math.max(height, 2),
                  backgroundColor: theme.colors.success,
                  borderRadius: theme.borderRadius.sm,
                }}
              />
              <Text
                style={{
                  fontSize: theme.typography.sizes.xs,
                  color: theme.colors.textSecondary,
                  marginTop: theme.spacing.xs,
                }}
              >
                {item.month}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { useTransactionStore } from '../../store/transactionStore';
import { useUserStore } from '../../store/userStore';
import { formatCurrency } from '../../utils/formatters';
import { getCategoryInfo, CATEGORIES, TransactionCategory } from '../../types/category';
import Svg, { Path, Circle, G } from 'react-native-svg';

const CHART_SIZE = Dimensions.get('window').width - 80;
const RADIUS = CHART_SIZE / 2 - 20;
const CENTER = CHART_SIZE / 2;

interface CategoryData {
  category: TransactionCategory;
  amount: number;
  percentage: number;
  color: string;
  icon: string;
  name: string;
}

export function CategoryBreakdownChart() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { transactions } = useTransactionStore();
  const { user } = useUserStore();

  const categoryData = useMemo(() => {
    // Filter only purchased transactions with categories
    const purchasedWithCategory = transactions.filter(
      (t) => t.type === 'purchased' && t.category
    );

    if (purchasedWithCategory.length === 0) {
      return [];
    }

    // Group by category and calculate totals
    const categoryTotals = new Map<TransactionCategory, number>();

    purchasedWithCategory.forEach((transaction) => {
      const category = transaction.category!;
      const current = categoryTotals.get(category) || 0;
      categoryTotals.set(category, current + transaction.itemPrice);
    });

    // Calculate total for percentages
    const total = Array.from(categoryTotals.values()).reduce((sum, val) => sum + val, 0);

    // Convert to array and add metadata
    const data: CategoryData[] = Array.from(categoryTotals.entries()).map(
      ([category, amount]) => {
        const info = getCategoryInfo(category);
        return {
          category,
          amount,
          percentage: (amount / total) * 100,
          color: info.color,
          icon: info.icon,
          name: info.name,
        };
      }
    );

    // Sort by amount descending
    return data.sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  // Convert degrees to radians
  const degreesToRadians = (degrees: number) => (degrees * Math.PI) / 180;

  // Create SVG path for pie slice
  const createPieSlice = (
    startAngle: number,
    endAngle: number,
    color: string,
    index: number
  ) => {
    const start = degreesToRadians(startAngle - 90);
    const end = degreesToRadians(endAngle - 90);

    const x1 = CENTER + RADIUS * Math.cos(start);
    const y1 = CENTER + RADIUS * Math.sin(start);
    const x2 = CENTER + RADIUS * Math.cos(end);
    const y2 = CENTER + RADIUS * Math.sin(end);

    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    const path = `
      M ${CENTER} ${CENTER}
      L ${x1} ${y1}
      A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${x2} ${y2}
      Z
    `;

    return <Path key={index} d={path} fill={color} />;
  };

  if (categoryData.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          {t('analytics.charts.categoryBreakdown.title')}
        </Text>
        <View style={styles.emptyState}>
          <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
            {t('analytics.charts.categoryBreakdown.noData')}
          </Text>
          <Text style={[styles.emptySubtext, { color: theme.colors.textSecondary }]}>
            {t('analytics.charts.categoryBreakdown.noDataDesc')}
          </Text>
        </View>
      </View>
    );
  }

  // Calculate slice positions
  let currentAngle = 0;
  const slices = categoryData.map((data, index) => {
    const sliceAngle = (data.percentage / 100) * 360;
    const slice = createPieSlice(currentAngle, currentAngle + sliceAngle, data.color, index);
    currentAngle += sliceAngle;
    return slice;
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        {t('analytics.charts.categoryBreakdown.title')}
      </Text>

      <View style={styles.chartContainer}>
        <Svg width={CHART_SIZE} height={CHART_SIZE}>
          <G>{slices}</G>
          {/* Center circle for donut effect */}
          <Circle cx={CENTER} cy={CENTER} r={RADIUS * 0.5} fill={theme.colors.surface} />
        </Svg>
      </View>

      <View style={styles.legend}>
        {categoryData.map((data, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={styles.legendLeft}>
              <View
                style={[
                  styles.colorDot,
                  { backgroundColor: data.color },
                ]}
              />
              <Text style={styles.legendIcon}>{data.icon}</Text>
              <Text
                style={[styles.legendText, { color: theme.colors.text }]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {data.name}
              </Text>
            </View>
            <View style={styles.legendRight}>
              <Text
                style={[styles.legendAmount, { color: theme.colors.text }]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {user ? formatCurrency(data.amount, user.currency) : `$${data.amount}`}
              </Text>
              <Text
                style={[styles.legendPercentage, { color: theme.colors.textSecondary }]}
                numberOfLines={1}
              >
                {data.percentage.toFixed(1)}%
              </Text>
            </View>
          </View>
        ))}
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
  chartContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  legend: {
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  legendLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  legendRight: {
    alignItems: 'flex-end',
  },
  legendAmount: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  legendPercentage: {
    fontSize: 12,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
});

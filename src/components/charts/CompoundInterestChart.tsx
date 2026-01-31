import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useCompoundInterest } from '../../hooks/useCompoundInterest';
import { useUserStore } from '../../store/userStore';
import { formatCurrency } from '../../utils/formatters';
import { useTranslation } from 'react-i18next';

export const CompoundInterestChart: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useUserStore();
  const { tenYear, twentyYear, principal, rate } = useCompoundInterest();
  const { t } = useTranslation();

  if (!user) return null;

  const maxValue = Math.max(tenYear, twentyYear, 1);
  const tenYearHeight = (tenYear / maxValue) * 150; // Reduced from 180 to give more space
  const twentyYearHeight = (twentyYear / maxValue) * 150;

  return (
    <View style={{ padding: theme.spacing.lg }}>
      <Text
        style={{
          fontSize: theme.typography.sizes.lg,
          fontWeight: 'bold',
          color: theme.colors.text,
          marginBottom: theme.spacing.lg,
        }}
      >
        Compound Interest ({(rate * 100).toFixed(1)}%)
      </Text>

      {principal === 0 ? (
        <Text
          style={{
            fontSize: theme.typography.sizes.md,
            color: theme.colors.textSecondary,
            textAlign: 'center',
            paddingVertical: theme.spacing.xl,
          }}
        >
          {t('dashboard.startSaving')}
        </Text>
      ) : (
        <View style={{ minHeight: 240 }}>
          <View style={{
            height: 180,
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'space-around',
            marginBottom: theme.spacing.md,
          }}>
            <View style={{ alignItems: 'center', flex: 1 }}>
              <View
                style={{
                  width: 80,
                  height: Math.max(tenYearHeight, 10),
                  backgroundColor: theme.colors.primary,
                  borderRadius: theme.borderRadius.sm,
                }}
              />
            </View>

            <View style={{ alignItems: 'center', flex: 1 }}>
              <View
                style={{
                  width: 80,
                  height: Math.max(twentyYearHeight, 10),
                  backgroundColor: theme.colors.accent,
                  borderRadius: theme.borderRadius.sm,
                }}
              />
            </View>
          </View>

          {/* Labels below the chart */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <View style={{ alignItems: 'center', flex: 1 }}>
              <Text
                style={{
                  fontSize: theme.typography.sizes.sm,
                  color: theme.colors.text,
                  marginBottom: theme.spacing.xs,
                }}
              >
                {t('dashboard.tenYears')}
              </Text>
              <Text
                style={{
                  fontSize: theme.typography.sizes.md,
                  fontWeight: 'bold',
                  color: theme.colors.primary,
                }}
              >
                {formatCurrency(tenYear, user.currency)}
              </Text>
            </View>

            <View style={{ alignItems: 'center', flex: 1 }}>
              <Text
                style={{
                  fontSize: theme.typography.sizes.sm,
                  color: theme.colors.text,
                  marginBottom: theme.spacing.xs,
                }}
              >
                {t('dashboard.twentyYears')}
              </Text>
              <Text
                style={{
                  fontSize: theme.typography.sizes.md,
                  fontWeight: 'bold',
                  color: theme.colors.accent,
                }}
              >
                {formatCurrency(twentyYear, user.currency)}
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

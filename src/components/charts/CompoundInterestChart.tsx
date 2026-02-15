import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useCompoundInterest } from '../../hooks/useCompoundInterest';
import { useUserStore } from '../../store/userStore';
import { formatCurrency } from '../../utils/formatters';
import { useTranslation } from 'react-i18next';
import { Modal } from '../common/Modal';

export const CompoundInterestChart: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useUserStore();
  const { tenYear, twentyYear, principal, rate } = useCompoundInterest();
  const { t } = useTranslation();
  const [showInfo, setShowInfo] = useState(false);

  if (!user) return null;

  const maxValue = Math.max(tenYear, twentyYear, 1);
  const tenYearHeight = (tenYear / maxValue) * 150;
  const twentyYearHeight = (twentyYear / maxValue) * 150;

  return (
    <View style={{ padding: theme.spacing.lg }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.lg }}>
        <Text
          style={{
            fontSize: theme.typography.sizes.lg,
            fontWeight: 'bold',
            color: theme.colors.text,
            flex: 1,
          }}
        >
          {t('compoundInterest.title', { rate: (rate * 100).toFixed(1) })}
        </Text>
        <TouchableOpacity
          onPress={() => setShowInfo(true)}
          style={{
            width: 24,
            height: 24,
            borderRadius: 12,
            backgroundColor: theme.colors.surface,
            borderWidth: 1,
            borderColor: theme.colors.border,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 13, fontWeight: 'bold', color: theme.colors.textSecondary }}>i</Text>
        </TouchableOpacity>
      </View>

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

      <Modal
        visible={showInfo}
        onClose={() => setShowInfo(false)}
        title={t('compoundInterest.infoTitle')}
        message={t('compoundInterest.infoMessage')}
        icon="📈"
        iconColor={theme.colors.primary}
        actions={[
          {
            label: t('common.gotIt'),
            onPress: () => setShowInfo(false),
            variant: 'primary',
          },
        ]}
      />
    </View>
  );
};

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { HistoryStackParamList } from '../../navigation/types';
import { useTheme } from '../../contexts/ThemeContext';
import { useUserStore } from '../../store/userStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useTransactionStore } from '../../store/transactionStore';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { DeleteModal } from '../../components/common/DeleteModal';
import { formatCurrency } from '../../utils/formatters';
import { formatHours } from '../../services/calculations';
import { formatDateTime } from '../../utils/dateHelpers';
import { useTranslation } from 'react-i18next';

type TransactionDetailNavigationProp = StackNavigationProp<
  HistoryStackParamList,
  'TransactionDetail'
>;
type TransactionDetailRouteProp = RouteProp<HistoryStackParamList, 'TransactionDetail'>;

export const TransactionDetailScreen: React.FC = () => {
  const navigation = useNavigation<TransactionDetailNavigationProp>();
  const route = useRoute<TransactionDetailRouteProp>();
  const { theme } = useTheme();
    const { t } = useTranslation();
  const { user } = useUserStore();
  const { settings } = useSettingsStore();

  const { transactions, deleteTransaction } = useTransactionStore();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const transaction = transactions.find((t) => t.id === route.params.transactionId);

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (transaction) {
      deleteTransaction(transaction.id);
      setShowDeleteModal(false);
      navigation.goBack();
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  if (!transaction || !user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <Text style={{ fontSize: theme.typography.sizes.md, color: theme.colors.textSecondary }}>
          {t('history.transactionDetail.transactionNotFound')}
        </Text>
        <Button title={t('common.goBack')} onPress={() => navigation.goBack()} style={{ marginTop: theme.spacing.lg }} />
      </View>
    );
  }

  const isPurchase = transaction.type === 'purchased';

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={{ padding: theme.spacing.xl }}>
        {/* Header */}
        <View style={{ alignItems: 'center', marginBottom: theme.spacing.xl }}>
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: theme.borderRadius.round,
              backgroundColor: isPurchase ? theme.colors.error : theme.colors.success,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: theme.spacing.md,
              opacity: 0.2,
            }}
          >
            <Text style={{ fontSize: 40 }}>{isPurchase ? '💸' : '🎯'}</Text>
          </View>
          <Text
            style={{
              fontSize: theme.typography.sizes.xl,
              fontWeight: 'bold',
              color: theme.colors.text,
              marginBottom: theme.spacing.xs,
            }}
          >
            {isPurchase ? t('history.transactionDetail.purchase') : t('history.transactionDetail.savings')}
          </Text>
          <Text
            style={{
              fontSize: theme.typography.sizes.sm,
              color: theme.colors.textSecondary,
            }}
          >
            {formatDateTime(transaction.timestamp)}
          </Text>
        </View>

        {/* Details Card */}
        <Card variant="elevated" style={{ marginBottom: theme.spacing.lg }}>
          {transaction.label && (
            <>
              <View style={styles.detailRow}>
                <Text
                  style={{
                    fontSize: theme.typography.sizes.md,
                    color: theme.colors.textSecondary,
                  }}
                >
                  {t('history.transactionDetail.itemName')}
                </Text>
                <Text
                  style={{
                    fontSize: theme.typography.sizes.lg,
                    fontWeight: 'bold',
                    color: theme.colors.text,
                  }}
                >
                  {transaction.label}
                </Text>
              </View>

              <View
                style={{
                  height: 1,
                  backgroundColor: theme.colors.border,
                  marginVertical: theme.spacing.md,
                }}
              />
            </>
          )}

          <View style={styles.detailRow}>
            <Text
              style={{
                fontSize: theme.typography.sizes.md,
                color: theme.colors.textSecondary,
              }}
            >
              {t('history.transactionDetail.amount')}
            </Text>
            <Text
              style={{
                fontSize: theme.typography.sizes.xl,
                fontWeight: 'bold',
                color: isPurchase ? theme.colors.error : theme.colors.success,
              }}
            >
              {formatCurrency(transaction.itemPrice, user.currency)}
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
              {t('history.transactionDetail.hoursOfWork')}
            </Text>
            <Text
              style={{
                fontSize: theme.typography.sizes.lg,
                fontWeight: 'bold',
                color: theme.colors.text,
              }}
            >
              {formatHours(transaction.hoursOfWork, settings.workHoursPerDay)}
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
              {t('history.transactionDetail.hourlyRate')}
            </Text>
            <Text
              style={{
                fontSize: theme.typography.sizes.md,
                fontWeight: '600',
                color: theme.colors.text,
              }}
            >
              {formatCurrency(user.wage.hourlyRate, user.currency)}
            </Text>
          </View>

          {transaction.note && (
            <>
              <View
                style={{
                  height: 1,
                  backgroundColor: theme.colors.border,
                  marginVertical: theme.spacing.md,
                }}
              />
              <View>
                <Text
                  style={{
                    fontSize: theme.typography.sizes.md,
                    color: theme.colors.textSecondary,
                    marginBottom: theme.spacing.xs,
                  }}
                >
                  {t('history.transactionDetail.note')}
                </Text>
                <Text
                  style={{
                    fontSize: theme.typography.sizes.md,
                    color: theme.colors.text,
                  }}
                >
                  {transaction.note}
                </Text>
              </View>
            </>
          )}
        </Card>

        {/* Action Buttons */}
        <Button
          title={t('common.goBack')}
          onPress={() => navigation.goBack()}
          variant="outline"
          size="large"
          style={{ marginBottom: theme.spacing.md }}
        />
        <Button
          title={t('history.transactionDetail.deleteTransaction')}
          onPress={handleDelete}
          variant="outline"
          size="large"
          textStyle={{ color: theme.colors.error }}
          style={{ borderColor: theme.colors.error }}
        />
      </View>

      <DeleteModal
        visible={showDeleteModal}
        title={t('history.transactionDetail.deleteConfirmTitle')}
        message={t('history.transactionDetail.deleteConfirmMessage')}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        confirmText={t('common.delete')}
        cancelText={t('common.cancel')}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

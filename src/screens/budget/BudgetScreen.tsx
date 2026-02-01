import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Modal } from '../../components/common/Modal';
import { useBudgetStore } from '../../store/budgetStore';
import Analytics from '../../services/analytics';
import { useTransactionStore } from '../../store/transactionStore';
import { useUserStore } from '../../store/userStore';
import { useSettingsStore } from '../../store/settingsStore';
import { formatCurrency } from '../../utils/formatters';
import {
  startOfDay,
  startOfWeek,
  startOfMonth,
  endOfDay,
  endOfWeek,
  endOfMonth,
  isWithinInterval,
} from 'date-fns';

export function BudgetScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { budgets, addBudget, updateBudget, deleteBudget, toggleBudget } = useBudgetStore();
  const { transactions } = useTransactionStore();
  const { user } = useUserStore();
  const { settings } = useSettingsStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingBudget, setEditingBudget] = useState<string | null>(null);
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [amount, setAmount] = useState('');
  const [alertThreshold, setAlertThreshold] = useState('80');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState<string | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showExceededAlert, setShowExceededAlert] = useState(false);
  const [exceededMessage, setExceededMessage] = useState('');

  // Sort budgets by most recent first
  const sortedBudgets = [...budgets].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (!settings.isPremium) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.lockedContainer}>
          <Text style={styles.lockEmoji}>🔒</Text>
          <Text style={[styles.lockedTitle, { color: theme.colors.text }]}>{t('budget.title')}</Text>
          <Text style={[styles.lockedMessage, { color: theme.colors.textSecondary }]}>
            {t('budget.lockedMessage')}
          </Text>
        </View>
      </View>
    );
  }

  const openAddModal = () => {
    setEditingBudget(null);
    setPeriod('monthly');
    setAmount('');
    setAlertThreshold('80');
    setModalVisible(true);
  };

  const openEditModal = (budgetId: string) => {
    const budget = budgets.find((b) => b.id === budgetId);
    if (budget) {
      setEditingBudget(budgetId);
      setPeriod(budget.period);
      setAmount(budget.amount.toString());
      setAlertThreshold(budget.alertThreshold.toString());
      setModalVisible(true);
    }
  };

  const handleSave = () => {
    const budgetAmount = parseFloat(amount);
    const threshold = parseFloat(alertThreshold);

    if (isNaN(budgetAmount) || budgetAmount <= 0) {
      setErrorMessage(t('budget.errorAmountInvalid'));
      setShowErrorModal(true);
      return;
    }

    if (isNaN(threshold) || threshold < 0 || threshold > 100) {
      setErrorMessage(t('budget.errorThresholdInvalid'));
      setShowErrorModal(true);
      return;
    }

    if (editingBudget) {
      updateBudget(editingBudget, {
        period,
        amount: budgetAmount,
        alertThreshold: threshold,
      });
    } else {
      addBudget({
        period,
        amount: budgetAmount,
        alertThreshold: threshold,
        enabled: true,
      });

      // Track analytics
      Analytics.trackBudgetCreated(budgetAmount, period);
    }

    // Check if budget is already exceeded
    const spent = calculateSpending(period);
    const percentage = (spent / budgetAmount) * 100;

    if (percentage >= threshold) {
      const periodName = period === 'daily' ? t('budget.period.today') : period === 'weekly' ? t('budget.period.this week') : t('budget.period.this month');
      setExceededMessage(
        t('budget.warningExceeded', { percentage: percentage.toFixed(0), period: periodName })
      );
      setShowExceededAlert(true);
    }

    setModalVisible(false);
  };

  const handleDelete = (budgetId: string) => {
    setBudgetToDelete(budgetId);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (budgetToDelete) {
      deleteBudget(budgetToDelete);
      setBudgetToDelete(null);
    }
    setShowDeleteModal(false);
  };

  const calculateSpending = (budgetPeriod: 'daily' | 'weekly' | 'monthly') => {
    const now = new Date();
    let periodStart: Date;
    let periodEnd: Date;

    switch (budgetPeriod) {
      case 'daily':
        periodStart = startOfDay(now);
        periodEnd = endOfDay(now);
        break;
      case 'weekly':
        periodStart = startOfWeek(now, { weekStartsOn: 1 });
        periodEnd = endOfWeek(now, { weekStartsOn: 1 });
        break;
      case 'monthly':
        periodStart = startOfMonth(now);
        periodEnd = endOfMonth(now);
        break;
    }

    const periodTransactions = transactions.filter(
      (t) =>
        t.type === 'purchased' &&
        isWithinInterval(new Date(t.timestamp), { start: periodStart, end: periodEnd })
    );

    return periodTransactions.reduce((sum, t) => sum + t.itemPrice, 0);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{t('budget.title')}</Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
          onPress={openAddModal}
        >
          <Text style={styles.addButtonText}>{t('budget.newBudget')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {budgets.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>⚠️</Text>
            <Text style={[styles.emptyText, { color: theme.colors.text }]}>
              {t('budget.noBudgets')}
            </Text>
            <Text style={[styles.emptySubtext, { color: theme.colors.textSecondary }]}>
              {t('budget.noBudgetsDesc')}
            </Text>
          </View>
        ) : (
          sortedBudgets.map((budget) => {
            const spent = calculateSpending(budget.period);
            const percentage = (spent / budget.amount) * 100;
            const isOverBudget = percentage > 100;
            const isNearLimit = percentage >= budget.alertThreshold;

            return (
              <View
                key={budget.id}
                style={[styles.budgetCard, { backgroundColor: theme.colors.surface }]}
              >
                <View style={styles.budgetHeader}>
                  <TouchableOpacity
                    style={styles.budgetInfo}
                    onPress={() => openEditModal(budget.id)}
                  >
                    <Text
                      style={[styles.budgetPeriod, { color: theme.colors.text }]}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {budget.period.charAt(0).toUpperCase() + budget.period.slice(1)} Budget
                    </Text>
                    <Text
                      style={[styles.budgetAmount, { color: theme.colors.textSecondary }]}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {user
                        ? formatCurrency(budget.amount, user.currency)
                        : `$${budget.amount}`}
                    </Text>
                  </TouchableOpacity>
                  <Switch
                    value={budget.enabled}
                    onValueChange={() => toggleBudget(budget.id)}
                    trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                  />
                </View>

                <View style={styles.progressContainer}>
                  <View
                    style={[styles.progressBar, { backgroundColor: theme.colors.border }]}
                  >
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${Math.min(percentage, 100)}%`,
                          backgroundColor: isOverBudget
                            ? '#FF6B6B'
                            : isNearLimit
                            ? '#FFB84D'
                            : '#4ECDC4',
                        },
                      ]}
                    />
                  </View>
                  <Text
                    style={[
                      styles.progressText,
                      {
                        color: isOverBudget
                          ? '#FF6B6B'
                          : isNearLimit
                          ? '#FFB84D'
                          : theme.colors.textSecondary,
                      },
                    ]}
                  >
                    {percentage.toFixed(0)}%
                  </Text>
                </View>

                <View style={styles.budgetStats}>
                  <Text style={[styles.statText, { color: theme.colors.text }]}>
                    {t('budget.spent')}:{' '}
                    <Text style={{ fontWeight: 'bold' }}>
                      {user ? formatCurrency(spent, user.currency) : `$${spent.toFixed(2)}`}
                    </Text>
                  </Text>
                  <Text style={[styles.statText, { color: theme.colors.textSecondary }]}>
                    {t('budget.remaining')}:{' '}
                    <Text
                      style={{
                        fontWeight: 'bold',
                        color: isOverBudget ? '#FF6B6B' : theme.colors.text,
                      }}
                    >
                      {user
                        ? formatCurrency(Math.max(0, budget.amount - spent), user.currency)
                        : `$${Math.max(0, budget.amount - spent).toFixed(2)}`}
                    </Text>
                  </Text>
                </View>

                {isNearLimit && budget.enabled && (
                  <View
                    style={[
                      styles.alertBanner,
                      { backgroundColor: isOverBudget ? '#FF6B6B' : '#FFB84D' },
                    ]}
                  >
                    <Text style={styles.alertText}>
                      {isOverBudget
                        ? `⚠️ Over budget by ${(percentage - 100).toFixed(0)}%`
                        : `⚠️ ${budget.alertThreshold}% threshold reached`}
                    </Text>
                  </View>
                )}

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(budget.id)}
                >
                  <Text style={[styles.deleteText, { color: '#FF6B6B' }]}>{t('budget.delete')}</Text>
                </TouchableOpacity>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Add/Edit Budget Modal */}
      <Modal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={editingBudget ? t('budget.editBudget') : t('budget.newBudget')}
        dismissable={true}
      >
        <View>
          <Text style={[styles.label, { color: theme.colors.text }]}>{t('budget.periodLabel')}</Text>
          <View style={styles.periodButtons}>
            {(['daily', 'weekly', 'monthly'] as const).map((p) => (
              <TouchableOpacity
                key={p}
                style={[
                  styles.periodButton,
                  {
                    backgroundColor:
                      period === p ? theme.colors.primary : theme.colors.background,
                    borderColor: theme.colors.border,
                  },
                ]}
                onPress={() => setPeriod(p)}
              >
                <Text
                  style={[
                    styles.periodButtonText,
                    { color: period === p ? '#fff' : theme.colors.text },
                  ]}
                >
                  {t(`budget.${p}`)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.label, { color: theme.colors.text }]}>{t('budget.budgetAmount')}</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.background,
                color: theme.colors.text,
                borderColor: theme.colors.border,
              },
            ]}
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            placeholder="0.00"
            placeholderTextColor={theme.colors.textSecondary}
          />

          <Text style={[styles.label, { color: theme.colors.text }]}>
            {t('budget.alertThreshold')}
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.background,
                color: theme.colors.text,
                borderColor: theme.colors.border,
              },
            ]}
            value={alertThreshold}
            onChangeText={setAlertThreshold}
            keyboardType="decimal-pad"
            placeholder="80"
            placeholderTextColor={theme.colors.textSecondary}
          />
          <Text style={[styles.hint, { color: theme.colors.textSecondary }]}>
            {t('budget.alertThresholdHint')}
          </Text>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: theme.colors.border }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={[styles.modalButtonText, { color: theme.colors.text }]}>
                {t('budget.cancel')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: theme.colors.primary }]}
              onPress={handleSave}
            >
              <Text style={[styles.modalButtonText, { color: '#fff' }]}>{t('budget.save')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title={t('budget.deleteBudget')}
        message={t('budget.deleteConfirmMessage')}
        icon="⚠️"
        iconColor="#FF6B6B"
        actions={[
          {
            label: t('budget.cancel'),
            onPress: () => setShowDeleteModal(false),
            variant: 'outline',
          },
          {
            label: t('budget.delete'),
            onPress: confirmDelete,
            variant: 'primary',
          },
        ]}
      />

      {/* Error Modal */}
      <Modal
        visible={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title={t('budget.error')}
        message={errorMessage}
        icon="❌"
        iconColor={theme.colors.error}
        actions={[
          {
            label: t('budget.ok'),
            onPress: () => setShowErrorModal(false),
            variant: 'primary',
          },
        ]}
      />

      {/* Budget Exceeded Alert */}
      <Modal
        visible={showExceededAlert}
        onClose={() => setShowExceededAlert(false)}
        title={t('budget.alert.title')}
        message={exceededMessage}
        icon="⚠️"
        iconColor="#FFB84D"
        actions={[
          {
            label: t('budget.gotIt'),
            onPress: () => setShowExceededAlert(false),
            variant: 'primary',
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    flexShrink: 1,
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  budgetCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  budgetInfo: {
    flex: 1,
  },
  budgetPeriod: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  budgetAmount: {
    fontSize: 14,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    width: 40,
  },
  budgetStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statText: {
    fontSize: 13,
  },
  alertBanner: {
    padding: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  alertText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  deleteButton: {
    alignItems: 'center',
    padding: 8,
  },
  deleteText: {
    fontSize: 13,
    fontWeight: '600',
  },
  lockedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  lockEmoji: {
    fontSize: 60,
    marginBottom: 20,
  },
  lockedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  lockedMessage: {
    fontSize: 16,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 12,
  },
  periodButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  periodButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  hint: {
    fontSize: 12,
    marginTop: 4,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

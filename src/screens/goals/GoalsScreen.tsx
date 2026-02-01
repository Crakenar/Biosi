import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Modal } from '../../components/common/Modal';
import { useGoalsStore } from '../../store/goalsStore';
import Analytics from '../../services/analytics';
import { useUserStore } from '../../store/userStore';
import { useSettingsStore } from '../../store/settingsStore';
import { formatCurrency } from '../../utils/formatters';
import { format, differenceInDays } from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';

const GOAL_ICONS = ['🎯', '🏠', '🚗', '✈️', '💰', '🎓', '💍', '🎁', '📱', '⌚'];

export function GoalsScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { goals, addGoal, updateGoal, deleteGoal } = useGoalsStore();
  const { user } = useUserStore();
  const { settings } = useSettingsStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [goalName, setGoalName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('🎯');
  const [targetDate, setTargetDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState<string | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Sort goals by most recent first
  const sortedGoals = [...goals].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (!settings.isPremium) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.lockedContainer}>
          <Text style={styles.lockEmoji}>🔒</Text>
          <Text style={[styles.lockedTitle, { color: theme.colors.text }]}>
            {t('goals.title')}
          </Text>
          <Text style={[styles.lockedMessage, { color: theme.colors.textSecondary }]}>
            Upgrade to Premium to set and track savings goals
          </Text>
        </View>
      </View>
    );
  }

  const openAddModal = () => {
    setEditingGoal(null);
    setGoalName('');
    setTargetAmount('');
    setSelectedIcon('🎯');
    setTargetDate(new Date());
    setModalVisible(true);
  };

  const openEditModal = (goalId: string) => {
    const goal = goals.find((g) => g.id === goalId);
    if (goal) {
      setEditingGoal(goalId);
      setGoalName(goal.name);
      setTargetAmount(goal.targetAmount.toString());
      setSelectedIcon(goal.icon);
      setTargetDate(new Date(goal.targetDate));
      setModalVisible(true);
    }
  };

  const handleSave = () => {
    if (!goalName.trim()) {
      setErrorMessage('Please enter a goal name');
      setShowErrorModal(true);
      return;
    }

    const amount = parseFloat(targetAmount);
    if (isNaN(amount) || amount <= 0) {
      setErrorMessage('Please enter a valid target amount');
      setShowErrorModal(true);
      return;
    }

    if (editingGoal) {
      updateGoal(editingGoal, {
        name: goalName,
        targetAmount: amount,
        targetDate: targetDate.toISOString(),
        icon: selectedIcon,
      });
    } else {
      addGoal({
        name: goalName,
        targetAmount: amount,
        targetDate: targetDate.toISOString(),
        icon: selectedIcon,
        currentAmount: 0,
      });

      // Track analytics
      Analytics.trackGoalCreated(amount, user?.currency || 'USD');
    }

    setModalVisible(false);
  };

  const handleDelete = (goalId: string) => {
    setGoalToDelete(goalId);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (goalToDelete) {
      deleteGoal(goalToDelete);
      setGoalToDelete(null);
    }
    setShowDeleteModal(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{t('goals.title')}</Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
          onPress={openAddModal}
        >
          <Text style={styles.addButtonText}>{t('goals.newGoal')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {goals.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🎯</Text>
            <Text style={[styles.emptyText, { color: theme.colors.text }]}>
              {t('goals.noGoals')}
            </Text>
            <Text style={[styles.emptySubtext, { color: theme.colors.textSecondary }]}>
              {t('goals.noGoalsDesc')}
            </Text>
          </View>
        ) : (
          sortedGoals.map((goal) => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100;
            const daysLeft = differenceInDays(new Date(goal.targetDate), new Date());

            return (
              <TouchableOpacity
                key={goal.id}
                style={[styles.goalCard, { backgroundColor: theme.colors.surface }]}
                onPress={() => openEditModal(goal.id)}
                onLongPress={() => handleDelete(goal.id)}
              >
                <View style={styles.goalHeader}>
                  <View style={styles.goalTitleRow}>
                    <Text style={styles.goalIcon}>{goal.icon}</Text>
                    <Text style={[styles.goalName, { color: theme.colors.text }]}>
                      {goal.name}
                    </Text>
                  </View>
                  {goal.completed && (
                    <View
                      style={[styles.completedBadge, { backgroundColor: '#4ECDC4' }]}
                    >
                      <Text style={styles.completedText}>✓ Complete</Text>
                    </View>
                  )}
                </View>

                <View style={styles.progressContainer}>
                  <View
                    style={[
                      styles.progressBar,
                      { backgroundColor: theme.colors.border },
                    ]}
                  >
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${Math.min(progress, 100)}%`,
                          backgroundColor: goal.completed
                            ? '#4ECDC4'
                            : theme.colors.primary,
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.progressText, { color: theme.colors.textSecondary }]}>
                    {progress.toFixed(0)}%
                  </Text>
                </View>

                <View style={styles.goalStats}>
                  <View>
                    <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                      {t('goals.current')}
                    </Text>
                    <Text style={[styles.statValue, { color: theme.colors.text }]}>
                      {user ? formatCurrency(goal.currentAmount, user.currency) : `$${goal.currentAmount}`}
                    </Text>
                  </View>
                  <View>
                    <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                      {t('goals.target')}
                    </Text>
                    <Text style={[styles.statValue, { color: theme.colors.text }]}>
                      {user ? formatCurrency(goal.targetAmount, user.currency) : `$${goal.targetAmount}`}
                    </Text>
                  </View>
                  <View>
                    <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                      {daysLeft > 0 ? t('goals.daysLeft') : t('goals.overdue')}
                    </Text>
                    <Text
                      style={[
                        styles.statValue,
                        { color: daysLeft < 0 ? '#FF6B6B' : theme.colors.text },
                      ]}
                    >
                      {Math.abs(daysLeft)}
                    </Text>
                  </View>
                </View>

                <Text style={[styles.targetDate, { color: theme.colors.textSecondary }]}>
                  {t('goals.targetLabel')}: {format(new Date(goal.targetDate), 'MMM dd, yyyy')}
                </Text>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      {/* Add/Edit Goal Modal */}
      <Modal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={editingGoal ? t('goals.editGoal') : t('goals.newGoal')}
        dismissable={true}
      >
        <View>
          <Text style={[styles.label, { color: theme.colors.text }]}>{t('goals.goalName')}</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.background,
                color: theme.colors.text,
                borderColor: theme.colors.border,
              },
            ]}
            value={goalName}
            onChangeText={setGoalName}
            placeholder={t('goals.placeholderName')}
            placeholderTextColor={theme.colors.textSecondary}
          />

          <Text style={[styles.label, { color: theme.colors.text }]}>{t('goals.targetAmount')}</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.background,
                color: theme.colors.text,
                borderColor: theme.colors.border,
              },
            ]}
            value={targetAmount}
            onChangeText={setTargetAmount}
            keyboardType="decimal-pad"
            placeholder={t('goals.placeholderAmount')}
            placeholderTextColor={theme.colors.textSecondary}
          />

          <Text style={[styles.label, { color: theme.colors.text }]}>{t('goals.icon')}</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.iconScroll}
          >
            {GOAL_ICONS.map((icon) => (
              <TouchableOpacity
                key={icon}
                style={[
                  styles.iconButton,
                  {
                    backgroundColor:
                      selectedIcon === icon
                        ? theme.colors.primary
                        : theme.colors.background,
                    borderColor: theme.colors.border,
                  },
                ]}
                onPress={() => setSelectedIcon(icon)}
              >
                <Text style={styles.iconText}>{icon}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={[styles.label, { color: theme.colors.text }]}>{t('goals.targetDate')}</Text>
          <TouchableOpacity
            style={[
              styles.dateButton,
              {
                backgroundColor: theme.colors.background,
                borderColor: theme.colors.border,
              },
            ]}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={[styles.dateText, { color: theme.colors.text }]}>
              {format(targetDate, 'MMM dd, yyyy')}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={targetDate}
              mode="date"
              onChange={(event, date) => {
                setShowDatePicker(false);
                if (date) setTargetDate(date);
              }}
              minimumDate={new Date()}
            />
          )}

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: theme.colors.border }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={[styles.modalButtonText, { color: theme.colors.text }]}>
                {t('goals.cancel')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: theme.colors.primary }]}
              onPress={handleSave}
            >
              <Text style={[styles.modalButtonText, { color: '#fff' }]}>{t('goals.save')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title={t('goals.deleteGoal')}
        message={t('goals.deleteConfirmMessage')}
        icon="⚠️"
        iconColor="#FF6B6B"
        actions={[
          {
            label: t('goals.cancel'),
            onPress: () => setShowDeleteModal(false),
            variant: 'outline',
          },
          {
            label: t('goals.delete'),
            onPress: confirmDelete,
            variant: 'primary',
          },
        ]}
      />

      {/* Error Modal */}
      <Modal
        visible={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title={t('goals.error')}
        message={errorMessage}
        icon="❌"
        iconColor={theme.colors.error}
        actions={[
          {
            label: t('goals.ok'),
            onPress: () => setShowErrorModal(false),
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
    fontSize: 28,
    fontWeight: 'bold',
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
  goalCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  goalName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  completedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completedText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
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
  goalStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 11,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  targetDate: {
    fontSize: 12,
    textAlign: 'center',
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
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  iconScroll: {
    marginBottom: 8,
  },
  iconButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  iconText: {
    fontSize: 24,
  },
  dateButton: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  dateText: {
    fontSize: 16,
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

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { useTransactionStore } from '../../store/transactionStore';
import { useUserStore } from '../../store/userStore';
import { useSettingsStore } from '../../store/settingsStore';
import ExportService from '../../services/export';
import { aggregateTransactions } from '../../utils/aggregations';
import { Modal } from '../../components/common/Modal';
import Analytics from '../../services/analytics';

export function ExportScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { transactions } = useTransactionStore();
  const { user } = useUserStore();
  const { settings } = useSettingsStore();
  const [exporting, setExporting] = useState(false);
  const [showNoDataModal, setShowNoDataModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!settings.isPremium) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.lockedContainer}>
          <Text style={styles.lockEmoji}>🔒</Text>
          <Text style={[styles.lockedTitle, { color: theme.colors.text }]}>
            {t('export.title')}
          </Text>
          <Text style={[styles.lockedMessage, { color: theme.colors.textSecondary }]}>
            {t('export.lockedMessage')}
          </Text>
        </View>
      </View>
    );
  }

  const handleExportCSV = async () => {
    if (transactions.length === 0) {
      setShowNoDataModal(true);
      return;
    }

    setExporting(true);
    const result = await ExportService.exportToCSV(transactions, user?.currency || 'USD');
    setExporting(false);

    if (result.success) {
      Analytics.trackExport('csv', transactions.length);
      setShowSuccessModal(true);
    } else {
      setErrorMessage(result.error || t('export.errorDefault'));
      setShowErrorModal(true);
    }
  };

  const handleExportSummary = async () => {
    if (transactions.length === 0) {
      setShowNoDataModal(true);
      return;
    }

    setExporting(true);
    const stats = aggregateTransactions(transactions);
    const result = await ExportService.exportSummaryToText(
      transactions,
      user?.currency || 'USD',
      stats.totalSpent,
      stats.totalSaved
    );
    setExporting(false);

    if (result.success) {
      Analytics.trackExport('summary', transactions.length);
      setShowSuccessModal(true);
    } else {
      setErrorMessage(result.error || t('export.errorDefault'));
      setShowErrorModal(true);
    }
  };

  const handleExportPDF = async () => {
    if (transactions.length === 0) {
      setShowNoDataModal(true);
      return;
    }

    setExporting(true);
    const stats = aggregateTransactions(transactions);
    const result = await ExportService.exportToPDF(
      transactions,
      user?.currency || 'USD',
      stats.totalSpent,
      stats.totalSaved
    );
    setExporting(false);

    if (result.success) {
      Analytics.trackExport('pdf', transactions.length);
      setShowSuccessModal(true);
    } else {
      setErrorMessage(result.error || t('export.errorDefault'));
      setShowErrorModal(true);
    }
  };

  const stats = aggregateTransactions(transactions);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{t('export.title')}</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={[styles.statsCard, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.statsTitle, { color: theme.colors.text }]}>
            {t('export.yourData')}
          </Text>
          <View style={styles.statsRow}>
            <Text style={[styles.statsLabel, { color: theme.colors.textSecondary }]}>
              {t('export.totalTransactions')}
            </Text>
            <Text style={[styles.statsValue, { color: theme.colors.text }]}>
              {transactions.length}
            </Text>
          </View>
          <View style={styles.statsRow}>
            <Text style={[styles.statsLabel, { color: theme.colors.textSecondary }]}>
              {t('export.totalSpent')}
            </Text>
            <Text style={[styles.statsValue, { color: '#FF6B6B' }]}>
              {user?.currency || '$'}
              {stats.totalSpent.toFixed(2)}
            </Text>
          </View>
          <View style={styles.statsRow}>
            <Text style={[styles.statsLabel, { color: theme.colors.textSecondary }]}>
              {t('export.totalSaved')}
            </Text>
            <Text style={[styles.statsValue, { color: '#4ECDC4' }]}>
              {user?.currency || '$'}
              {stats.totalSaved.toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={[styles.exportCard, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.exportHeader}>
            <Text style={styles.exportIcon}>📄</Text>
            <View style={styles.exportInfo}>
              <Text
                style={[styles.exportTitle, { color: theme.colors.text }]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {t('export.csv.title')}
              </Text>
              <Text
                style={[styles.exportDescription, { color: theme.colors.textSecondary }]}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {t('export.csv.description')}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={[
              styles.exportButton,
              { backgroundColor: theme.colors.primary },
              exporting && styles.exportButtonDisabled,
            ]}
            onPress={handleExportCSV}
            disabled={exporting}
          >
            <Text style={styles.exportButtonText}>
              {exporting ? t('export.exporting') : t('export.csv.button')}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.exportCard, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.exportHeader}>
            <Text style={styles.exportIcon}>📋</Text>
            <View style={styles.exportInfo}>
              <Text
                style={[styles.exportTitle, { color: theme.colors.text }]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {t('export.summary.title')}
              </Text>
              <Text
                style={[styles.exportDescription, { color: theme.colors.textSecondary }]}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {t('export.summary.description')}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={[
              styles.exportButton,
              { backgroundColor: theme.colors.primary },
              exporting && styles.exportButtonDisabled,
            ]}
            onPress={handleExportSummary}
            disabled={exporting}
          >
            <Text style={styles.exportButtonText}>
              {exporting ? t('export.exporting') : t('export.summary.button')}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.exportCard, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.exportHeader}>
            <Text style={styles.exportIcon}>📑</Text>
            <View style={styles.exportInfo}>
              <Text
                style={[styles.exportTitle, { color: theme.colors.text }]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {t('export.pdf.title')}
              </Text>
              <Text
                style={[styles.exportDescription, { color: theme.colors.textSecondary }]}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {t('export.pdf.description')}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={[
              styles.exportButton,
              { backgroundColor: theme.colors.primary },
              exporting && styles.exportButtonDisabled,
            ]}
            onPress={handleExportPDF}
            disabled={exporting}
          >
            <Text style={styles.exportButtonText}>
              {exporting ? t('export.generating') : t('export.pdf.button')}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.noteCard, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.noteTitle, { color: theme.colors.text }]}>
            {t('export.note.title')}
          </Text>
          <Text style={[styles.noteText, { color: theme.colors.textSecondary }]}>
            {t('export.note.message')}
          </Text>
        </View>
      </ScrollView>

      {/* Modals */}
      <Modal
        visible={showNoDataModal}
        onClose={() => setShowNoDataModal(false)}
        title={t('export.noData.title')}
        message={t('export.noData.message')}
        icon="📊"
        iconColor={theme.colors.textSecondary}
        actions={[
          { label: t('export.ok'), onPress: () => setShowNoDataModal(false), variant: 'primary' },
        ]}
      />

      <Modal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title={t('export.success.title')}
        message={t('export.success.message')}
        icon="✅"
        iconColor="#4ECDC4"
        actions={[
          { label: t('export.ok'), onPress: () => setShowSuccessModal(false), variant: 'primary' },
        ]}
      />

      <Modal
        visible={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title={t('export.error.title')}
        message={errorMessage}
        icon="❌"
        iconColor="#FF6B6B"
        actions={[
          { label: t('export.ok'), onPress: () => setShowErrorModal(false), variant: 'primary' },
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
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    flexShrink: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statsCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statsLabel: {
    fontSize: 14,
  },
  statsValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  exportCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  exportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  exportIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  exportInfo: {
    flex: 1,
  },
  exportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  exportDescription: {
    fontSize: 13,
  },
  exportButton: {
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  exportButtonDisabled: {
    opacity: 0.6,
  },
  exportButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  noteCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  noteTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  noteText: {
    fontSize: 13,
    lineHeight: 20,
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
});

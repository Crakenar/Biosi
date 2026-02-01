import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useTransactionStore } from '../../store/transactionStore';
import { useUserStore } from '../../store/userStore';
import { useSettingsStore } from '../../store/settingsStore';
import ExportService from '../../services/export';
import { aggregateTransactions } from '../../utils/aggregations';
import { Modal } from '../../components/common/Modal';
import Analytics from '../../services/analytics';

export function ExportScreen() {
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
            Export Data
          </Text>
          <Text style={[styles.lockedMessage, { color: theme.colors.textSecondary }]}>
            Upgrade to Premium to export your transaction data
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
      setErrorMessage(result.error || 'Failed to export transactions');
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
      setErrorMessage(result.error || 'Failed to export summary');
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
      setErrorMessage(result.error || 'Failed to export PDF');
      setShowErrorModal(true);
    }
  };

  const stats = aggregateTransactions(transactions);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Export Data</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={[styles.statsCard, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.statsTitle, { color: theme.colors.text }]}>
            Your Data
          </Text>
          <View style={styles.statsRow}>
            <Text style={[styles.statsLabel, { color: theme.colors.textSecondary }]}>
              Total Transactions:
            </Text>
            <Text style={[styles.statsValue, { color: theme.colors.text }]}>
              {transactions.length}
            </Text>
          </View>
          <View style={styles.statsRow}>
            <Text style={[styles.statsLabel, { color: theme.colors.textSecondary }]}>
              Total Spent:
            </Text>
            <Text style={[styles.statsValue, { color: '#FF6B6B' }]}>
              {user?.currency || '$'}
              {stats.totalSpent.toFixed(2)}
            </Text>
          </View>
          <View style={styles.statsRow}>
            <Text style={[styles.statsLabel, { color: theme.colors.textSecondary }]}>
              Total Saved:
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
              <Text style={[styles.exportTitle, { color: theme.colors.text }]}>
                Export as CSV
              </Text>
              <Text style={[styles.exportDescription, { color: theme.colors.textSecondary }]}>
                Download all transactions in spreadsheet format
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
              {exporting ? 'Exporting...' : 'Export CSV'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.exportCard, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.exportHeader}>
            <Text style={styles.exportIcon}>📋</Text>
            <View style={styles.exportInfo}>
              <Text style={[styles.exportTitle, { color: theme.colors.text }]}>
                Export Summary
              </Text>
              <Text style={[styles.exportDescription, { color: theme.colors.textSecondary }]}>
                Download a text summary of all your transactions
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
              {exporting ? 'Exporting...' : 'Export Summary'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.exportCard, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.exportHeader}>
            <Text style={styles.exportIcon}>📑</Text>
            <View style={styles.exportInfo}>
              <Text style={[styles.exportTitle, { color: theme.colors.text }]}>
                Export as PDF
              </Text>
              <Text style={[styles.exportDescription, { color: theme.colors.textSecondary }]}>
                Generate a formatted PDF report with all transactions
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
              {exporting ? 'Generating...' : 'Export PDF'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.noteCard, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.noteTitle, { color: theme.colors.text }]}>
            📌 Note
          </Text>
          <Text style={[styles.noteText, { color: theme.colors.textSecondary }]}>
            Your data is exported locally and can be shared via any app on your device. We
            don't upload your data to any servers.
          </Text>
        </View>
      </ScrollView>

      {/* Modals */}
      <Modal
        visible={showNoDataModal}
        onClose={() => setShowNoDataModal(false)}
        title="No Data"
        message="You have no transactions to export"
        icon="📊"
        iconColor={theme.colors.textSecondary}
        actions={[
          { label: 'OK', onPress: () => setShowNoDataModal(false), variant: 'primary' },
        ]}
      />

      <Modal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Success"
        message="Export completed successfully!"
        icon="✅"
        iconColor="#4ECDC4"
        actions={[
          { label: 'OK', onPress: () => setShowSuccessModal(false), variant: 'primary' },
        ]}
      />

      <Modal
        visible={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="Error"
        message={errorMessage}
        icon="❌"
        iconColor="#FF6B6B"
        actions={[
          { label: 'OK', onPress: () => setShowErrorModal(false), variant: 'primary' },
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
    fontSize: 28,
    fontWeight: 'bold',
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

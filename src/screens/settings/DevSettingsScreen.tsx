import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../contexts/ThemeContext';
import { useSettingsStore } from '../../store/settingsStore';
import { useTransactionStore } from '../../store/transactionStore';
import { DevTools } from '../../services/devTools';
import * as Updates from 'expo-updates';

export function DevSettingsScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { settings, setPremium } = useSettingsStore();
  const { transactions } = useTransactionStore();
  const [forcePremium, setForcePremium] = useState(
    process.env.EXPO_PUBLIC_FORCE_PREMIUM === 'true'
  );

  if (!DevTools.isDevMode()) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.lockedContainer}>
          <Text style={styles.emoji}>🔒</Text>
          <Text style={[styles.lockedTitle, { color: theme.colors.text }]}>
            Dev Mode Disabled
          </Text>
          <Text style={[styles.lockedMessage, { color: theme.colors.textSecondary }]}>
            Set EXPO_PUBLIC_ENABLE_DEV_MODE=true in .env to enable
          </Text>
        </View>
      </View>
    );
  }

  const handleResetAll = () => {
    Alert.alert(
      '⚠️ Reset Everything',
      'This will delete ALL data including transactions, settings, goals, and budgets. The app will reload.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await DevTools.resetAllData();
            Alert.alert('Success', 'All data reset. Reloading app...', [
              {
                text: 'OK',
                onPress: async () => {
                  await Updates.reloadAsync();
                },
              },
            ]);
          },
        },
      ]
    );
  };

  const handleResetOnboarding = () => {
    Alert.alert(
      '🔄 Reset Onboarding',
      'This will reset onboarding status. App will reload to show onboarding.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          onPress: async () => {
            await DevTools.resetOnboarding();
            Alert.alert('Success', 'Onboarding reset. Reloading app...', [
              {
                text: 'OK',
                onPress: async () => {
                  await Updates.reloadAsync();
                },
              },
            ]);
          },
        },
      ]
    );
  };

  const handleTogglePremium = async () => {
    const newStatus = await DevTools.togglePremium();
    setPremium(newStatus);
    Alert.alert(
      'Success',
      `Premium ${newStatus ? 'enabled' : 'disabled'}. Reloading app...`,
      [
        {
          text: 'OK',
          onPress: async () => {
            await Updates.reloadAsync();
          },
        },
      ]
    );
  };

  const handleAddMockData = () => {
    Alert.alert('Add Mock Transactions', 'How many transactions?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: '10',
        onPress: () => {
          try {
            const mockTransactions = DevTools.getMockTransactions(10);
            // Add directly to store instead of storage
            const transactionStore = useTransactionStore.getState();
            mockTransactions.forEach(tx => {
              transactionStore.addTransaction(tx);
            });
            console.log(`✅ Added ${mockTransactions.length} mock transactions`);
            Alert.alert('Success', `Added ${mockTransactions.length} transactions! Check History.`);
          } catch (error) {
            Alert.alert('Error', `Failed to add transactions: ${error}`);
          }
        },
      },
      {
        text: '50',
        onPress: () => {
          try {
            const mockTransactions = DevTools.getMockTransactions(50);
            const transactionStore = useTransactionStore.getState();
            mockTransactions.forEach(tx => {
              transactionStore.addTransaction(tx);
            });
            console.log(`✅ Added ${mockTransactions.length} mock transactions`);
            Alert.alert('Success', `Added ${mockTransactions.length} transactions! Check History.`);
          } catch (error) {
            Alert.alert('Error', `Failed to add transactions: ${error}`);
          }
        },
      },
      {
        text: '100',
        onPress: () => {
          try {
            const mockTransactions = DevTools.getMockTransactions(100);
            const transactionStore = useTransactionStore.getState();
            mockTransactions.forEach(tx => {
              transactionStore.addTransaction(tx);
            });
            console.log(`✅ Added ${mockTransactions.length} mock transactions`);
            Alert.alert('Success', `Added ${mockTransactions.length} transactions! Check History.`);
          } catch (error) {
            Alert.alert('Error', `Failed to add transactions: ${error}`);
          }
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.backButton, { color: theme.colors.primary }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          🛠️ Developer Settings
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Testing & debugging tools
        </Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Current Status */}
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Current Status
          </Text>
          <View style={styles.statusRow}>
            <Text style={[styles.statusLabel, { color: theme.colors.textSecondary }]}>
              Premium Status:
            </Text>
            <Text
              style={[
                styles.statusValue,
                { color: settings.isPremium ? '#4ECDC4' : theme.colors.text },
              ]}
            >
              {settings.isPremium ? '✅ Active' : '❌ Inactive'}
            </Text>
          </View>
          <View style={styles.statusRow}>
            <Text style={[styles.statusLabel, { color: theme.colors.textSecondary }]}>
              Onboarding:
            </Text>
            <Text style={[styles.statusValue, { color: theme.colors.text }]}>
              {settings.onboardingCompleted ? 'Completed' : 'Not completed'}
            </Text>
          </View>
          <View style={styles.statusRow}>
            <Text style={[styles.statusLabel, { color: theme.colors.textSecondary }]}>
              Force Premium (ENV):
            </Text>
            <Text style={[styles.statusValue, { color: theme.colors.text }]}>
              {forcePremium ? 'Enabled' : 'Disabled'}
            </Text>
          </View>
          <View style={styles.statusRow}>
            <Text style={[styles.statusLabel, { color: theme.colors.textSecondary }]}>
              Transactions:
            </Text>
            <Text style={[styles.statusValue, { color: theme.colors.text }]}>
              {transactions.length}
            </Text>
          </View>
        </View>

        {/* Premium Controls */}
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Premium Controls
          </Text>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleTogglePremium}
          >
            <Text style={styles.actionButtonText}>
              {settings.isPremium ? '🔓 Disable Premium' : '✨ Enable Premium'}
            </Text>
          </TouchableOpacity>

          <Text style={[styles.hint, { color: theme.colors.textSecondary }]}>
            Toggle between free and premium to test features (dev only)
          </Text>
        </View>

        {/* Data Controls */}
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Data Management
          </Text>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#4ECDC4' }]}
            onPress={handleAddMockData}
          >
            <Text style={styles.actionButtonText}>📊 Add Mock Transactions</Text>
          </TouchableOpacity>

          <Text style={[styles.hint, { color: theme.colors.textSecondary }]}>
            Populate the app with test data
          </Text>
        </View>

        {/* Reset Controls */}
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Reset Options
          </Text>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#FFB84D' }]}
            onPress={handleResetOnboarding}
          >
            <Text style={styles.actionButtonText}>🔄 Reset Onboarding</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#FF6B6B', marginTop: 12 }]}
            onPress={handleResetAll}
          >
            <Text style={styles.actionButtonText}>⚠️ Reset Everything</Text>
          </TouchableOpacity>

          <Text style={[styles.hint, { color: theme.colors.textSecondary }]}>
            Danger zone: These actions will reload the app
          </Text>
        </View>

        {/* Environment Info */}
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Environment
          </Text>
          <Text style={[styles.envText, { color: theme.colors.textSecondary }]}>
            DEV_MODE: {process.env.EXPO_PUBLIC_ENABLE_DEV_MODE || 'false'}
          </Text>
          <Text style={[styles.envText, { color: theme.colors.textSecondary }]}>
            FORCE_PREMIUM: {process.env.EXPO_PUBLIC_FORCE_PREMIUM || 'false'}
          </Text>
          <Text style={[styles.envText, { color: theme.colors.textSecondary }]}>
            NODE_ENV: {process.env.NODE_ENV || 'development'}
          </Text>
        </View>
      </ScrollView>
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
  backButton: {
    fontSize: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statusLabel: {
    fontSize: 14,
  },
  statusValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  actionButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  hint: {
    fontSize: 12,
    marginTop: 8,
    fontStyle: 'italic',
  },
  envText: {
    fontSize: 13,
    fontFamily: 'monospace',
    marginBottom: 6,
  },
  lockedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emoji: {
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

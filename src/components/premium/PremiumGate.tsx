import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../contexts/ThemeContext';
import { useSettingsStore } from '../../store/settingsStore';

interface PremiumGateProps {
  featureName: string;
  children: React.ReactNode;
  fullScreen?: boolean;
}

export function PremiumGate({ featureName, children, fullScreen = false }: PremiumGateProps) {
  const { theme } = useTheme();
  const { settings } = useSettingsStore();
  const navigation = useNavigation();

  if (settings.isPremium) {
    return <>{children}</>;
  }

  if (fullScreen) {
    return (
      <View style={[styles.fullScreenContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={styles.lockEmoji}>🔒</Text>
        <Text style={[styles.title, { color: theme.colors.text }]}>{featureName}</Text>
        <Text style={[styles.message, { color: theme.colors.textSecondary }]}>
          This feature requires Premium
        </Text>
        <TouchableOpacity
          style={[styles.upgradeButton, { backgroundColor: theme.colors.primary }]}
          onPress={() =>
            (navigation as any).navigate('SettingsTab', {
              screen: 'PremiumPurchase',
            })
          }
        >
          <Text style={styles.upgradeButtonText}>✨ Upgrade to Premium</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.inlineContainer, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.lockedContent}>
        <Text style={styles.smallLockEmoji}>🔒</Text>
        <View style={styles.lockedText}>
          <Text style={[styles.inlineTitle, { color: theme.colors.text }]}>
            {featureName}
          </Text>
          <Text style={[styles.inlineMessage, { color: theme.colors.textSecondary }]}>
            Premium feature
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={[styles.inlineButton, { backgroundColor: theme.colors.primary }]}
        onPress={() =>
          (navigation as any).navigate('SettingsTab', {
            screen: 'PremiumPurchase',
          })
        }
      >
        <Text style={styles.inlineButtonText}>Upgrade</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  lockEmoji: {
    fontSize: 60,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  upgradeButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 24,
  },
  upgradeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  inlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
  },
  lockedContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  smallLockEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  lockedText: {
    flex: 1,
  },
  inlineTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  inlineMessage: {
    fontSize: 12,
  },
  inlineButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  inlineButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
});

import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ message }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const displayMessage = message ?? t('common.loading');

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
      }}
    >
      <ActivityIndicator size="large" color={theme.colors.primary} />
      {displayMessage && (
        <Text
          style={{
            marginTop: theme.spacing.md,
            fontSize: theme.typography.sizes.md,
            color: theme.colors.textSecondary,
          }}
        >
          {displayMessage}
        </Text>
      )}
    </View>
  );
};

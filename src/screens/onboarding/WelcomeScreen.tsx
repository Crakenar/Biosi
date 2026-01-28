import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { OnboardingStackParamList } from '../../navigation/types';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '../../components/common/Button';
import { ProgressBar } from '../../components/onboarding/ProgressBar';
import { useTranslation } from 'react-i18next';

type WelcomeScreenNavigationProp = StackNavigationProp<OnboardingStackParamList, 'Welcome'>;

export const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          padding: theme.spacing.xl,
        },
      ]}
    >
      <View style={styles.content}>
        <ProgressBar currentStep={1} totalSteps={5} />
        <Text
          style={{
            fontSize: theme.typography.sizes.xxl,
            fontWeight: 'bold',
            color: theme.colors.primary,
            textAlign: 'center',
            marginBottom: theme.spacing.lg,
          }}
        >
          {t('onboarding.welcome.title')}
        </Text>
        <Text
          style={{
            fontSize: theme.typography.sizes.lg,
            color: theme.colors.text,
            textAlign: 'center',
            marginBottom: theme.spacing.md,
          }}
        >
          {t('onboarding.welcome.subtitle')}
        </Text>
        <Text
          style={{
            fontSize: theme.typography.sizes.md,
            color: theme.colors.textSecondary,
            textAlign: 'center',
            lineHeight: 24,
          }}
        >
          {t('onboarding.welcome.description')}
        </Text>
      </View>

      <Button
        title={t('onboarding.welcome.getStarted')}
        onPress={() => navigation.navigate('LanguageSelection')}
        size="large"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

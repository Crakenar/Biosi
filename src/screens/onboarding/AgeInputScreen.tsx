import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { OnboardingStackParamList } from '../../navigation/types';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { ProgressBar } from '../../components/onboarding/ProgressBar';
import { APP_CONFIG } from '../../constants/config';

type NavigationProp = StackNavigationProp<OnboardingStackParamList, 'AgeInput'>;
type RoutePropType = RouteProp<OnboardingStackParamList, 'AgeInput'>;

export function AgeInputScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RoutePropType>();
  const { name } = route.params;

  const [age, setAge] = useState('');
  const [error, setError] = useState('');

  const handleNext = () => {
    Keyboard.dismiss();

    // Validate age
    const ageNum = parseInt(age, 10);

    if (!age.trim()) {
      setError(t('onboarding.profile.ageRequired'));
      return;
    }
    if (isNaN(ageNum)) {
      setError(t('onboarding.profile.ageNumber'));
      return;
    }
    if (ageNum < APP_CONFIG.VALIDATION.MIN_AGE) {
      setError(t('onboarding.profile.ageMin', { min: APP_CONFIG.VALIDATION.MIN_AGE }));
      return;
    }
    if (ageNum > APP_CONFIG.VALIDATION.MAX_AGE) {
      setError(t('onboarding.profile.ageMax', { max: APP_CONFIG.VALIDATION.MAX_AGE }));
      return;
    }

    // Navigate to currency selection with name and age
    navigation.navigate('CurrencySelection', { name, age: ageNum });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, backgroundColor: theme.colors.background }}
      >
        <ScrollView
          contentContainerStyle={[
            styles.container,
            {
              padding: theme.spacing.xl,
            },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <ProgressBar currentStep={4} totalSteps={7} />
            <Text
              style={{
                fontSize: theme.typography.sizes.xl,
                fontWeight: 'bold',
                color: theme.colors.text,
                marginBottom: theme.spacing.md,
              }}
            >
              {t('onboarding.age.title')}
            </Text>
            <Text
              style={{
                fontSize: theme.typography.sizes.md,
                color: theme.colors.textSecondary,
                marginBottom: theme.spacing.xl,
              }}
            >
              {t('onboarding.age.description')}
            </Text>

            <Input
              label={t('onboarding.profile.ageLabel')}
              placeholder={t('onboarding.profile.agePlaceholder')}
              keyboardType="number-pad"
              value={age}
              onChangeText={(text) => {
                setAge(text);
                setError('');
              }}
              error={error}
              autoFocus
              returnKeyType="next"
              onSubmitEditing={handleNext}
            />
          </View>

          <Button
            title={t('common.next')}
            onPress={handleNext}
            size="large"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
  },
});

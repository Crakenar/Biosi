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
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { OnboardingStackParamList } from '../../navigation/types';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { ProgressBar } from '../../components/onboarding/ProgressBar';
import { APP_CONFIG } from '../../constants/config';

type NavigationProp = StackNavigationProp<OnboardingStackParamList, 'NameInput'>;

export function NameInputScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleNext = () => {
    Keyboard.dismiss();

    // Validate name
    if (!name.trim()) {
      setError(t('onboarding.profile.nameRequired'));
      return;
    }
    if (name.trim().length < APP_CONFIG.VALIDATION.MIN_NAME_LENGTH) {
      setError(t('onboarding.profile.nameMin'));
      return;
    }
    if (name.trim().length > APP_CONFIG.VALIDATION.MAX_NAME_LENGTH) {
      setError(t('onboarding.profile.nameMax'));
      return;
    }
    if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
      setError(t('onboarding.profile.namePattern'));
      return;
    }

    // Navigate to age input with name
    navigation.navigate('AgeInput', { name: name.trim() });
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
            <ProgressBar currentStep={3} totalSteps={7} />
            <Text
              style={{
                fontSize: theme.typography.sizes.xl,
                fontWeight: 'bold',
                color: theme.colors.text,
                marginBottom: theme.spacing.md,
              }}
            >
              {t('onboarding.name.title')}
            </Text>
            <Text
              style={{
                fontSize: theme.typography.sizes.md,
                color: theme.colors.textSecondary,
                marginBottom: theme.spacing.xl,
              }}
            >
              {t('onboarding.name.description')}
            </Text>

            <Input
              label={t('onboarding.profile.nameLabel')}
              placeholder={t('onboarding.profile.namePlaceholder')}
              value={name}
              onChangeText={(text) => {
                setName(text);
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

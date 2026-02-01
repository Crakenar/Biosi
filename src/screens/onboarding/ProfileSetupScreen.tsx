import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useForm, Controller } from 'react-hook-form';
import { OnboardingStackParamList } from '../../navigation/types';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { ProgressBar } from '../../components/onboarding/ProgressBar';
import { MotivationalLoader } from '../../components/onboarding/MotivationalLoader';
import { APP_CONFIG } from '../../constants/config';
import { useTranslation } from 'react-i18next';

type ProfileSetupNavigationProp = StackNavigationProp<OnboardingStackParamList, 'ProfileSetup'>;

interface ProfileForm {
  name: string;
  age: string;
}

export const ProfileSetupScreen: React.FC = () => {
  const navigation = useNavigation<ProfileSetupNavigationProp>();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [showLoader, setShowLoader] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileForm>({
    defaultValues: {
      name: '',
      age: '',
    },
  });

  const onSubmit = (data: ProfileForm) => {
    const age = parseInt(data.age, 10);

    if (age < APP_CONFIG.VALIDATION.MIN_AGE || age > APP_CONFIG.VALIDATION.MAX_AGE) {
      return;
    }

    if (
      data.name.length < APP_CONFIG.VALIDATION.MIN_NAME_LENGTH ||
      data.name.length > APP_CONFIG.VALIDATION.MAX_NAME_LENGTH
    ) {
      return;
    }

    setShowLoader(true);
    setTimeout(() => {
      setShowLoader(false);
      navigation.navigate('CurrencySelection', { name: data.name.trim(), age });
    }, 1500);
  };

  return (
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
      >
        <View style={styles.content}>
          <ProgressBar currentStep={3} totalSteps={6} />
          <Text
            style={{
              fontSize: theme.typography.sizes.xl,
              fontWeight: 'bold',
              color: theme.colors.text,
              marginBottom: theme.spacing.md,
            }}
          >
            {t('onboarding.profile.title')}
          </Text>
          <Text
            style={{
              fontSize: theme.typography.sizes.md,
              color: theme.colors.textSecondary,
              marginBottom: theme.spacing.xl,
            }}
          >
            {t('onboarding.profile.description')}
          </Text>

          <Controller
            control={control}
            rules={{
              required: t('onboarding.profile.nameRequired'),
              minLength: {
                value: APP_CONFIG.VALIDATION.MIN_NAME_LENGTH,
                message: t('onboarding.profile.nameMin'),
              },
              maxLength: {
                value: APP_CONFIG.VALIDATION.MAX_NAME_LENGTH,
                message: t('onboarding.profile.nameMax'),
              },
              pattern: {
                value: /^[a-zA-Z\s]+$/,
                message: t('onboarding.profile.namePattern'),
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={t('onboarding.profile.nameLabel')}
                placeholder={t('onboarding.profile.namePlaceholder')}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.name?.message}
                containerStyle={{ marginBottom: theme.spacing.lg }}
              />
            )}
            name="name"
          />

          <Controller
            control={control}
            rules={{
              required: t('onboarding.profile.ageRequired'),
              validate: (value) => {
                const age = parseInt(value, 10);
                if (isNaN(age)) return t('onboarding.profile.ageNumber');
                if (age < APP_CONFIG.VALIDATION.MIN_AGE)
                  return t('onboarding.profile.ageMin', { min: APP_CONFIG.VALIDATION.MIN_AGE });
                if (age > APP_CONFIG.VALIDATION.MAX_AGE)
                  return t('onboarding.profile.ageMax', { max: APP_CONFIG.VALIDATION.MAX_AGE });
                return true;
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={t('onboarding.profile.ageLabel')}
                placeholder={t('onboarding.profile.agePlaceholder')}
                keyboardType="number-pad"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.age?.message}
                containerStyle={{ marginBottom: theme.spacing.lg }}
              />
            )}
            name="age"
          />
        </View>

        <Button title={t('common.next')} onPress={handleSubmit(onSubmit)} size="large" />

        <MotivationalLoader visible={showLoader} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
  },
});

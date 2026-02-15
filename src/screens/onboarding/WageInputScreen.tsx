import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useForm, Controller } from 'react-hook-form';
import { OnboardingStackParamList } from '../../navigation/types';
import { useTheme } from '../../contexts/ThemeContext';
import { useUserStore } from '../../store/userStore';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { ProgressBar } from '../../components/onboarding/ProgressBar';
import { MotivationalLoader } from '../../components/onboarding/MotivationalLoader';
import { APP_CONFIG } from '../../constants/config';
import { useTranslation } from 'react-i18next';
import { normalizeToHourly } from '../../services/calculations';

type WageInputNavigationProp = StackNavigationProp<OnboardingStackParamList, 'WageInput'>;
type WageInputRouteProp = RouteProp<OnboardingStackParamList, 'WageInput'>;

interface WageForm {
  amount: string;
  hoursPerWeek: string;
}

export const WageInputScreen: React.FC = () => {
  const navigation = useNavigation<WageInputNavigationProp>();
  const route = useRoute<WageInputRouteProp>();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { setUser } = useUserStore();
  const [selectedPeriod, setSelectedPeriod] = useState<'hourly' | 'monthly' | 'yearly'>('hourly');
  const [showLoader, setShowLoader] = useState(false);

  const PERIODS: Array<{ value: 'hourly' | 'monthly' | 'yearly'; label: string }> = [
    { value: 'hourly', label: t('onboarding.wage.hourly') },
    { value: 'monthly', label: t('onboarding.wage.monthly') },
    { value: 'yearly', label: t('onboarding.wage.yearly') },
  ];

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<WageForm>({
    defaultValues: {
      amount: '',
      hoursPerWeek: '40',
    },
  });

  const onSubmit = (data: WageForm) => {
    Keyboard.dismiss();

    const amount = parseFloat(data.amount);
    const hoursPerWeek = parseFloat(data.hoursPerWeek);

    if (amount < APP_CONFIG.VALIDATION.MIN_WAGE) {
      return;
    }

    if (hoursPerWeek < 1 || hoursPerWeek > 168) {
      return;
    }

    const { name, age, currency } = route.params;
    const hourlyRate = normalizeToHourly(amount, selectedPeriod, hoursPerWeek);

    // Save user data
    setUser({
      id: `user_${Date.now()}`,
      name,
      age,
      currency,
      wage: {
        amount,
        period: selectedPeriod,
        hourlyRate,
      },
      hoursPerWeek,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    setShowLoader(true);
    setTimeout(() => {
      setShowLoader(false);
      navigation.navigate('PremiumUpsell');
    }, 1500);
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
          <ProgressBar currentStep={6} totalSteps={7} />
          <Text
            style={{
              fontSize: theme.typography.sizes.xl,
              fontWeight: 'bold',
              color: theme.colors.text,
              marginBottom: theme.spacing.md,
            }}
          >
            {t('onboarding.wage.title')}
          </Text>
          <Text
            style={{
              fontSize: theme.typography.sizes.md,
              color: theme.colors.textSecondary,
              marginBottom: theme.spacing.xl,
            }}
          >
            {t('onboarding.wage.description')}
          </Text>

          <Controller
            control={control}
            rules={{
              required: t('onboarding.wage.wageRequired'),
              validate: (value) => {
                const amount = parseFloat(value);
                if (isNaN(amount)) return t('onboarding.wage.wageNumber');
                if (amount < APP_CONFIG.VALIDATION.MIN_WAGE) return t('onboarding.wage.wagePositive');
                return true;
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={t('onboarding.wage.wageLabel')}
                placeholder={t('onboarding.wage.wagePlaceholder')}
                keyboardType="decimal-pad"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.amount?.message}
                containerStyle={{ marginBottom: theme.spacing.lg }}
              />
            )}
            name="amount"
          />

          <Text
            style={{
              fontSize: theme.typography.sizes.sm,
              fontWeight: '600',
              color: theme.colors.text,
              marginBottom: theme.spacing.sm,
            }}
          >
            {t('onboarding.wage.payPeriod')}
          </Text>
          <View style={styles.periodContainer}>
            {PERIODS.map((period) => (
              <TouchableOpacity
                key={period.value}
                style={{
                  flex: 1,
                  paddingVertical: theme.spacing.md,
                  backgroundColor:
                    selectedPeriod === period.value ? theme.colors.primary : theme.colors.surface,
                  borderRadius: theme.borderRadius.md,
                  borderWidth: 1,
                  borderColor:
                    selectedPeriod === period.value ? theme.colors.primary : theme.colors.border,
                  marginHorizontal: theme.spacing.xs,
                }}
                onPress={() => setSelectedPeriod(period.value)}
              >
                <Text
                  style={{
                    fontSize: theme.typography.sizes.md,
                    fontWeight: '600',
                    color: selectedPeriod === period.value ? '#FFFFFF' : theme.colors.text,
                    textAlign: 'center',
                  }}
                >
                  {period.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Controller
            control={control}
            rules={{
              required: t('onboarding.wage.hoursRequired'),
              validate: (value) => {
                const hours = parseFloat(value);
                if (isNaN(hours)) return t('onboarding.wage.hoursNumber');
                if (hours < 1) return t('onboarding.wage.hoursMin');
                if (hours > 168) return t('onboarding.wage.hoursMax');
                return true;
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={t('onboarding.wage.hoursPerWeekLabel')}
                placeholder={t('onboarding.wage.hoursPerWeekPlaceholder')}
                keyboardType="decimal-pad"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.hoursPerWeek?.message}
                containerStyle={{ marginTop: theme.spacing.lg }}
              />
            )}
            name="hoursPerWeek"
          />
        </View>

        <Button title={t('common.next')} onPress={handleSubmit(onSubmit)} size="large" />

        <MotivationalLoader visible={showLoader} />
      </ScrollView>
    </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
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
  periodContainer: {
    flexDirection: 'row',
    marginHorizontal: -4,
  },
});

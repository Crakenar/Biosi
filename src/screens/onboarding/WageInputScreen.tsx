import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
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

type WageInputNavigationProp = StackNavigationProp<OnboardingStackParamList, 'WageInput'>;
type WageInputRouteProp = RouteProp<OnboardingStackParamList, 'WageInput'>;

interface WageForm {
  amount: string;
  hoursPerWeek: string;
}

const PERIODS: Array<{ value: 'hourly' | 'monthly' | 'yearly'; label: string }> = [
  { value: 'hourly', label: 'Hourly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
];

export const WageInputScreen: React.FC = () => {
  const navigation = useNavigation<WageInputNavigationProp>();
  const route = useRoute<WageInputRouteProp>();
  const { theme } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState<'hourly' | 'monthly' | 'yearly'>('hourly');
  const [showLoader, setShowLoader] = useState(false);

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
    const amount = parseFloat(data.amount);
    const hoursPerWeek = parseFloat(data.hoursPerWeek);

    if (amount < APP_CONFIG.VALIDATION.MIN_WAGE) {
      return;
    }

    if (hoursPerWeek < 1 || hoursPerWeek > 168) {
      return;
    }

    setShowLoader(true);
    setTimeout(() => {
      setShowLoader(false);
      navigation.navigate('CurrencySelection', {
        name: route.params.name,
        age: route.params.age,
        wage: {
          amount,
          period: selectedPeriod,
        },
        hoursPerWeek,
      });
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
          <ProgressBar currentStep={4} totalSteps={5} />
          <Text
            style={{
              fontSize: theme.typography.sizes.xl,
              fontWeight: 'bold',
              color: theme.colors.text,
              marginBottom: theme.spacing.md,
            }}
          >
            What's your wage?
          </Text>
          <Text
            style={{
              fontSize: theme.typography.sizes.md,
              color: theme.colors.textSecondary,
              marginBottom: theme.spacing.xl,
            }}
          >
            This helps us calculate how many hours of work each purchase represents.
          </Text>

          <Controller
            control={control}
            rules={{
              required: 'Wage amount is required',
              validate: (value) => {
                const amount = parseFloat(value);
                if (isNaN(amount)) return 'Wage must be a valid number';
                if (amount < APP_CONFIG.VALIDATION.MIN_WAGE) return 'Wage must be positive';
                return true;
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Wage Amount"
                placeholder="Enter amount"
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
            Pay Period
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
              required: 'Hours per week is required',
              validate: (value) => {
                const hours = parseFloat(value);
                if (isNaN(hours)) return 'Hours must be a valid number';
                if (hours < 1) return 'Hours must be at least 1';
                if (hours > 168) return 'Hours cannot exceed 168 per week';
                return true;
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Hours Per Week"
                placeholder="Enter hours per week"
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

        <Button title="Next" onPress={handleSubmit(onSubmit)} size="large" />

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
  periodContainer: {
    flexDirection: 'row',
    marginHorizontal: -4,
  },
});

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
import { APP_CONFIG } from '../../constants/config';
import { useTranslation } from 'react-i18next';

type WageInputNavigationProp = StackNavigationProp<OnboardingStackParamList, 'WageInput'>;
type WageInputRouteProp = RouteProp<OnboardingStackParamList, 'WageInput'>;

interface WageForm {
  amount: string;
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

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<WageForm>({
    defaultValues: {
      amount: '',
    },
  });

  const onSubmit = (data: WageForm) => {
    const amount = parseFloat(data.amount);

    if (amount < APP_CONFIG.VALIDATION.MIN_WAGE) {
      return;
    }

    navigation.navigate('CurrencySelection', {
      name: route.params.name,
      age: route.params.age,
      wage: {
        amount,
        period: selectedPeriod,
      },
    });
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
        </View>

        <Button title="Next" onPress={handleSubmit(onSubmit)} size="large" />
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

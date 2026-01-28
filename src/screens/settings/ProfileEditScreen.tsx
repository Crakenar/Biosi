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
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useForm, Controller } from 'react-hook-form';
import { SettingsStackParamList } from '../../navigation/types';
import { useTheme } from '../../contexts/ThemeContext';
import { useUserStore } from '../../store/userStore';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { APP_CONFIG } from '../../constants/config';
import { normalizeToHourly } from '../../services/calculations';
import { useTranslation } from 'react-i18next';

type ProfileEditNavigationProp = StackNavigationProp<SettingsStackParamList, 'ProfileEdit'>;

interface ProfileEditForm {
  name: string;
  age: string;
  wageAmount: string;
  hoursPerWeek: string;
}

const PERIODS: Array<{ value: 'hourly' | 'monthly' | 'yearly'; label: string }> = [
  { value: 'hourly', label: 'Hourly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
];

export const ProfileEditScreen: React.FC = () => {
  const navigation = useNavigation<ProfileEditNavigationProp>();
  const { theme } = useTheme();
  const { user, updateUser } = useUserStore();

  const [selectedPeriod, setSelectedPeriod] = useState<'hourly' | 'monthly' | 'yearly'>(
    user?.wage.period || 'hourly'
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileEditForm>({
    defaultValues: {
      name: user?.name || '',
      age: user?.age.toString() || '',
      wageAmount: user?.wage.amount.toString() || '',
      hoursPerWeek: user?.hoursPerWeek?.toString() || '40',
    },
  });

  const onSubmit = (data: ProfileEditForm) => {
    const age = parseInt(data.age, 10);
    const wageAmount = parseFloat(data.wageAmount);
    const hoursPerWeek = parseFloat(data.hoursPerWeek);

    if (!user) return;

    const hourlyRate = normalizeToHourly(wageAmount, selectedPeriod, hoursPerWeek);

    updateUser({
      name: data.name.trim(),
      age,
      wage: {
        amount: wageAmount,
        period: selectedPeriod,
        hourlyRate,
      },
      hoursPerWeek,
    });

    navigation.goBack();
  };

  if (!user) {
    return null;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: theme.colors.background }}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          padding: theme.spacing.xl,
          paddingTop: theme.spacing.xxl * 1.5

        }}
      >
        {/* Header */}
        <Text
          style={{
            fontSize: theme.typography.sizes.xl,
            fontWeight: 'bold',
            color: theme.colors.text,
            marginBottom: theme.spacing.md,
          }}
        >
          Edit Profile
        </Text>
        <Text
          style={{
            fontSize: theme.typography.sizes.md,
            color: theme.colors.textSecondary,
            marginBottom: theme.spacing.xl,
          }}
        >
          Update your profile information
        </Text>

        {/* Form */}
        <Controller
          control={control}
          rules={{
            required: 'Name is required',
            minLength: {
              value: APP_CONFIG.VALIDATION.MIN_NAME_LENGTH,
              message: 'Name must be at least 2 characters',
            },
            maxLength: {
              value: APP_CONFIG.VALIDATION.MAX_NAME_LENGTH,
              message: 'Name must be at most 50 characters',
            },
            pattern: {
              value: /^[a-zA-Z\s]+$/,
              message: 'Name can only contain letters and spaces',
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Name"
              placeholder="Enter your name"
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
            required: 'Age is required',
            validate: (value) => {
              const age = parseInt(value, 10);
              if (isNaN(age)) return 'Age must be a number';
              if (age < APP_CONFIG.VALIDATION.MIN_AGE)
                return `Age must be at least ${APP_CONFIG.VALIDATION.MIN_AGE}`;
              if (age > APP_CONFIG.VALIDATION.MAX_AGE)
                return `Age must be at most ${APP_CONFIG.VALIDATION.MAX_AGE}`;
              return true;
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Age"
              placeholder="Enter your age"
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
              error={errors.wageAmount?.message}
              containerStyle={{ marginBottom: theme.spacing.lg }}
            />
          )}
          name="wageAmount"
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
              containerStyle={{ marginBottom: theme.spacing.lg }}
            />
          )}
          name="hoursPerWeek"
        />

        <View style={{ marginTop: 'auto', paddingTop: theme.spacing.xl }}>
          <Button title="Save Changes" onPress={handleSubmit(onSubmit)} size="large" />
          <Button
            title="Cancel"
            onPress={() => navigation.goBack()}
            variant="outline"
            size="large"
            style={{ marginTop: theme.spacing.md }}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  periodContainer: {
    flexDirection: 'row',
    marginHorizontal: -4,
    marginBottom: 24,
  },
});

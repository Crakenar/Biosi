import React from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useForm, Controller } from 'react-hook-form';
import { SettingsStackParamList } from '../../navigation/types';
import { useTheme } from '../../contexts/ThemeContext';
import { useSettingsStore } from '../../store/settingsStore';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';

type WorkHoursSettingsNavigationProp = StackNavigationProp<
  SettingsStackParamList,
  'WorkHoursSettings'
>;

interface WorkHoursForm {
  workHoursPerDay: string;
}

export const WorkHoursSettingsScreen: React.FC = () => {
  const navigation = useNavigation<WorkHoursSettingsNavigationProp>();
  const { theme } = useTheme();
  const { settings, updateSettings } = useSettingsStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<WorkHoursForm>({
    defaultValues: {
      workHoursPerDay: settings.workHoursPerDay.toString(),
    },
  });

  const onSubmit = (data: WorkHoursForm) => {
    const workHoursPerDay = parseFloat(data.workHoursPerDay);
    updateSettings({ workHoursPerDay });
    navigation.goBack();
  };

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
        <Text
          style={{
            fontSize: theme.typography.sizes.xl,
            fontWeight: 'bold',
            color: theme.colors.text,
            marginBottom: theme.spacing.md,
          }}
        >
          Work Hours Per Day
        </Text>
        <Text
          style={{
            fontSize: theme.typography.sizes.md,
            color: theme.colors.textSecondary,
            marginBottom: theme.spacing.xl,
          }}
        >
          Set the number of hours in a work day. This is used to convert hours into work days
          (e.g., 7 hours = 1 work day).
        </Text>

        <Controller
          control={control}
          rules={{
            required: 'Work hours per day is required',
            validate: (value) => {
              const hours = parseFloat(value);
              if (isNaN(hours)) return 'Hours must be a valid number';
              if (hours < 1) return 'Hours must be at least 1';
              if (hours > 24) return 'Hours cannot exceed 24';
              return true;
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Work Hours Per Day"
              placeholder="Enter hours (e.g., 7)"
              keyboardType="decimal-pad"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.workHoursPerDay?.message}
            />
          )}
          name="workHoursPerDay"
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

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
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
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
          paddingTop: theme.spacing.xxl * 1.5,
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
          {t('settings.workHoursPerDay')}
        </Text>
        <Text
          style={{
            fontSize: theme.typography.sizes.md,
            color: theme.colors.textSecondary,
            marginBottom: theme.spacing.xl,
          }}
        >
          {t('settings.workHoursPerDayDesc')}
        </Text>

        <Controller
          control={control}
          rules={{
            required: t('settings.workHoursRequired'),
            validate: (value) => {
              const hours = parseFloat(value);
              if (isNaN(hours)) return t('onboarding.wage.hoursNumber');
              if (hours < 1) return t('onboarding.wage.hoursMin');
              if (hours > 24) return t('settings.workHoursMax');
              return true;
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label={t('settings.workHoursPerDay')}
              placeholder={t('settings.workHoursPlaceholder')}
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
          <Button title={t('settings.editProfile.saveChanges')} onPress={handleSubmit(onSubmit)} size="large" />
          <Button
            title={t('common.cancel')}
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

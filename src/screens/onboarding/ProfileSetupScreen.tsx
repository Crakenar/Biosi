import React from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useForm, Controller } from 'react-hook-form';
import { OnboardingStackParamList } from '../../navigation/types';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
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

    navigation.navigate('WageInput', { name: data.name.trim(), age });
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
            Let's get to know you
          </Text>
          <Text
            style={{
              fontSize: theme.typography.sizes.md,
              color: theme.colors.textSecondary,
              marginBottom: theme.spacing.xl,
            }}
          >
            We need some basic information to calculate your work hours.
          </Text>

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
                label="Your Name"
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
                label="Your Age"
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
});

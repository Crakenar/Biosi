import React from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps, ViewStyle } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  style,
  ...textInputProps
}) => {
  const { theme } = useTheme();

  return (
    <View style={[containerStyle]}>
      {label && (
        <Text
          style={{
            fontSize: theme.typography.sizes.sm,
            fontWeight: '600',
            color: theme.colors.text,
            marginBottom: theme.spacing.xs,
          }}
        >
          {label}
        </Text>
      )}
      <TextInput
        style={[
          {
            borderWidth: 1,
            borderColor: error ? theme.colors.error : theme.colors.border,
            borderRadius: theme.borderRadius.md,
            paddingVertical: theme.spacing.md,
            paddingHorizontal: theme.spacing.md,
            fontSize: theme.typography.sizes.md,
            color: theme.colors.text,
            backgroundColor: theme.colors.surface,
          },
          style,
        ]}
        placeholderTextColor={theme.colors.textSecondary}
        {...textInputProps}
      />
      {error && (
        <Text
          style={{
            fontSize: theme.typography.sizes.xs,
            color: theme.colors.error,
            marginTop: theme.spacing.xs,
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
};

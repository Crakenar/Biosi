import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const { theme } = useTheme();
  const progress = (currentStep / totalSteps) * 100;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.progressBarBackground,
          { backgroundColor: theme.colors.border },
        ]}
      >
        <View
          style={[
            styles.progressBarFill,
            {
              width: `${progress}%`,
              backgroundColor: theme.colors.primary,
            },
          ]}
        />
      </View>
      <Text
        style={{
          fontSize: theme.typography.sizes.sm,
          color: theme.colors.textSecondary,
          marginTop: theme.spacing.xs,
          textAlign: 'center',
        }}
      >
        Step {currentStep} of {totalSteps}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 24,
  },
  progressBarBackground: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
  },
});

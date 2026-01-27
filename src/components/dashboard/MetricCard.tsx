import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { Card } from '../common/Card';

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  color?: 'primary' | 'success' | 'error' | 'secondary';
  icon?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  color = 'primary',
  icon,
}) => {
  const { theme } = useTheme();

  const getColor = () => {
    switch (color) {
      case 'success':
        return theme.colors.success;
      case 'error':
        return theme.colors.error;
      case 'secondary':
        return theme.colors.secondary;
      default:
        return theme.colors.primary;
    }
  };

  return (
    <Card variant="elevated" style={{ flex: 1, marginHorizontal: theme.spacing.xs }}>
      {icon && (
        <Text style={{ fontSize: 32, marginBottom: theme.spacing.sm }}>{icon}</Text>
      )}
      <Text
        style={{
          fontSize: theme.typography.sizes.sm,
          color: theme.colors.textSecondary,
          marginBottom: theme.spacing.xs,
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          fontSize: theme.typography.sizes.xl,
          fontWeight: 'bold',
          color: getColor(),
          marginBottom: subtitle ? theme.spacing.xs : 0,
        }}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.7}
      >
        {value}
      </Text>
      {subtitle && (
        <Text
          style={{
            fontSize: theme.typography.sizes.xs,
            color: theme.colors.textSecondary,
          }}
        >
          {subtitle}
        </Text>
      )}
    </Card>
  );
};

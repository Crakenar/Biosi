import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { DashboardStackParamList } from '../../navigation/types';
import { useTheme } from '../../contexts/ThemeContext';
import { useUserStore } from '../../store/userStore';
import { useSettingsStore } from '../../store/settingsStore';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { formatHours } from '../../services/calculations';
import { formatCurrency } from '../../utils/formatters';
import { useTranslation } from 'react-i18next';

type ResultNavigationProp = StackNavigationProp<DashboardStackParamList, 'Result'>;
type ResultRouteProp = RouteProp<DashboardStackParamList, 'Result'>;

export const ResultScreen: React.FC = () => {
  const navigation = useNavigation<ResultNavigationProp>();
  const route = useRoute<ResultRouteProp>();
  const { theme } = useTheme();
  const { user } = useUserStore();
  const { settings } = useSettingsStore();
    const { t } = useTranslation();

  const { type, price, hours } = route.params;

  const scaleAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
  }, []);

  const handleDone = () => {
    navigation.navigate('DashboardMain');
  };

  if (!user) {
    return null;
  }

  const isPurchase = type === 'purchased';
  const emoji = isPurchase ? '💸' : '🎉';
  const title = isPurchase ? 'Purchase Recorded' : 'Great Choice!';
  const message = isPurchase
    ? `You spent ${formatHours(hours, settings.workHoursPerDay)} of work on this item.`
    : `You saved ${formatHours(hours, settings.workHoursPerDay)} of work by not buying this item!`;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: theme.spacing.xl,
        justifyContent: 'center',
      }}
    >
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
        }}
      >
        <Text
          style={{
            fontSize: 80,
            textAlign: 'center',
            marginBottom: theme.spacing.xl,
          }}
        >
          {emoji}
        </Text>

        <Text
          style={{
            fontSize: theme.typography.sizes.xxl,
            fontWeight: 'bold',
            color: theme.colors.text,
            textAlign: 'center',
            marginBottom: theme.spacing.md,
          }}
        >
          {title}
        </Text>

        <Text
          style={{
            fontSize: theme.typography.sizes.lg,
            color: theme.colors.textSecondary,
            textAlign: 'center',
            marginBottom: theme.spacing.xl,
          }}
        >
          {message}
        </Text>

        <Card variant="elevated" style={{ marginBottom: theme.spacing.xl }}>
          <View style={styles.detailRow}>
            <Text
              style={{
                fontSize: theme.typography.sizes.md,
                color: theme.colors.textSecondary,
              }}
            >
              Amount
            </Text>
            <Text
              style={{
                fontSize: theme.typography.sizes.lg,
                fontWeight: 'bold',
                color: theme.colors.text,
              }}
            >
              {formatCurrency(price, user.currency)}
            </Text>
          </View>

          <View
            style={{
              height: 1,
              backgroundColor: theme.colors.border,
              marginVertical: theme.spacing.md,
            }}
          />

          <View style={styles.detailRow}>
            <Text
              style={{
                fontSize: theme.typography.sizes.md,
                color: theme.colors.textSecondary,
              }}
            >
              Hours of Work
            </Text>
            <Text
              style={{
                fontSize: theme.typography.sizes.lg,
                fontWeight: 'bold',
                color: isPurchase ? theme.colors.error : theme.colors.success,
              }}
            >
              {formatHours(hours, settings.workHoursPerDay)}
            </Text>
          </View>
        </Card>

        <Button title="Done" onPress={handleDone} size="large" />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

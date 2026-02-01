import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { DashboardStackParamList } from '../../navigation/types';
import { useTheme } from '../../contexts/ThemeContext';
import { useUserStore } from '../../store/userStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useTransactionStore } from '../../store/transactionStore';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Card } from '../../components/common/Card';
import { calculateHoursOfWork, formatHours } from '../../services/calculations';
import { formatCurrency } from '../../utils/formatters';
import { useTranslation } from 'react-i18next';
import { CATEGORIES, TransactionCategory } from '../../types/category';

type ItemCheckNavigationProp = StackNavigationProp<DashboardStackParamList, 'ItemCheck'>;

export const ItemCheckModal: React.FC = () => {
  const navigation = useNavigation<ItemCheckNavigationProp>();
  const { theme } = useTheme();
  const { user } = useUserStore();
  const { settings } = useSettingsStore();
  const { addTransaction } = useTransactionStore();
  const { t } = useTranslation();

  const [label, setLabel] = useState('');
  const [price, setPrice] = useState('');
  const [hours, setHours] = useState(0);
  const [error, setError] = useState('');
  const [labelError, setLabelError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TransactionCategory>('other');
  const [note, setNote] = useState('');

  const progressAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    if (price && !isNaN(parseFloat(price)) && user) {
      const priceValue = parseFloat(price);
      const calculatedHours = calculateHoursOfWork(priceValue, user.wage.hourlyRate);
      setHours(calculatedHours);
      setError('');

      Animated.spring(progressAnim, {
        toValue: Math.min(calculatedHours / 24, 1),
        useNativeDriver: false,
      }).start();
    } else {
      setHours(0);
      progressAnim.setValue(0);
    }
  }, [price, user]);


  const handleAction = (type: 'purchased' | 'saved') => {
    // Reset errors
    setError('');
    setLabelError('');

    // Validate label
    if (!label.trim()) {
      setLabelError(t('itemCheck.labelRequired'));
      return;
    }

    // Validate price
    if (!price || isNaN(parseFloat(price))) {
      setError(t('itemCheck.enterValidPrice'));
      return;
    }

    const priceValue = parseFloat(price);
    if (priceValue <= 0) {
      setError(t('itemCheck.pricePositive'));
      return;
    }

    if (!user) {
      setError(t('itemCheck.userNotFound'));
      return;
    }

    addTransaction({
      type,
      itemPrice: priceValue,
      hoursOfWork: hours,
      label: label.trim(),
      category: settings.isPremium ? selectedCategory : undefined,
      note: settings.isPremium && note.trim() ? note.trim() : undefined,
    });

    navigation.navigate('Result', {
      type,
      price: priceValue,
      hours,
    });
  };

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

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
        <View style={styles.header}>
          <Text
            style={{
              fontSize: theme.typography.sizes.xl,
              fontWeight: 'bold',
              color: theme.colors.text,
              marginBottom: theme.spacing.sm,
            }}
          >
            {t('itemCheck.title')}
          </Text>
          <Text
            style={{
              fontSize: theme.typography.sizes.md,
              color: theme.colors.textSecondary,
            }}
          >
            {t('itemCheck.description')}
          </Text>
        </View>

        <Input
          label={t('itemCheck.itemLabel')}
          placeholder={t('itemCheck.itemLabelPlaceholder')}
          value={label}
          onChangeText={setLabel}
          error={labelError}
          containerStyle={{ marginTop: theme.spacing.xl }}
        />

        {settings.isPremium && (
          <View style={{ marginVertical: theme.spacing.md }}>
            <Text
              style={{
                fontSize: theme.typography.sizes.sm,
                fontWeight: '600',
                color: theme.colors.text,
                marginBottom: theme.spacing.sm,
              }}
            >
              {t('itemCheck.category')}
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              style={{ marginBottom: theme.spacing.sm }}
            >
              {CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  onPress={() => setSelectedCategory(category.id)}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    marginRight: 8,
                    borderRadius: theme.borderRadius.md,
                    backgroundColor:
                      selectedCategory === category.id
                        ? category.color
                        : theme.colors.surface,
                    borderWidth: 1,
                    borderColor:
                      selectedCategory === category.id
                        ? category.color
                        : theme.colors.border,
                  }}
                >
                  <Text style={{ fontSize: 20, marginBottom: 4 }}>
                    {category.icon}
                  </Text>
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: '600',
                      color:
                        selectedCategory === category.id
                          ? '#fff'
                          : theme.colors.text,
                    }}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <Input
          label={t('itemCheck.itemPrice')}
          placeholder={t('itemCheck.pricePlaceholder')}
          keyboardType="decimal-pad"
          value={price}
          onChangeText={setPrice}
          error={error}
          containerStyle={{ marginVertical: theme.spacing.md }}
        />

        {settings.isPremium && (
          <View style={{ marginBottom: theme.spacing.md }}>
            <Text
              style={{
                fontSize: theme.typography.sizes.sm,
                fontWeight: '600',
                color: theme.colors.text,
                marginBottom: theme.spacing.sm,
              }}
            >
              Notes (Optional)
            </Text>
            <Input
              placeholder="Add notes about this transaction..."
              value={note}
              onChangeText={setNote}
              multiline
              numberOfLines={3}
            />

          </View>
        )}

        {hours > 0 && (
          <Card variant="elevated" style={{ marginBottom: theme.spacing.xl }}>
            <Text
              style={{
                fontSize: theme.typography.sizes.sm,
                color: theme.colors.textSecondary,
                marginBottom: theme.spacing.sm,
              }}
            >
              {t('itemCheck.hoursRequired')}
            </Text>
            <Text
              style={{
                fontSize: theme.typography.sizes.xxl,
                fontWeight: 'bold',
                color: theme.colors.primary,
                marginBottom: theme.spacing.md,
              }}
            >
              {formatHours(hours, settings.workHoursPerDay)}
            </Text>

            <View
              style={{
                height: 8,
                backgroundColor: theme.colors.border,
                borderRadius: theme.borderRadius.round,
                overflow: 'hidden',
                marginTop: theme.spacing.md,
              }}
            >
              <Animated.View
                style={{
                  height: '100%',
                  width: progressWidth,
                  backgroundColor: theme.colors.primary,
                  borderRadius: theme.borderRadius.round,
                }}
              />
            </View>

            <Text
              style={{
                fontSize: theme.typography.sizes.xs,
                color: theme.colors.textSecondary,
                marginTop: theme.spacing.sm,
              }}
            >
              {t('itemCheck.atRate', { rate: formatCurrency(user.wage.hourlyRate, user.currency) })}
            </Text>
          </Card>
        )}

        <View style={styles.actions}>
          <Button
            title={t('itemCheck.iBoughtIt')}
            onPress={() => handleAction('purchased')}
            variant="outline"
            size="large"
            style={{ marginBottom: theme.spacing.md }}
            disabled={!label.trim() || !price || hours === 0}
          />
          <Button
            title={t('itemCheck.iDidntBuyIt')}
            onPress={() => handleAction('saved')}
            size="large"
            disabled={!label.trim() || !price || hours === 0}
          />
        </View>

        <Button
          title={t('common.cancel')}
          onPress={() => navigation.goBack()}
          variant="outline"
          size="medium"
          style={{ marginTop: theme.spacing.lg }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: 8,
  },
  actions: {
    marginTop: 'auto',
  },
});

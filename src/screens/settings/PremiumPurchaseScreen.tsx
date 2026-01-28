import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SettingsStackParamList } from '../../navigation/types';
import { useTheme } from '../../contexts/ThemeContext';
import { useSettingsStore } from '../../store/settingsStore';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { useTranslation } from 'react-i18next';

type PremiumPurchaseNavigationProp = StackNavigationProp<
  SettingsStackParamList,
  'PremiumPurchase'
>;

export const PremiumPurchaseScreen: React.FC = () => {
  const navigation = useNavigation<PremiumPurchaseNavigationProp>();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { unlockPremium, setTheme } = useSettingsStore();

  const [loading, setLoading] = useState(false);
  const [productPrice, setProductPrice] = useState('€1.00');
  const [restoring, setRestoring] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const products: string | any[] = [];
      if (products.length > 0) {
        const product = products[0];
        // Use price and currency instead of localizedPrice
        setProductPrice(product.price ? `${product.currency} ${product.price}` : 'Premium');
      }
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const handlePurchase = async () => {
    setLoading(true);
    try {
      const success = true;

      if (success) {
        // Unlock premium and switch to financial theme
        unlockPremium();
        setTheme('financial');

        Alert.alert(
          t('premium.purchaseSuccessTitle'),
          t('premium.purchaseSuccessMessage'),
          [
            {
              text: t('common.done'),
              onPress: () => navigation.goBack(),
            },
          ]
        );
      }
    } catch (error: any) {
      Alert.alert(
        t('premium.purchaseErrorTitle'),
        error.message || t('premium.purchaseErrorMessage')
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    setRestoring(true);
    try {
      const hasPremium = true;

      if (hasPremium) {
        unlockPremium();
        setTheme('financial');

        Alert.alert(
          t('premium.restoreSuccessTitle'),
          t('premium.restoreSuccessMessage'),
          [
            {
              text: t('common.done'),
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } else {
        Alert.alert(
          t('premium.restoreNotFoundTitle'),
          t('premium.restoreNotFoundMessage')
        );
      }
    } catch (error: any) {
      Alert.alert(
        t('premium.restoreErrorTitle'),
        error.message || t('premium.restoreErrorMessage')
      );
    } finally {
      setRestoring(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={{ padding: theme.spacing.xl }}>
        {/* Header */}
        <View style={{ alignItems: 'center', marginBottom: theme.spacing.xl }}>
          <View
            style={{
              width: 100,
              height: 100,
              borderRadius: theme.borderRadius.round,
              backgroundColor: '#C9A961',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: theme.spacing.md,
            }}
          >
            <Text style={{ fontSize: 50 }}>💎</Text>
          </View>
          <Text
            style={{
              fontSize: theme.typography.sizes.xxl,
              fontWeight: 'bold',
              color: theme.colors.text,
              marginBottom: theme.spacing.xs,
              textAlign: 'center',
            }}
          >
            {t('premium.title')}
          </Text>
          <Text
            style={{
              fontSize: theme.typography.sizes.md,
              color: theme.colors.textSecondary,
              textAlign: 'center',
            }}
          >
            {t('premium.subtitle')}
          </Text>
        </View>

        {/* Features */}
        <Card variant="elevated" style={{ marginBottom: theme.spacing.lg }}>
          <Text
            style={{
              fontSize: theme.typography.sizes.lg,
              fontWeight: 'bold',
              color: theme.colors.text,
              marginBottom: theme.spacing.md,
            }}
          >
            {t('premium.features')}
          </Text>

          {[
            { icon: '🌙', text: t('premium.feature1') },
            { icon: '💼', text: t('premium.feature2') },
            { icon: '✨', text: t('premium.feature3') },
            { icon: '🎨', text: t('premium.feature4') },
          ].map((feature, index) => (
            <View
              key={index}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: theme.spacing.md,
              }}
            >
              <Text style={{ fontSize: 24, marginRight: theme.spacing.sm }}>
                {feature.icon}
              </Text>
              <Text
                style={{
                  fontSize: theme.typography.sizes.md,
                  color: theme.colors.text,
                  flex: 1,
                }}
              >
                {feature.text}
              </Text>
            </View>
          ))}
        </Card>

        {/* Price */}
        <Card variant="elevated" style={{ marginBottom: theme.spacing.lg }}>
          <View style={{ alignItems: 'center' }}>
            <Text
              style={{
                fontSize: theme.typography.sizes.sm,
                color: theme.colors.textSecondary,
                marginBottom: theme.spacing.xs,
              }}
            >
              {t('premium.oneTimePayment')}
            </Text>
            <Text
              style={{
                fontSize: theme.typography.sizes.xxl,
                fontWeight: 'bold',
                color: '#C9A961',
                marginBottom: theme.spacing.xs,
              }}
            >
              {productPrice}
            </Text>
            <Text
              style={{
                fontSize: theme.typography.sizes.xs,
                color: theme.colors.textSecondary,
              }}
            >
              {t('premium.paymentMethods')}
            </Text>
          </View>
        </Card>

        {/* Purchase Button */}
        <Button
          title={loading ? t('common.loading') : t('premium.unlockNow')}
          onPress={handlePurchase}
          size="large"
          disabled={loading || restoring}
          style={{ marginBottom: theme.spacing.md }}
        />

        {loading && (
          <ActivityIndicator
            size="small"
            color={theme.colors.primary}
            style={{ marginBottom: theme.spacing.md }}
          />
        )}

        {/* Restore Button */}
        <Button
          title={restoring ? t('common.loading') : t('premium.restorePurchase')}
          onPress={handleRestore}
          variant="outline"
          size="medium"
          disabled={loading || restoring}
          style={{ marginBottom: theme.spacing.md }}
        />

        {/* Back Button */}
        <Button
          title={t('common.cancel')}
          onPress={() => navigation.goBack()}
          variant="outline"
          size="medium"
        />

        {/* Fine Print */}
        <Text
          style={{
            fontSize: theme.typography.sizes.xs,
            color: theme.colors.textSecondary,
            textAlign: 'center',
            marginTop: theme.spacing.lg,
          }}
        >
          {t('premium.finePrint')}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({});

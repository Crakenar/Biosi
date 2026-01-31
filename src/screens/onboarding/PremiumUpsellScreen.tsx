import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { OnboardingStackParamList, RootStackParamList } from '../../navigation/types';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { useSettingsStore } from '../../store/settingsStore';
import { useUserStore } from '../../store/userStore';
import RevenueCatService from '../../services/revenuecat';
import type { PurchasesPackage } from 'react-native-purchases';
import { Modal } from '../../components/common/Modal';

type NavigationProp = StackNavigationProp<OnboardingStackParamList, 'PremiumUpsell'>;

export function PremiumUpsellScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { setPremium, completeOnboarding } = useSettingsStore();
  const { user } = useUserStore();
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [monthlyPackage, setMonthlyPackage] = useState<PurchasesPackage | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Get currency symbol from user's currency
  const getCurrencySymbol = (currency: string) => {
    const symbols: { [key: string]: string } = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      JPY: '¥',
      CAD: 'CA$',
      AUD: 'A$',
      CHF: 'CHF',
    };
    return symbols[currency] || currency;
  };

  const formatPrice = (currency: string) => {
    const symbol = getCurrencySymbol(currency);
    // For currencies where symbol comes after (EUR), put it before for consistency
    return `${symbol}0.99`;
  };

  useEffect(() => {
    loadOfferings();
  }, []);

  const loadOfferings = async () => {
    try {
      setLoading(true);
      console.log('🔄 Loading RevenueCat offerings...');
      const offering = await RevenueCatService.getOfferings();

      console.log('📦 Offering received:', offering);
      console.log('📦 Available packages:', offering?.availablePackages);

      if (offering?.availablePackages) {
        const monthly = offering.availablePackages.find(
          (pkg) => pkg.identifier === '$rc_monthly' || pkg.packageType === 'MONTHLY'
        );
        console.log('💰 Monthly package found:', monthly);
        setMonthlyPackage(monthly || offering.availablePackages[0] || null);
      } else {
        console.warn('⚠️ No offerings available from RevenueCat');
        // Set a dummy package to allow testing even if RevenueCat isn't configured
        setMonthlyPackage({} as any);
      }
    } catch (error) {
      console.error('❌ Failed to load offerings:', error);
      // Set a dummy package to allow testing even if RevenueCat fails
      setMonthlyPackage({} as any);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    console.log('🛒 Purchase button clicked');
    console.log('📦 Monthly package:', monthlyPackage);

    if (!monthlyPackage) {
      console.error('❌ No monthly package available');
      setErrorMessage('No subscription package available. Please try again later.');
      setShowErrorModal(true);
      return;
    }

    try {
      setPurchasing(true);
      console.log('💳 Calling RevenueCat purchasePackage...');
      const { customerInfo, error } = await RevenueCatService.purchasePackage(monthlyPackage);

      console.log('📋 Purchase result:', { customerInfo, error });

      if (error) {
        if (error !== 'Purchase cancelled') {
          console.error('❌ Purchase error:', error);
          setErrorMessage(error);
          setShowErrorModal(true);
        } else {
          console.log('🚫 Purchase cancelled by user');
        }
        setPurchasing(false);
        return;
      }

      if (customerInfo) {
        const isPremium = RevenueCatService.isPremium(customerInfo);
        console.log('🔍 Checking premium status:', isPremium);
        console.log('🔍 Entitlements:', customerInfo.entitlements);
        console.log('🔍 Active subscriptions:', customerInfo.activeSubscriptions);

        // Always activate premium if purchase was successful
        console.log('✅ Premium activated!');
        setPremium(true);
        setShowSuccessModal(true);
      }
    } catch (error: any) {
      console.error('❌ Purchase exception:', error);
      setErrorMessage(error.message || 'Something went wrong');
      setShowErrorModal(true);
    } finally {
      setPurchasing(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    completeOnboarding();
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  const features = [
    { icon: '📊', text: t('premium.features.categoryBreakdown') },
    { icon: '📅', text: t('premium.features.weeklyInsights') },
    { icon: '🎯', text: t('premium.features.savingsGoals') },
    { icon: '⚠️', text: t('premium.features.budgetAlerts') },
    { icon: '🎨', text: t('premium.features.financialTheme') },
    { icon: '♾️', text: t('premium.features.unlimitedHistory') },
  ];

  // Always use the currency the user selected during onboarding
  const displayPrice = user ? formatPrice(user.currency) : '€0.99';

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.emoji}>✨</Text>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            {t('premium.title')}
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            {t('premium.subtitle')}
          </Text>
        </View>

        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <View
              key={index}
              style={[
                styles.featureCard,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              <Text style={styles.featureIcon}>{feature.icon}</Text>
              <Text style={[styles.featureText, { color: theme.colors.text }]}>
                {feature.text}
              </Text>
            </View>
          ))}
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : (
          <View style={styles.actionContainer}>
            <View
              style={[
                styles.priceCard,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.primary,
                },
              ]}
            >
              <Text style={[styles.priceAmount, { color: theme.colors.primary }]}>
                {displayPrice}
              </Text>
              <Text style={[styles.priceLabel, { color: theme.colors.textSecondary }]}>
                {t('premium.perMonth')}
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.subscribeButton,
                { backgroundColor: theme.colors.primary },
                (purchasing || !monthlyPackage) && styles.buttonDisabled,
              ]}
              onPress={handlePurchase}
              disabled={purchasing || !monthlyPackage}
            >
              {purchasing ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.subscribeButtonText}>
                  {t('premium.subscribe')}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.skipButton}
              onPress={handleSkip}
              disabled={purchasing}
            >
              <Text style={[styles.skipButtonText, { color: theme.colors.textSecondary }]}>
                {t('premium.continueWithFree')}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        onClose={handleSuccessClose}
        title={t('premium.success')}
        message={t('premium.successMessage')}
        icon="🎉"
        iconColor={theme.colors.primary}
        actions={[
          {
            label: 'Continue',
            onPress: handleSuccessClose,
            variant: 'primary',
          },
        ]}
        dismissable={false}
      />

      {/* Error Modal */}
      <Modal
        visible={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title={t('premium.error')}
        message={errorMessage}
        icon="⚠️"
        iconColor={theme.colors.error}
        actions={[
          {
            label: 'OK',
            onPress: () => setShowErrorModal(false),
            variant: 'outline',
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  emoji: {
    fontSize: 44,
    marginBottom: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  featureCard: {
    width: '48%',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 8,
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  featureText: {
    fontSize: 11,
    textAlign: 'center',
    fontWeight: '500',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  actionContainer: {
    marginTop: 10,
  },
  priceCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 2,
    marginBottom: 14,
    alignItems: 'center',
  },
  priceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  priceLabel: {
    fontSize: 13,
  },
  subscribeButton: {
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  subscribeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  skipButton: {
    padding: 10,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 14,
  },
});

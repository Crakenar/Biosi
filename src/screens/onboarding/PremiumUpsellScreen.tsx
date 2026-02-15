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
import Analytics from '../../services/analytics';

type NavigationProp = StackNavigationProp<OnboardingStackParamList, 'PremiumUpsell'>;
type PlanType = 'monthly' | 'lifetime';

export function PremiumUpsellScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { setPremium, completeOnboarding } = useSettingsStore();
  const { user } = useUserStore();
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('lifetime');
  const [monthlyPackage, setMonthlyPackage] = useState<PurchasesPackage | null>(null);
  const [lifetimePackage, setLifetimePackage] = useState<PurchasesPackage | null>(null);
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

  useEffect(() => {
    loadOfferings();
  }, []);

  const loadOfferings = async () => {
    try {
      setLoading(true);
      const offering = await RevenueCatService.getOfferings();

      if (offering?.availablePackages) {
        const monthly = offering.availablePackages.find(
          (pkg) => pkg.identifier === '$rc_monthly' || pkg.packageType === 'MONTHLY'
        );
        const lifetime = offering.availablePackages.find(
          (pkg) => pkg.identifier === '$rc_lifetime' || pkg.packageType === 'LIFETIME'
        );

        setMonthlyPackage(monthly || offering.availablePackages[0] || null);
        setLifetimePackage(lifetime || offering.availablePackages[1] || null);
      } else {
        // Set dummy packages for testing
        setMonthlyPackage({} as any);
        setLifetimePackage({} as any);
      }
    } catch (error) {
      setMonthlyPackage({} as any);
      setLifetimePackage({} as any);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    const packageToPurchase = selectedPlan === 'monthly' ? monthlyPackage : lifetimePackage;

    if (!packageToPurchase) {
      setErrorMessage(t('premium.noPackageAvailable'));
      setShowErrorModal(true);
      return;
    }

    try {
      setPurchasing(true);
      const { customerInfo, error } = await RevenueCatService.purchasePackage(packageToPurchase);

      if (error) {
        if (error !== 'Purchase cancelled') {
          setErrorMessage(error);
          setShowErrorModal(true);
        }
        setPurchasing(false);
        return;
      }

      if (customerInfo) {
        setPremium(true);
        Analytics.trackPremiumPurchase(
          packageToPurchase?.identifier || selectedPlan,
          selectedPlan === 'monthly' ? 0.99 : 4.99
        );
        setShowSuccessModal(true);
      }
    } catch (error: any) {
      setErrorMessage(error.message || t('premium.somethingWentWrong'));
      setShowErrorModal(true);
    } finally {
      setPurchasing(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    completeOnboarding();
    Analytics.trackEvent('onboarding_completed', { premium: true });
  };

  const handleSkip = () => {
    completeOnboarding();
    Analytics.trackEvent('onboarding_completed', { premium: false });
  };

  const features = [
    { icon: '📊', text: t('premium.features.categoryBreakdown') },
    { icon: '📅', text: t('premium.features.weeklyInsights') },
    { icon: '🎯', text: t('premium.features.savingsGoals') },
    { icon: '⚠️', text: t('premium.features.budgetAlerts') },
    { icon: '🎨', text: t('premium.features.financialTheme') },
    { icon: '♾️', text: t('premium.features.unlimitedHistory') },
  ];

  const currencySymbol = user ? getCurrencySymbol(user.currency) : '€';

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
            {t('premium.chooseYourPlan')}
          </Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : (
          <>
            {/* Plan Selection */}
            <View style={styles.plansContainer}>
              {/* Lifetime Plan - Recommended */}
              <TouchableOpacity
                style={[
                  styles.planCard,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: selectedPlan === 'lifetime' ? theme.colors.primary : theme.colors.border,
                    borderWidth: selectedPlan === 'lifetime' ? 2 : 1,
                  },
                ]}
                onPress={() => setSelectedPlan('lifetime')}
              >
                <View style={[styles.recommendedBadge, { backgroundColor: theme.colors.primary }]}>
                  <Text style={styles.recommendedText}>⭐ {t('premium.recommended')}</Text>
                </View>
                <View style={styles.planHeader}>
                  <Text style={[styles.planTitle, { color: theme.colors.text }]}>
                    {t('premium.lifetime.title')}
                  </Text>
                  <View style={styles.radioButton}>
                    {selectedPlan === 'lifetime' && (
                      <View style={[styles.radioButtonInner, { backgroundColor: theme.colors.primary }]} />
                    )}
                  </View>
                </View>
                <Text style={[styles.planPrice, { color: theme.colors.primary }]}>
                  {currencySymbol}4.99
                </Text>
                <Text style={[styles.planDescription, { color: theme.colors.textSecondary }]}>
                  {t('premium.lifetime.description')}
                </Text>
                <View style={[styles.savingsBadge, { backgroundColor: '#4ECDC4' }]}>
                  <Text style={styles.savingsText}>💰 {t('premium.lifetime.savings')}</Text>
                </View>
              </TouchableOpacity>

              {/* Monthly Plan */}
              <TouchableOpacity
                style={[
                  styles.planCard,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: selectedPlan === 'monthly' ? theme.colors.primary : theme.colors.border,
                    borderWidth: selectedPlan === 'monthly' ? 2 : 1,
                  },
                ]}
                onPress={() => setSelectedPlan('monthly')}
              >
                <View style={styles.planHeader}>
                  <Text style={[styles.planTitle, { color: theme.colors.text }]}>
                    {t('premium.monthly.title')}
                  </Text>
                  <View style={styles.radioButton}>
                    {selectedPlan === 'monthly' && (
                      <View style={[styles.radioButtonInner, { backgroundColor: theme.colors.primary }]} />
                    )}
                  </View>
                </View>
                <Text style={[styles.planPrice, { color: theme.colors.text }]}>
                  {currencySymbol}0.99
                </Text>
                <Text style={[styles.planDescription, { color: theme.colors.textSecondary }]}>
                  {t('premium.monthly.description')}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Features Grid */}
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
                  <Text
                    style={[styles.featureText, { color: theme.colors.text }]}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {feature.text}
                  </Text>
                </View>
              ))}
            </View>

            {/* Purchase Button */}
            <TouchableOpacity
              style={[
                styles.purchaseButton,
                { backgroundColor: theme.colors.primary },
                purchasing && styles.buttonDisabled,
              ]}
              onPress={handlePurchase}
              disabled={purchasing}
            >
              {purchasing ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.purchaseButtonText}>
                  {selectedPlan === 'lifetime'
                    ? t('premium.lifetime.button')
                    : t('premium.monthly.button')}
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
          </>
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
            label: t('common.done'),
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
            label: t('common.ok'),
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
    marginBottom: 24,
  },
  emoji: {
    fontSize: 44,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  plansContainer: {
    marginBottom: 20,
  },
  planCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    position: 'relative',
  },
  recommendedBadge: {
    position: 'absolute',
    top: -8,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  recommendedText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  planPrice: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  planDescription: {
    fontSize: 13,
    marginBottom: 8,
  },
  savingsBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  savingsText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
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
    minHeight: 80,
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
  purchaseButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  purchaseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  skipButton: {
    padding: 12,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 14,
  },
});

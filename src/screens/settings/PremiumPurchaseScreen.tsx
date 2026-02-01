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
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { useSettingsStore } from '../../store/settingsStore';
import { useUserStore } from '../../store/userStore';
import RevenueCatService from '../../services/revenuecat';
import type { PurchasesPackage } from 'react-native-purchases';
import { Modal } from '../../components/common/Modal';

export function PremiumPurchaseScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { settings, setPremium } = useSettingsStore();
  const { user } = useUserStore();
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [monthlyPackage, setMonthlyPackage] = useState<PurchasesPackage | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successTitle, setSuccessTitle] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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
    return `${symbol}0.99`;
  };

  useEffect(() => {
    loadOfferings();
  }, []);

  const loadOfferings = async () => {
    try {
      setLoading(true);
      const offering = await RevenueCatService.getOfferings();

      if (offering?.availablePackages) {
        // Find monthly package
        const monthly = offering.availablePackages.find(
          (pkg) => pkg.identifier === '$rc_monthly' || pkg.packageType === 'MONTHLY'
        );
        setMonthlyPackage(monthly || offering.availablePackages[0] || null);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!monthlyPackage) {
      setErrorMessage('No subscription package available. Please try again later.');
      setShowErrorModal(true);
      return;
    }

    try {
      setPurchasing(true);
      const { customerInfo, error } = await RevenueCatService.purchasePackage(monthlyPackage);

      if (error) {
        if (error !== 'Purchase cancelled') {
          setErrorMessage(error);
          setShowErrorModal(true);
        }
        return;
      }

      if (customerInfo && RevenueCatService.isPremium(customerInfo)) {
        setPremium(true);
        setSuccessTitle(t('premium.success'));
        setSuccessMessage(t('premium.successMessage'));
        setShowSuccessModal(true);
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'Something went wrong');
      setShowErrorModal(true);
    } finally {
      setPurchasing(false);
    }
  };

  const handleRestore = async () => {
    try {
      setRestoring(true);
      const { customerInfo, error } = await RevenueCatService.restorePurchases();

      if (error) {
        setErrorMessage(error);
        setShowErrorModal(true);
        return;
      }

      if (customerInfo && RevenueCatService.isPremium(customerInfo)) {
        setPremium(true);
        setSuccessTitle(t('premium.restored'));
        setSuccessMessage(t('premium.restoredMessage'));
        setShowRestoreModal(true);
      } else {
        setErrorMessage('No active subscriptions found to restore.');
        setShowErrorModal(true);
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to restore purchases');
      setShowErrorModal(true);
    } finally {
      setRestoring(false);
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    setShowRestoreModal(false);
    navigation.goBack();
  };

  const renderFeaturesList = () => {
    const features = [
      { icon: '🎨', title: t('premium.features.financialTheme'), description: t('premium.features.financialThemeDesc') },
      { icon: '📊', title: t('premium.features.categoryBreakdown'), description: t('premium.features.categoryBreakdownDesc') },
      { icon: '📅', title: t('premium.features.weeklyInsights'), description: t('premium.features.weeklyInsightsDesc') },
      { icon: '📈', title: t('premium.features.customDateRange'), description: t('premium.features.customDateRangeDesc') },
      { icon: '🔄', title: t('premium.features.yearOverYear'), description: t('premium.features.yearOverYearDesc') },
      { icon: '💹', title: t('premium.features.customInterest'), description: t('premium.features.customInterestDesc') },
      { icon: '🎯', title: t('premium.features.savingsGoals'), description: t('premium.features.savingsGoalsDesc') },
      { icon: '⚠️', title: t('premium.features.budgetAlerts'), description: t('premium.features.budgetAlertsDesc') },
      { icon: '🏷️', title: t('premium.features.categoriesAndTags'), description: t('premium.features.categoriesAndTagsDesc') },
      { icon: '📝', title: t('premium.features.notesAndPhotos'), description: t('premium.features.notesAndPhotosDesc') },
      { icon: '📤', title: t('premium.features.exportData'), description: t('premium.features.exportDataDesc') },
      { icon: '♾️', title: t('premium.features.unlimitedHistory'), description: t('premium.features.unlimitedHistoryDesc') },
    ];

    return features.map((feature, index) => (
      <View
        key={index}
        style={[
          styles.featureItem,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <Text style={styles.featureIcon}>{feature.icon}</Text>
        <View style={styles.featureText}>
          <Text style={[styles.featureTitle, { color: theme.colors.text }]}>
            {feature.title}
          </Text>
          <Text style={[styles.featureDescription, { color: theme.colors.textSecondary }]}>
            {feature.description}
          </Text>
        </View>
      </View>
    ));
  };

  if (settings.isPremium) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              ✨ {t('premium.alreadyPremium')}
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              {t('premium.thankYou')}
            </Text>
          </View>

          <View style={styles.featuresContainer}>
            {renderFeaturesList()}
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.emoji}>✨</Text>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            {t('premium.title')}
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            {t('premium.subtitle')}
          </Text>
        </View>

        <View style={styles.featuresContainer}>
          {renderFeaturesList()}
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : (
          <View style={styles.purchaseContainer}>
            <>
              <View
                style={[
                  styles.priceCard,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.primary,
                  },
                ]}
              >
                <Text style={[styles.priceLabel, { color: theme.colors.textSecondary }]}>
                  {t('premium.title')}
                </Text>
                <Text style={[styles.priceAmount, { color: theme.colors.primary }]}>
                  {user ? formatPrice(user.currency) : '€0.99'}
                </Text>
                <Text style={[styles.priceDescription, { color: theme.colors.textSecondary }]}>
                  {t('premium.perMonth')}
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.purchaseButton,
                  { backgroundColor: theme.colors.primary },
                  (purchasing || !monthlyPackage) && styles.purchaseButtonDisabled,
                ]}
                onPress={handlePurchase}
                disabled={purchasing || !monthlyPackage}
              >
                {purchasing ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.purchaseButtonText}>
                    {t('premium.subscribe')}
                  </Text>
                )}
              </TouchableOpacity>
            </>

            <TouchableOpacity
              style={styles.restoreButton}
              onPress={handleRestore}
              disabled={restoring}
            >
              {restoring ? (
                <ActivityIndicator color={theme.colors.primary} />
              ) : (
                <Text style={[styles.restoreButtonText, { color: theme.colors.primary }]}>
                  {t('premium.restore')}
                </Text>
              )}
            </TouchableOpacity>

            <Text style={[styles.disclaimer, { color: theme.colors.textSecondary }]}>
              {t('premium.disclaimer')}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal || showRestoreModal}
        onClose={handleModalClose}
        title={successTitle}
        message={successMessage}
        icon="🎉"
        iconColor={theme.colors.primary}
        actions={[
          {
            label: 'OK',
            onPress: handleModalClose,
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
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  emoji: {
    fontSize: 60,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  featuresContainer: {
    marginBottom: 30,
  },
  featureItem: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  purchaseContainer: {
    marginTop: 10,
  },
  priceCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    marginBottom: 20,
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  priceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  priceDescription: {
    fontSize: 14,
    textAlign: 'center',
  },
  purchaseButton: {
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
  },
  purchaseButtonDisabled: {
    opacity: 0.6,
  },
  purchaseButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  restoreButton: {
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  restoreButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  disclaimer: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
});

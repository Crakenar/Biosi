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

type PlanType = 'monthly' | 'lifetime';

export function PremiumPurchaseScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { settings, setPremium } = useSettingsStore();
  const { user } = useUserStore();
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('lifetime');
  const [monthlyPackage, setMonthlyPackage] = useState<PurchasesPackage | null>(null);
  const [lifetimePackage, setLifetimePackage] = useState<PurchasesPackage | null>(null);
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

        setMonthlyPackage(monthly || null);
        setLifetimePackage(lifetime || null);
      }
    } catch (error) {
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
        return;
      }

      if (customerInfo && RevenueCatService.isPremium(customerInfo)) {
        setPremium(true);
        setSuccessTitle(t('premium.success'));
        setSuccessMessage(t('premium.successMessage'));
        setShowSuccessModal(true);
      }
    } catch (error: any) {
      setErrorMessage(error.message || t('premium.somethingWentWrong'));
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
        setErrorMessage(t('premium.noRestorableFound'));
        setShowErrorModal(true);
      }
    } catch (error: any) {
      setErrorMessage(error.message || t('premium.failedToRestore'));
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
          <Text
            style={[styles.featureDescription, { color: theme.colors.textSecondary }]}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {feature.description}
          </Text>
        </View>
      </View>
    ));
  };

  const currencySymbol = user ? getCurrencySymbol(user.currency) : '€';

  if (settings.isPremium) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.emoji}>✨</Text>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              {t('premium.alreadyPremium')}
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
              {/* Lifetime Plan - Best Value */}
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
                <View style={[styles.bestValueBadge, { backgroundColor: theme.colors.primary }]}>
                  <Text style={styles.bestValueText}>⭐ {t('premium.bestValue')}</Text>
                </View>
                <View style={styles.planHeader}>
                  <Text style={[styles.planTitle, { color: theme.colors.text }]}>
                    {t('premium.lifetime.title')}
                  </Text>
                  <View style={[
                    styles.radioButton,
                    { borderColor: selectedPlan === 'lifetime' ? theme.colors.primary : '#ccc' }
                  ]}>
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
                  <View style={[
                    styles.radioButton,
                    { borderColor: selectedPlan === 'monthly' ? theme.colors.primary : '#ccc' }
                  ]}>
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

            {/* Features List */}
            <View style={styles.featuresContainer}>
              {renderFeaturesList()}
            </View>

            {/* Purchase Button */}
            <TouchableOpacity
              style={[
                styles.purchaseButton,
                { backgroundColor: theme.colors.primary },
                purchasing && styles.purchaseButtonDisabled,
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

            {/* Restore Button */}
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
          </>
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
            label: t('common.ok'),
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
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  emoji: {
    fontSize: 50,
    marginBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
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
  bestValueBadge: {
    position: 'absolute',
    top: -8,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  bestValueText: {
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
  featuresContainer: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
  },
  featureIcon: {
    fontSize: 22,
    marginRight: 12,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 3,
  },
  featureDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  purchaseButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  purchaseButtonDisabled: {
    opacity: 0.6,
  },
  purchaseButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  restoreButton: {
    padding: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  restoreButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  disclaimer: {
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
  },
});

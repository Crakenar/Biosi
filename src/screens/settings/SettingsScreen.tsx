import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SettingsStackParamList } from '../../navigation/types';
import { useTheme } from '../../contexts/ThemeContext';
import { useUserStore } from '../../store/userStore';
import { useSettingsStore } from '../../store/settingsStore';
import { Card } from '../../components/common/Card';
import { formatCurrency } from '../../utils/formatters';
import { useTranslation } from 'react-i18next';
import { DevTools } from '../../services/devTools';

type SettingsNavigationProp = StackNavigationProp<SettingsStackParamList, 'SettingsMain'>;

export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<SettingsNavigationProp>();
  const { theme } = useTheme();
  const { user } = useUserStore();
  const { settings } = useSettingsStore();
  const { t } = useTranslation();

  if (!user) {
    return null;
  }

  const languageDisplayName = settings.language === 'en' ? 'English' : 'Français';

  const SettingItem = ({
    label,
    value,
    onPress,
    icon,
  }: {
    label: string;
    value: string;
    onPress?: () => void;
    icon?: string;
  }) => (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
      }}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
        {icon && <Text style={{ fontSize: 20, marginRight: theme.spacing.sm }}>{icon}</Text>}
        <Text
          style={{
            fontSize: theme.typography.sizes.md,
            color: theme.colors.text,
            flex: 1,
          }}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {label}
        </Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text
          style={{
            fontSize: theme.typography.sizes.md,
            color: theme.colors.textSecondary,
            marginRight: theme.spacing.sm,
          }}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {value}
        </Text>
        {onPress && <Text style={{ color: theme.colors.textSecondary }}>›</Text>}
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background, }}>
        <View style={{ padding: theme.spacing.xl, paddingTop: theme.spacing.xxl * 1.5 }}>
        {/* Header */}
        <Text
          style={{
            fontSize: theme.typography.sizes.xxl,
            fontWeight: 'bold',
            color: theme.colors.text,
            marginBottom: theme.spacing.xl,
          }}
        >
          {t('settings.title')}
        </Text>

        {/* Premium Section */}
        {!settings.isPremium && (
          <>
            <TouchableOpacity
              style={{
                backgroundColor: theme.colors.primary,
                borderRadius: theme.borderRadius.lg,
                padding: theme.spacing.lg,
                marginBottom: theme.spacing.xl,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
              onPress={() => navigation.navigate('PremiumPurchase')}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: theme.typography.sizes.lg,
                    fontWeight: 'bold',
                    color: '#fff',
                    marginBottom: 4,
                  }}
                >
                  ✨ {t('premium.title')}
                </Text>
                <Text
                  style={{
                    fontSize: theme.typography.sizes.sm,
                    color: '#fff',
                    opacity: 0.9,
                  }}
                >
                  {t('premium.subtitle')}
                </Text>
              </View>
              <Text style={{ fontSize: 24, color: '#fff' }}>›</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Premium Features Section - Only show if premium */}
        {settings.isPremium && (
          <>
            <Text
              style={{
                fontSize: theme.typography.sizes.sm,
                fontWeight: '600',
                color: theme.colors.textSecondary,
                marginBottom: theme.spacing.md,
              }}
            >
              {t('settings.premiumFeatures')}
            </Text>
            <Card variant="elevated" style={{ marginBottom: theme.spacing.xl }}>
              <View style={{ paddingVertical: theme.spacing.sm }}>
                <SettingItem
                  label={t('settings.premiumItems.analytics')}
                  value={t('settings.premiumItems.analyticsDesc')}
                  onPress={() => navigation.navigate('PremiumAnalytics')}
                />
                <SettingItem
                  label={t('settings.premiumItems.budgets')}
                  value={t('settings.premiumItems.budgetsDesc')}
                  onPress={() => navigation.navigate('Budget')}
                />
                <SettingItem
                  label={t('settings.premiumItems.goals')}
                  value={t('settings.premiumItems.goalsDesc')}
                  onPress={() => navigation.navigate('Goals')}
                />
                <SettingItem
                  label={t('settings.premiumItems.export')}
                  value={t('settings.premiumItems.exportDesc')}
                  onPress={() => navigation.navigate('Export')}
                />
              </View>
            </Card>
          </>
        )}

        {/* Profile Section */}
        <Text
          style={{
            fontSize: theme.typography.sizes.sm,
            fontWeight: '600',
            color: theme.colors.textSecondary,
            marginBottom: theme.spacing.md,
          }}
        >
          {t('settings.profile')}
        </Text>
        <Card variant="elevated" style={{ marginBottom: theme.spacing.xl }}>
          <View style={{ paddingVertical: theme.spacing.sm }}>
            <SettingItem
              label={t('settings.name')}
              value={user.name}
              icon="👤"
              onPress={() => navigation.navigate('ProfileEdit')}
            />
            <SettingItem
              label={t('settings.age')}
              value={user.age.toString()}
              icon="🎂"
              onPress={() => navigation.navigate('ProfileEdit')}
            />
            <SettingItem
              label={t('settings.hourlyWage')}
              value={formatCurrency(user.wage.hourlyRate, user.currency)}
              icon="💰"
              onPress={() => navigation.navigate('ProfileEdit')}
            />
          </View>
        </Card>

        {/* Appearance Section */}
        <Text
          style={{
            fontSize: theme.typography.sizes.sm,
            fontWeight: '600',
            color: theme.colors.textSecondary,
            marginBottom: theme.spacing.md,
          }}
        >
          {t('settings.appearance')}
        </Text>
        <Card variant="elevated" style={{ marginBottom: theme.spacing.xl }}>
          <View style={{ paddingVertical: theme.spacing.sm }}>
            <SettingItem
              label={t('settings.theme')}
              value={settings.theme === 'cute' ? t('settings.cute') : t('settings.professional')}
              icon="🎨"
              onPress={() => navigation.navigate('ThemeSelection')}
            />
            <SettingItem
              label={t('settings.currency')}
              value={user.currency}
              icon="💱"
              onPress={() => navigation.navigate('CurrencySettings')}
            />
            <SettingItem
              label={t('settings.language')}
              value={languageDisplayName}
              icon="🌐"
              onPress={() => navigation.navigate('LanguageSettings')}
            />
          </View>
        </Card>

        {/* Display Section */}
        <Text
          style={{
            fontSize: theme.typography.sizes.sm,
            fontWeight: '600',
            color: theme.colors.textSecondary,
            marginBottom: theme.spacing.md,
          }}
        >
          {t('settings.display')}
        </Text>
        <Card variant="elevated" style={{ marginBottom: theme.spacing.xl }}>
          <View style={{ paddingVertical: theme.spacing.sm }}>
            <SettingItem
              label={t('settings.displayMode')}
              value={settings.displayMode === 'currency' ? t('settings.displayInCurrency') : t('settings.displayInHours')}
              icon="💵"
              onPress={() => {
                const { setDisplayMode } = useSettingsStore.getState();
                setDisplayMode(settings.displayMode === 'currency' ? 'hours' : 'currency');
              }}
            />
            <SettingItem
              label="Work Hours Per Day"
              value={`${settings.workHoursPerDay} hours`}
              icon="⏰"
              onPress={() => navigation.navigate('WorkHoursSettings')}
            />
          </View>
        </Card>

        {/* About Section */}
        <Text
          style={{
            fontSize: theme.typography.sizes.sm,
            fontWeight: '600',
            color: theme.colors.textSecondary,
            marginBottom: theme.spacing.md,
          }}
        >
          {t('settings.about')}
        </Text>
        <Card variant="elevated">
          <View style={{ paddingVertical: theme.spacing.sm }}>
            <SettingItem label={t('settings.version')} value="1.0.0" icon="ℹ️" />
            <SettingItem
              label={t('settings.compoundInterestRate')}
              value={`${(settings.compoundInterestRate * 100).toFixed(1)}%`}
              icon="📈"
              onPress={settings.isPremium ? () => navigation.navigate('CompoundInterestSettings') : undefined}
            />
          </View>
        </Card>

        {/* Developer Settings (only in dev mode) */}
        {DevTools.isDevMode() && (
          <>
            <Text
              style={{
                fontSize: theme.typography.sizes.sm,
                fontWeight: '600',
                color: theme.colors.textSecondary,
                marginBottom: theme.spacing.md,
                marginTop: theme.spacing.xl,
              }}
            >
              DEVELOPER
            </Text>
            <Card variant="elevated">
              <View style={{ paddingVertical: theme.spacing.sm }}>
                <SettingItem
                  label="Dev Settings"
                  value={DevTools.shouldForcePremium() ? 'Premium Forced' : 'Enabled'}
                  icon="🛠️"
                  onPress={() => navigation.navigate('DevSettings')}
                />
              </View>
            </Card>
          </>
        )}

        <View style={{ height: theme.spacing.xxl }} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({});

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
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {icon && <Text style={{ fontSize: 20, marginRight: theme.spacing.sm }}>{icon}</Text>}
        <Text
          style={{
            fontSize: theme.typography.sizes.md,
            color: theme.colors.text,
          }}
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
        >
          {value}
        </Text>
        {onPress && <Text style={{ color: theme.colors.textSecondary }}>›</Text>}
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={{ padding: theme.spacing.xl }}>
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
              value="7%"
              icon="📈"
            />
          </View>
        </Card>

        <View style={{ height: theme.spacing.xxl }} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({});

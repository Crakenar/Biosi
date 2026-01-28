import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SettingsStackParamList } from '../../navigation/types';
import { useTheme } from '../../contexts/ThemeContext';
import { useSettingsStore } from '../../store/settingsStore';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { cuteTheme, professionalTheme, financialTheme } from '../../constants/themes';
import { useTranslation } from 'react-i18next';

type ThemeSelectionNavigationProp = StackNavigationProp<
  SettingsStackParamList,
  'ThemeSelection'
>;

export const ThemeSelectionScreen: React.FC = () => {
  const navigation = useNavigation<ThemeSelectionNavigationProp>();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { settings, updateSettings } = useSettingsStore();

  const handleSelectTheme = (themeType: 'cute' | 'professional' | 'financial') => {
    // If financial theme and not premium, navigate to purchase screen
    if (themeType === 'financial' && !settings.isPremium) {
      navigation.navigate('PremiumPurchase');
      return;
    }

    updateSettings({ theme: themeType });
  };

  const ThemePreview = ({
    themeType,
    themeName,
    description,
    isPremium = false,
  }: {
    themeType: 'cute' | 'professional' | 'financial';
    themeName: string;
    description: string;
    isPremium?: boolean;
  }) => {
    const previewTheme =
      themeType === 'cute' ? cuteTheme :
      themeType === 'professional' ? professionalTheme :
      financialTheme;
    const isSelected = settings.theme === themeType;
    const isLocked = isPremium && !settings.isPremium;

    return (
      <TouchableOpacity
        style={{
          marginBottom: theme.spacing.lg,
        }}
        onPress={() => handleSelectTheme(themeType)}
      >
        <Card
          variant="elevated"
          style={{
            borderWidth: 2,
            borderColor: isSelected ? theme.colors.primary : 'transparent',
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.md }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <Text
                style={{
                  fontSize: theme.typography.sizes.lg,
                  fontWeight: 'bold',
                  color: theme.colors.text,
                }}
              >
                {themeName}
              </Text>
              {isPremium && (
                <View
                  style={{
                    backgroundColor: '#C9A961',
                    paddingHorizontal: theme.spacing.sm,
                    paddingVertical: 2,
                    borderRadius: theme.borderRadius.sm,
                    marginLeft: theme.spacing.sm,
                  }}
                >
                  <Text style={{ color: '#FFFFFF', fontSize: theme.typography.sizes.xs, fontWeight: '600' }}>
                    💎 {isLocked ? t('premium.premium') : t('premium.unlocked')}
                  </Text>
                </View>
              )}
            </View>
            {isSelected && (
              <View
                style={{
                  backgroundColor: theme.colors.primary,
                  paddingHorizontal: theme.spacing.md,
                  paddingVertical: theme.spacing.xs,
                  borderRadius: theme.borderRadius.round,
                }}
              >
                <Text style={{ color: '#FFFFFF', fontSize: theme.typography.sizes.xs, fontWeight: '600' }}>
                  {t('settings.themeSelection.active')}
                </Text>
              </View>
            )}
          </View>

          <Text
            style={{
              fontSize: theme.typography.sizes.sm,
              color: theme.colors.textSecondary,
              marginBottom: theme.spacing.md,
            }}
          >
            {description}
          </Text>

          {/* Color Palette Preview */}
          <View style={{ flexDirection: 'row', marginBottom: theme.spacing.md }}>
            <View
              style={{
                width: 40,
                height: 40,
                backgroundColor: previewTheme.colors.primary,
                borderRadius: previewTheme.borderRadius.md,
                marginRight: theme.spacing.xs,
              }}
            />
            <View
              style={{
                width: 40,
                height: 40,
                backgroundColor: previewTheme.colors.secondary,
                borderRadius: previewTheme.borderRadius.md,
                marginRight: theme.spacing.xs,
              }}
            />
            <View
              style={{
                width: 40,
                height: 40,
                backgroundColor: previewTheme.colors.success,
                borderRadius: previewTheme.borderRadius.md,
                marginRight: theme.spacing.xs,
              }}
            />
            <View
              style={{
                width: 40,
                height: 40,
                backgroundColor: previewTheme.colors.error,
                borderRadius: previewTheme.borderRadius.md,
                marginRight: theme.spacing.xs,
              }}
            />
            <View
              style={{
                width: 40,
                height: 40,
                backgroundColor: previewTheme.colors.accent,
                borderRadius: previewTheme.borderRadius.md,
              }}
            />
          </View>

          {/* Sample Card Preview */}
          <View
            style={{
              backgroundColor: previewTheme.colors.surface,
              padding: theme.spacing.md,
              borderRadius: previewTheme.borderRadius.md,
            }}
          >
            <Text
              style={{
                fontSize: theme.typography.sizes.sm,
                color: previewTheme.colors.textSecondary,
                marginBottom: 4,
              }}
            >
              Sample Card
            </Text>
            <Text
              style={{
                fontSize: theme.typography.sizes.lg,
                fontWeight: 'bold',
                color: previewTheme.colors.primary,
              }}
            >
              $123.45
            </Text>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <View style={{ padding: theme.spacing.xl, paddingTop: theme.spacing.xxl * 1.5 }}>
        {/* Header */}
        <Text
          style={{
            fontSize: theme.typography.sizes.xl,
            fontWeight: 'bold',
            color: theme.colors.text,
            marginBottom: theme.spacing.md,
          }}
        >
          {t('settings.themeSelection.title')}
        </Text>
        <Text
          style={{
            fontSize: theme.typography.sizes.md,
            color: theme.colors.textSecondary,
            marginBottom: theme.spacing.xl,
          }}
        >
          {t('settings.themeSelection.description')}
        </Text>

        {/* Theme Options */}
        <ThemePreview
          themeType="cute"
          themeName={t('settings.themeSelection.cuteTheme')}
          description={t('settings.themeSelection.cuteDescription')}
        />

        <ThemePreview
          themeType="professional"
          themeName={t('settings.themeSelection.professionalTheme')}
          description={t('settings.themeSelection.professionalDescription')}
        />

        <ThemePreview
          themeType="financial"
          themeName={t('settings.themeSelection.financialTheme')}
          description={t('settings.themeSelection.financialDescription')}
          isPremium={true}
        />

        <Button
          title={t('common.done')}
          onPress={() => navigation.goBack()}
          variant="outline"
          size="large"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({});

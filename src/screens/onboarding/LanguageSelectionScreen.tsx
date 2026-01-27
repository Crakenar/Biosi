import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { OnboardingStackParamList } from '../../navigation/types';
import { useTheme } from '../../contexts/ThemeContext';
import { useSettingsStore } from '../../store/settingsStore';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { useTranslation } from 'react-i18next';

type LanguageSelectionNavigationProp = StackNavigationProp<
  OnboardingStackParamList,
  'LanguageSelection'
>;

export const LanguageSelectionScreen: React.FC = () => {
  const navigation = useNavigation<LanguageSelectionNavigationProp>();
  const { theme } = useTheme();
  const { setLanguage } = useSettingsStore();
  const { t, i18n } = useTranslation();

  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'fr'>(
    i18n.language as 'en' | 'fr'
  );

  const handleSelectLanguage = (language: 'en' | 'fr') => {
    setSelectedLanguage(language);
    setLanguage(language);
    i18n.changeLanguage(language);
  };

  const handleContinue = () => {
    navigation.navigate('ProfileSetup');
  };

  const LanguageOption = ({
    language,
    label,
    nativeName,
  }: {
    language: 'en' | 'fr';
    label: string;
    nativeName: string;
  }) => {
    const isSelected = selectedLanguage === language;

    return (
      <TouchableOpacity
        style={{
          marginBottom: theme.spacing.md,
        }}
        onPress={() => handleSelectLanguage(language)}
      >
        <Card
          variant="elevated"
          style={{
            borderWidth: 2,
            borderColor: isSelected ? theme.colors.primary : 'transparent',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: theme.typography.sizes.lg,
                  fontWeight: 'bold',
                  color: theme.colors.text,
                  marginBottom: theme.spacing.xs,
                }}
              >
                {nativeName}
              </Text>
              <Text
                style={{
                  fontSize: theme.typography.sizes.sm,
                  color: theme.colors.textSecondary,
                }}
              >
                {label}
              </Text>
            </View>
            {isSelected && (
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: theme.borderRadius.round,
                  backgroundColor: theme.colors.primary,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: '#FFFFFF', fontSize: 16 }}>✓</Text>
              </View>
            )}
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: theme.spacing.xl,
        justifyContent: 'space-between',
      }}
    >
      <View>
        <Text
          style={{
            fontSize: theme.typography.sizes.xl,
            fontWeight: 'bold',
            color: theme.colors.text,
            marginBottom: theme.spacing.md,
          }}
        >
          {t('onboarding.language.title')}
        </Text>
        <Text
          style={{
            fontSize: theme.typography.sizes.md,
            color: theme.colors.textSecondary,
            marginBottom: theme.spacing.xl,
          }}
        >
          {t('onboarding.language.description')}
        </Text>

        <LanguageOption language="en" label="English" nativeName={t('onboarding.language.english')} />
        <LanguageOption language="fr" label="Français" nativeName={t('onboarding.language.french')} />
      </View>

      <Button title={t('common.next')} onPress={handleContinue} size="large" />
    </View>
  );
};

const styles = StyleSheet.create({});

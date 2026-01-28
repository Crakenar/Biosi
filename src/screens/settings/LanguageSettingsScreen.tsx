import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SettingsStackParamList } from '../../navigation/types';
import { useTheme } from '../../contexts/ThemeContext';
import { useSettingsStore } from '../../store/settingsStore';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { useTranslation } from 'react-i18next';

type LanguageSettingsNavigationProp = StackNavigationProp<
  SettingsStackParamList,
  'LanguageSettings'
>;

export const LanguageSettingsScreen: React.FC = () => {
  const navigation = useNavigation<LanguageSettingsNavigationProp>();
  const { theme } = useTheme();
  const { settings, setLanguage } = useSettingsStore();
  const { t, i18n } = useTranslation();

  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'fr'>(settings.language);

  const handleSave = () => {
    if (selectedLanguage !== settings.language) {
      setLanguage(selectedLanguage);
      i18n.changeLanguage(selectedLanguage);
    }
    navigation.goBack();
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
        onPress={() => setSelectedLanguage(language)}
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
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <View style={{ padding: theme.spacing.xl, paddingTop: theme.spacing.xxl * 1.5 }}>
        <Text
          style={{
            fontSize: theme.typography.sizes.xl,
            fontWeight: 'bold',
            color: theme.colors.text,
            marginBottom: theme.spacing.md,
          }}
        >
          {t('settings.languageSettings.title')}
        </Text>
        <Text
          style={{
            fontSize: theme.typography.sizes.md,
            color: theme.colors.textSecondary,
            marginBottom: theme.spacing.xl,
          }}
        >
          {t('settings.languageSettings.description')}
        </Text>

        <LanguageOption
          language="en"
          label="English"
          nativeName={t('settings.languageSettings.english')}
        />
        <LanguageOption
          language="fr"
          label="Français"
          nativeName={t('settings.languageSettings.french')}
        />

        <Button title={t('common.save')} onPress={handleSave} size="large" style={{ marginTop: theme.spacing.lg }} />
        <Button
          title={t('common.cancel')}
          onPress={() => navigation.goBack()}
          variant="outline"
          size="large"
          style={{ marginTop: theme.spacing.md }}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({});

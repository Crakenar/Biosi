import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SettingsStackParamList } from '../../navigation/types';
import { useTheme } from '../../contexts/ThemeContext';
import { useUserStore } from '../../store/userStore';
import { useSettingsStore } from '../../store/settingsStore';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { CURRENCIES } from '../../constants/config';
import { useTranslation } from 'react-i18next';

type CurrencySettingsNavigationProp = StackNavigationProp<
  SettingsStackParamList,
  'CurrencySettings'
>;

export const CurrencySettingsScreen: React.FC = () => {
  const navigation = useNavigation<CurrencySettingsNavigationProp>();
  const { theme } = useTheme();
  const { user, updateUser } = useUserStore();
  const { setCurrency } = useSettingsStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState(user?.currency || 'USD');

  const filteredCurrencies = CURRENCIES.filter(
    (currency) =>
      currency.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      currency.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = () => {
    if (user && selectedCurrency !== user.currency) {
      updateUser({ currency: selectedCurrency });
      setCurrency(selectedCurrency);
    }
    navigation.goBack();
  };

  const { t } = useTranslation();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <View style={{ padding: theme.spacing.xl, paddingTop: theme.spacing.xxl * 1.5 }}>
        <Text
          style={{
            fontSize: theme.typography.sizes.xl,
            fontWeight: 'bold',
            color: theme.colors.text,
            marginBottom: theme.spacing.md,
          }}
        >
          {t('settings.currencySettings.title')}
        </Text>
        <Text
          style={{
            fontSize: theme.typography.sizes.md,
            color: theme.colors.textSecondary,
            marginBottom: theme.spacing.lg,
          }}
        >
          {t('settings.currencySettings.description')}
        </Text>

        <Input
          placeholder={t('onboarding.currency.searchPlaceholder')}
          value={searchQuery}
          onChangeText={setSearchQuery}
          containerStyle={{ marginBottom: theme.spacing.md }}
        />
      </View>

      <FlatList
        data={filteredCurrencies}
        keyExtractor={(item) => item.code}
        contentContainerStyle={{ paddingHorizontal: theme.spacing.xl }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingVertical: theme.spacing.md,
              paddingHorizontal: theme.spacing.lg,
              marginBottom: theme.spacing.sm,
              backgroundColor:
                selectedCurrency === item.code ? theme.colors.primary : theme.colors.surface,
              borderRadius: theme.borderRadius.md,
              borderWidth: 1,
              borderColor:
                selectedCurrency === item.code ? theme.colors.primary : theme.colors.border,
            }}
            onPress={() => setSelectedCurrency(item.code)}
          >
            <View>
              <Text
                style={{
                  fontSize: theme.typography.sizes.md,
                  fontWeight: '600',
                  color: selectedCurrency === item.code ? '#FFFFFF' : theme.colors.text,
                }}
              >
                {item.name}
              </Text>
              <Text
                style={{
                  fontSize: theme.typography.sizes.sm,
                  color:
                    selectedCurrency === item.code ? '#FFFFFF' : theme.colors.textSecondary,
                  marginTop: 2,
                }}
              >
                {item.code}
              </Text>
            </View>
            <Text
              style={{
                fontSize: theme.typography.sizes.lg,
                fontWeight: 'bold',
                color: selectedCurrency === item.code ? '#FFFFFF' : theme.colors.text,
              }}
            >
              {item.symbol}
            </Text>
          </TouchableOpacity>
        )}
      />

      <View style={{ padding: theme.spacing.xl }}>
        <Button title={t('common.save')} onPress={handleSave} size="large" />
        <Button
          title={t('common.cancel')}
          onPress={() => navigation.goBack()}
          variant="outline"
          size="large"
          style={{ marginTop: theme.spacing.md }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});

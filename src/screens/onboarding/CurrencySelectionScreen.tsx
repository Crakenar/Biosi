import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { OnboardingStackParamList } from '../../navigation/types';
import { useTheme } from '../../contexts/ThemeContext';
import { useUserStore } from '../../store/userStore';
import { useSettingsStore } from '../../store/settingsStore';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { ProgressBar } from '../../components/onboarding/ProgressBar';
import { CURRENCIES } from '../../constants/config';
import { normalizeToHourly } from '../../services/calculations';
import { useTranslation } from 'react-i18next';

type CurrencySelectionNavigationProp = StackNavigationProp<
  OnboardingStackParamList,
  'CurrencySelection'
>;
type CurrencySelectionRouteProp = RouteProp<OnboardingStackParamList, 'CurrencySelection'>;

export const CurrencySelectionScreen: React.FC = () => {
  const navigation = useNavigation<CurrencySelectionNavigationProp>();
  const route = useRoute<CurrencySelectionRouteProp>();
  const { theme } = useTheme();
  const { setUser } = useUserStore();
  const { completeOnboarding, setCurrency } = useSettingsStore();

  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCurrencies = CURRENCIES.filter(
    (currency) =>
      currency.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      currency.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleComplete = () => {
    const { name, age, wage, hoursPerWeek } = route.params;
    const hourlyRate = normalizeToHourly(wage.amount, wage.period, hoursPerWeek);

    setUser({
      id: `user_${Date.now()}`,
      name,
      age,
      currency: selectedCurrency,
      wage: {
        ...wage,
        hourlyRate,
      },
      hoursPerWeek,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    setCurrency(selectedCurrency);
    completeOnboarding();
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={{ padding: theme.spacing.xl }}>
        <ProgressBar currentStep={5} totalSteps={5} />
        <Text
          style={{
            fontSize: theme.typography.sizes.xl,
            fontWeight: 'bold',
            color: theme.colors.text,
            marginBottom: theme.spacing.md,
          }}
        >
          Choose your currency
        </Text>
        <Text
          style={{
            fontSize: theme.typography.sizes.md,
            color: theme.colors.textSecondary,
            marginBottom: theme.spacing.lg,
          }}
        >
          Select the currency you use for your transactions.
        </Text>

        <Input
          placeholder="Search currencies..."
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
        <Button title="Complete Setup" onPress={handleComplete} size="large" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../contexts/ThemeContext';
import { useSettingsStore } from '../../store/settingsStore';
import { useTransactionStore } from '../../store/transactionStore';
import { useUserStore } from '../../store/userStore';
import { Button } from '../../components/common/Button';
import { formatCurrency } from '../../utils/formatters';

const PRESET_RATES = [
  { label: 'Conservative', rate: 0.04, description: 'Low-risk investments (4%)' },
  { label: 'Moderate', rate: 0.07, description: 'Balanced portfolio (7%)' },
  { label: 'Aggressive', rate: 0.10, description: 'High-growth stocks (10%)' },
];

export function CompoundInterestSettingsScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { settings, updateSettings } = useSettingsStore();
  const { transactions } = useTransactionStore();
  const { user } = useUserStore();

  const [customRate, setCustomRate] = useState((settings.compoundInterestRate * 100).toFixed(1));
  const [selectedPreset, setSelectedPreset] = useState<number | null>(
    PRESET_RATES.findIndex((p) => p.rate === settings.compoundInterestRate)
  );

  // Calculate projections
  const totalSaved = transactions
    .filter((t) => t.type === 'saved')
    .reduce((sum, t) => sum + t.itemPrice, 0);

  const calculateCompoundInterest = (principal: number, rate: number, years: number) => {
    return principal * Math.pow(1 + rate, years);
  };

  const handlePresetSelect = (index: number) => {
    setSelectedPreset(index);
    setCustomRate((PRESET_RATES[index].rate * 100).toFixed(1));
  };

  const handleCustomRateChange = (text: string) => {
    setCustomRate(text);
    setSelectedPreset(null);
  };

  const handleSave = () => {
    const rateValue = parseFloat(customRate);

    if (isNaN(rateValue) || rateValue < 0 || rateValue > 100) {
      Alert.alert('Invalid Rate', 'Please enter a rate between 0 and 100');
      return;
    }

    updateSettings({ compoundInterestRate: rateValue / 100 });
    Alert.alert('Success', 'Interest rate updated successfully', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  const currentRate = parseFloat(customRate) / 100;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={[styles.backButton, { color: theme.colors.primary }]}>
              ← Back
            </Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Compound Interest Rate
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Adjust the interest rate to match your investment returns
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Preset Rates
          </Text>
          {PRESET_RATES.map((preset, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.presetButton,
                {
                  backgroundColor:
                    selectedPreset === index ? theme.colors.primary : theme.colors.background,
                  borderColor: theme.colors.border,
                },
              ]}
              onPress={() => handlePresetSelect(index)}
            >
              <View>
                <Text
                  style={[
                    styles.presetLabel,
                    {
                      color:
                        selectedPreset === index ? '#fff' : theme.colors.text,
                    },
                  ]}
                >
                  {preset.label}
                </Text>
                <Text
                  style={[
                    styles.presetDescription,
                    {
                      color:
                        selectedPreset === index
                          ? 'rgba(255,255,255,0.8)'
                          : theme.colors.textSecondary,
                    },
                  ]}
                >
                  {preset.description}
                </Text>
              </View>
              <Text
                style={[
                  styles.presetRate,
                  {
                    color:
                      selectedPreset === index ? '#fff' : theme.colors.primary,
                  },
                ]}
              >
                {(preset.rate * 100).toFixed(0)}%
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Custom Rate
          </Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.background,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                },
              ]}
              value={customRate}
              onChangeText={handleCustomRateChange}
              keyboardType="decimal-pad"
              placeholder="7.0"
              placeholderTextColor={theme.colors.textSecondary}
            />
            <Text style={[styles.percentSign, { color: theme.colors.text }]}>%</Text>
          </View>
          <Text style={[styles.hint, { color: theme.colors.textSecondary }]}>
            Enter a custom annual return rate (0-100%)
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Projection Preview
          </Text>
          <Text style={[styles.previewLabel, { color: theme.colors.textSecondary }]}>
            Your savings: {user ? formatCurrency(totalSaved, user.currency) : `$${totalSaved}`}
          </Text>
          <Text style={[styles.previewLabel, { color: theme.colors.textSecondary }]}>
            At {(currentRate * 100).toFixed(1)}% annual return:
          </Text>

          <View style={styles.projections}>
            <View style={styles.projectionItem}>
              <Text style={[styles.projectionYears, { color: theme.colors.textSecondary }]}>
                10 Years
              </Text>
              <Text style={[styles.projectionValue, { color: theme.colors.primary }]}>
                {user
                  ? formatCurrency(
                      calculateCompoundInterest(totalSaved, currentRate, 10),
                      user.currency
                    )
                  : `$${calculateCompoundInterest(totalSaved, currentRate, 10).toFixed(2)}`}
              </Text>
            </View>
            <View style={styles.projectionItem}>
              <Text style={[styles.projectionYears, { color: theme.colors.textSecondary }]}>
                20 Years
              </Text>
              <Text style={[styles.projectionValue, { color: theme.colors.primary }]}>
                {user
                  ? formatCurrency(
                      calculateCompoundInterest(totalSaved, currentRate, 20),
                      user.currency
                    )
                  : `$${calculateCompoundInterest(totalSaved, currentRate, 20).toFixed(2)}`}
              </Text>
            </View>
          </View>
        </View>

        <Button title="Save Changes" onPress={handleSave} size="large" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    marginBottom: 24,
  },
  backButton: {
    fontSize: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  presetButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
  },
  presetLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  presetDescription: {
    fontSize: 13,
  },
  presetRate: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  input: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 18,
    fontWeight: '600',
  },
  percentSign: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  hint: {
    fontSize: 13,
  },
  previewLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  projections: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  projectionItem: {
    flex: 1,
    alignItems: 'center',
  },
  projectionYears: {
    fontSize: 12,
    marginBottom: 8,
  },
  projectionValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

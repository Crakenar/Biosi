import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { useSettingsStore } from '../../store/settingsStore';
import { CategoryBreakdownChart } from '../../components/charts/CategoryBreakdownChart';
import { WeeklyInsightsChart } from '../../components/charts/WeeklyInsightsChart';
import { DailyInsightsChart } from '../../components/charts/DailyInsightsChart';
import { YearOverYearChart } from '../../components/charts/YearOverYearChart';
import { CustomPeriodAnalytics } from '../../components/charts/CustomPeriodAnalytics';

type AnalyticsTab = 'categories' | 'weekly' | 'daily' | 'yoy' | 'custom';

export function PremiumAnalyticsScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { settings } = useSettingsStore();
  const [activeTab, setActiveTab] = useState<AnalyticsTab>('categories');

  if (!settings.isPremium) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.lockedContainer}>
          <Text style={styles.lockEmoji}>🔒</Text>
          <Text style={[styles.lockedTitle, { color: theme.colors.text }]}>
            Premium Analytics
          </Text>
          <Text style={[styles.lockedMessage, { color: theme.colors.textSecondary }]}>
            Upgrade to Premium to unlock advanced analytics and insights
          </Text>
        </View>
      </View>
    );
  }

  const tabs = [
    { id: 'categories' as AnalyticsTab, label: '📊 Categories', icon: '📊' },
    { id: 'weekly' as AnalyticsTab, label: '📅 Weekly', icon: '📅' },
    { id: 'daily' as AnalyticsTab, label: '📈 Daily', icon: '📈' },
    { id: 'yoy' as AnalyticsTab, label: '🔄 YoY', icon: '🔄' },
    { id: 'custom' as AnalyticsTab, label: '🎯 Custom', icon: '🎯' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Premium Analytics
        </Text>
        <View style={[styles.premiumBadge, { backgroundColor: theme.colors.primary }]}>
          <Text style={styles.premiumText}>✨ Premium</Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabContainer}
        contentContainerStyle={styles.tabContent}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              {
                backgroundColor:
                  activeTab === tab.id ? theme.colors.primary : theme.colors.surface,
                borderColor: activeTab === tab.id ? theme.colors.primary : theme.colors.border,
              },
            ]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === tab.id ? '#fff' : theme.colors.text },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.content}>
        {activeTab === 'categories' && <CategoryBreakdownChart />}
        {activeTab === 'weekly' && <WeeklyInsightsChart />}
        {activeTab === 'daily' && <DailyInsightsChart />}
        {activeTab === 'yoy' && <YearOverYearChart />}
        {activeTab === 'custom' && <CustomPeriodAnalytics />}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  premiumBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  premiumText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  tabContainer: {
    maxHeight: 50,
    marginBottom: 16,
  },
  tabContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  lockedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  lockEmoji: {
    fontSize: 60,
    marginBottom: 20,
  },
  lockedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  lockedMessage: {
    fontSize: 16,
    textAlign: 'center',
  },
});

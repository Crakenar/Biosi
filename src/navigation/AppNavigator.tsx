import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { AppTabParamList, DashboardStackParamList, HistoryStackParamList, SettingsStackParamList } from './types';
import { useTheme } from '../contexts/ThemeContext';
import { DashboardScreen } from '../screens/dashboard/DashboardScreen';
import { ItemCheckModal } from '../screens/item-check/ItemCheckModal';
import { ResultScreen } from '../screens/item-check/ResultScreen';
import { TransactionHistoryScreen } from '../screens/history/TransactionHistoryScreen';
import { TransactionDetailScreen } from '../screens/history/TransactionDetailScreen';
import { SettingsScreen } from '../screens/settings/SettingsScreen';
import { ProfileEditScreen } from '../screens/settings/ProfileEditScreen';
import { ThemeSelectionScreen } from '../screens/settings/ThemeSelectionScreen';
import { CurrencySettingsScreen } from '../screens/settings/CurrencySettingsScreen';
import { LanguageSettingsScreen } from '../screens/settings/LanguageSettingsScreen';
import { PremiumPurchaseScreen } from '../screens/settings/PremiumPurchaseScreen';

const DashboardStack = createStackNavigator<DashboardStackParamList>();
const HistoryStack = createStackNavigator<HistoryStackParamList>();
const SettingsStack = createStackNavigator<SettingsStackParamList>();

function DashboardNavigator() {
  return (
    <DashboardStack.Navigator screenOptions={{ headerShown: false }}>
      <DashboardStack.Screen name="DashboardMain" component={DashboardScreen} />
      <DashboardStack.Screen
        name="ItemCheck"
        component={ItemCheckModal}
        options={{ presentation: 'modal' }}
      />
      <DashboardStack.Screen name="Result" component={ResultScreen} />
    </DashboardStack.Navigator>
  );
}

function HistoryNavigator() {
  return (
    <HistoryStack.Navigator screenOptions={{ headerShown: false }}>
      <HistoryStack.Screen name="TransactionHistory" component={TransactionHistoryScreen} />
      <HistoryStack.Screen name="TransactionDetail" component={TransactionDetailScreen} />
    </HistoryStack.Navigator>
  );
}

function SettingsNavigator() {
  return (
    <SettingsStack.Navigator screenOptions={{ headerShown: false }}>
      <SettingsStack.Screen name="SettingsMain" component={SettingsScreen} />
      <SettingsStack.Screen name="ProfileEdit" component={ProfileEditScreen} />
      <SettingsStack.Screen name="ThemeSelection" component={ThemeSelectionScreen} />
      <SettingsStack.Screen name="CurrencySettings" component={CurrencySettingsScreen} />
      <SettingsStack.Screen name="LanguageSettings" component={LanguageSettingsScreen} />
      <SettingsStack.Screen name="PremiumPurchase" component={PremiumPurchaseScreen} />
    </SettingsStack.Navigator>
  );
}

const Tab = createBottomTabNavigator<AppTabParamList>();

export function AppNavigator() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
      }}
    >
      <Tab.Screen
        name="DashboardTab"
        component={DashboardNavigator}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>📊</Text>
          ),
        }}
      />
      <Tab.Screen
        name="HistoryTab"
        component={HistoryNavigator}
        options={{
          tabBarLabel: 'History',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>📋</Text>
          ),
        }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsNavigator}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>⚙️</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

import { NavigatorScreenParams } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

export type OnboardingStackParamList = {
  Welcome: undefined;
  LanguageSelection: undefined;
  ProfileSetup: undefined;
  WageInput: { name: string; age: number };
  CurrencySelection: { name: string; age: number; wage: { amount: number; period: 'hourly' | 'monthly' | 'yearly' } };
};

export type DashboardStackParamList = {
  DashboardMain: undefined;
  ItemCheck: undefined;
  Result: { type: 'purchased' | 'saved'; price: number; hours: number };
};

export type HistoryStackParamList = {
  TransactionHistory: undefined;
  TransactionDetail: { transactionId: string };
};

export type SettingsStackParamList = {
  SettingsMain: undefined;
  ProfileEdit: undefined;
  ThemeSelection: undefined;
  CurrencySettings: undefined;
  LanguageSettings: undefined;
  PremiumPurchase: undefined;
};

export type AppTabParamList = {
  DashboardTab: NavigatorScreenParams<DashboardStackParamList>;
  HistoryTab: NavigatorScreenParams<HistoryStackParamList>;
  SettingsTab: NavigatorScreenParams<SettingsStackParamList>;
};

export type RootStackParamList = {
  Onboarding: NavigatorScreenParams<OnboardingStackParamList>;
  App: NavigatorScreenParams<AppTabParamList>;
};

export type OnboardingScreenNavigationProp = StackNavigationProp<OnboardingStackParamList>;
export type DashboardScreenNavigationProp = StackNavigationProp<DashboardStackParamList>;
export type HistoryScreenNavigationProp = StackNavigationProp<HistoryStackParamList>;
export type SettingsScreenNavigationProp = StackNavigationProp<SettingsStackParamList>;
export type AppTabNavigationProp = BottomTabNavigationProp<AppTabParamList>;

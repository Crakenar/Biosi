import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { OnboardingStackParamList } from './types';
import { WelcomeScreen } from '../screens/onboarding/WelcomeScreen';
import { LanguageSelectionScreen } from '../screens/onboarding/LanguageSelectionScreen';
import { NameInputScreen } from '../screens/onboarding/NameInputScreen';
import { AgeInputScreen } from '../screens/onboarding/AgeInputScreen';
import { WageInputScreen } from '../screens/onboarding/WageInputScreen';
import { CurrencySelectionScreen } from '../screens/onboarding/CurrencySelectionScreen';
import { PremiumUpsellScreen } from '../screens/onboarding/PremiumUpsellScreen';

const Stack = createStackNavigator<OnboardingStackParamList>();

export function OnboardingNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="LanguageSelection" component={LanguageSelectionScreen} />
      <Stack.Screen name="NameInput" component={NameInputScreen} />
      <Stack.Screen name="AgeInput" component={AgeInputScreen} />
      <Stack.Screen name="CurrencySelection" component={CurrencySelectionScreen} />
      <Stack.Screen name="WageInput" component={WageInputScreen} />
      <Stack.Screen name="PremiumUpsell" component={PremiumUpsellScreen} />
    </Stack.Navigator>
  );
}

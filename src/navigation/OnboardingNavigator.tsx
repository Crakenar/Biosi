import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { OnboardingStackParamList } from './types';
import { WelcomeScreen } from '../screens/onboarding/WelcomeScreen';
import { LanguageSelectionScreen } from '../screens/onboarding/LanguageSelectionScreen';
import { ProfileSetupScreen } from '../screens/onboarding/ProfileSetupScreen';
import { WageInputScreen } from '../screens/onboarding/WageInputScreen';
import { CurrencySelectionScreen } from '../screens/onboarding/CurrencySelectionScreen';

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
      <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
      <Stack.Screen name="WageInput" component={WageInputScreen} />
      <Stack.Screen name="CurrencySelection" component={CurrencySelectionScreen} />
    </Stack.Navigator>
  );
}

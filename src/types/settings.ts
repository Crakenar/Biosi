export interface AppSettings {
  theme: 'cute' | 'professional' | 'financial';
  currency: string;
  language: 'en' | 'fr';
  displayMode: 'currency' | 'hours'; // Display amounts in currency or hours
  isPremium: boolean; // Whether user has purchased premium (financial theme)
  onboardingCompleted: boolean;
  compoundInterestRate: number;
  workHoursPerDay: number; // Number of hours in a work day (default 7)
}

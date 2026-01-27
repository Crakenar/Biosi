# Translation Implementation Guide

## Overview
The app now supports French and English translations using react-i18next.

## Files Added/Modified

### New Files
- `src/locales/en.json` - English translations
- `src/locales/fr.json` - French translations
- `src/services/i18n.ts` - i18n configuration
- `src/screens/onboarding/LanguageSelectionScreen.tsx` - Language selection during onboarding
- `src/screens/settings/LanguageSettingsScreen.tsx` - Language change in settings

### Modified Files
- `src/types/settings.ts` - Added `language` field
- `src/store/settingsStore.ts` - Added `language` management
- `src/navigation/types.ts` - Added LanguageSelection and LanguageSettings screens
- `App.tsx` - Added i18n initialization
- All screen files - Added `useTranslation` import and hook

## How to Use Translations in Screens

### 1. Import and Hook (Already Done)
All screens now have:
```typescript
import { useTranslation } from 'react-i18next';

// Inside component:
const { t } = useTranslation();
```

### 2. Replace Hardcoded Strings
Replace all hardcoded strings with `t()` calls:

**Before:**
```typescript
<Text>Hello, World!</Text>
```

**After:**
```typescript
<Text>{t('common.hello')}</Text>
```

### 3. Translation Keys Reference

All translation keys are in:
- `src/locales/en.json` (English)
- `src/locales/fr.json` (French)

## Screens Requiring Translation Updates

### Onboarding Screens
- ✅ `WelcomeScreen.tsx` - DONE
- ✅ `LanguageSelectionScreen.tsx` - DONE
- ⏳ `ProfileSetupScreen.tsx` - Needs update
- ⏳ `WageInputScreen.tsx` - Needs update
- ⏳ `CurrencySelectionScreen.tsx` - Needs update

### Dashboard Screens
- ⏳ `DashboardScreen.tsx` - Needs update

### Item Check Screens
- ⏳ `ItemCheckModal.tsx` - Needs update
- ⏳ `ResultScreen.tsx` - Needs update

### History Screens
- ⏳ `TransactionHistoryScreen.tsx` - Needs update
- ⏳ `TransactionDetailScreen.tsx` - Needs update

### Settings Screens
- ⏳ `SettingsScreen.tsx` - Needs update (including language option)
- ⏳ `ProfileEditScreen.tsx` - Needs update
- ⏳ `ThemeSelectionScreen.tsx` - Needs update
- ⏳ `CurrencySettingsScreen.tsx` - Needs update
- ✅ `LanguageSettingsScreen.tsx` - DONE

## Example: ProfileSetupScreen Translation Update

### Find all hardcoded strings:
```typescript
"Let's get to know you"
"We need some basic information..."
"Your Name"
"Enter your name"
"Your Age"
"Enter your age"
"Next"
// Error messages
"Name is required"
"Age must be at least 16"
etc.
```

### Replace with translation keys:
```typescript
{t('onboarding.profile.title')}
{t('onboarding.profile.description')}
{t('onboarding.profile.nameLabel')}
{t('onboarding.profile.namePlaceholder')}
{t('onboarding.profile.ageLabel')}
{t('onboarding.profile.agePlaceholder')}
{t('common.next')}
// Error messages
{t('onboarding.profile.nameRequired')}
{t('onboarding.profile.ageMin', { min: APP_CONFIG.VALIDATION.MIN_AGE })}
```

## Testing Translations

1. Start the app: `npm start`
2. During onboarding, select a language
3. Complete onboarding
4. Go to Settings → Language to switch languages
5. Verify all text changes to the selected language

## Adding New Translations

To add new text:

1. Add the key to both `en.json` and `fr.json`:
```json
// en.json
{
  "newSection": {
    "newKey": "English text"
  }
}

// fr.json
{
  "newSection": {
    "newKey": "Texte français"
  }
}
```

2. Use in component:
```typescript
{t('newSection.newKey')}
```

## Common Translation Patterns

### Simple text:
```typescript
{t('common.save')}
```

### With variables:
```typescript
{t('dashboard.greeting', { name: user.name })}
// Result: "Hi, John!"
```

### Pluralization:
```typescript
{t('dashboard.purchases', { count: 5 })}
// English: "5 purchases"
// French: "5 achats"
```

### Conditional text:
```typescript
{transaction.type === 'purchased'
  ? t('history.transactionDetail.purchase')
  : t('history.transactionDetail.savings')}
```

## Next Steps

To complete the translation implementation:

1. Update each screen file by replacing hardcoded strings with `t()` calls
2. Use the translation keys from `en.json` and `fr.json`
3. Test each screen in both languages
4. Add any missing translations to the JSON files

The language selection is now functional:
- Onboarding: Welcome → Language Selection → Profile Setup → ...
- Settings: Tap "Language" to change language anytime

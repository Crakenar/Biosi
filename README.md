# Time Worth - Financial Mindfulness App

A React Native app built with Expo that helps users visualize purchases in terms of time worked. Users can check if items are "worth it" by seeing how many work hours they represent, then track spending/savings over time with analytics and compound interest projections.

## Features

✅ **Bilingual Support** - Full French and English translations (switchable anytime)
✅ **Dual Theme System** - Switch between cute and professional themes
✅ **Currency Selection** - Support for 15+ currencies
✅ **Time-Based Purchase Evaluation** - See how many hours of work each purchase represents
✅ **Spending & Savings Tracking** - Track both purchases and avoided purchases
✅ **Monthly/Yearly Analytics** - View spending trends with charts
✅ **Compound Interest Projections** - See 10-year and 20-year savings projections at 7% interest
✅ **Transaction History** - View, filter, and search all transactions
✅ **Profile Management** - Edit your wage, age, currency, and language settings
✅ **Complete Onboarding Flow** - Easy setup for new users with language selection

## Tech Stack

- **Framework**: Expo (TypeScript)
- **Navigation**: React Navigation v6
- **State Management**: Zustand (with AsyncStorage persistence)
- **Local Storage**: AsyncStorage
- **Internationalization**: i18next + react-i18next
- **UI Components**: Custom components with themed styling
- **Forms**: React Hook Form with Zod validation
- **Date Utils**: date-fns

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository:
```bash
cd /home/teo/workspace/Biosi
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your device:
   - **iOS**: Press `i` in the terminal or scan the QR code with the Expo Go app
   - **Android**: Press `a` in the terminal or scan the QR code with the Expo Go app
   - **Web**: Press `w` in the terminal

## Project Structure

```
Biosi/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── common/        # Button, Input, Card, LoadingScreen
│   │   ├── charts/        # Chart components
│   │   └── dashboard/     # Dashboard-specific components
│   ├── screens/           # App screens
│   │   ├── onboarding/    # Onboarding flow
│   │   ├── dashboard/     # Main dashboard
│   │   ├── item-check/    # Item worth checking
│   │   ├── history/       # Transaction history
│   │   └── settings/      # App settings
│   ├── navigation/        # Navigation configuration
│   ├── store/             # Zustand state stores
│   ├── services/          # Business logic and utilities
│   ├── utils/             # Helper functions
│   ├── constants/         # App constants and themes
│   ├── types/             # TypeScript type definitions
│   ├── hooks/             # Custom React hooks
│   └── contexts/          # React contexts
├── assets/                # Images and fonts
├── App.tsx                # App entry point
└── package.json
```

## Key Features Explained

### Item Check Flow
1. User enters the price of an item they're considering
2. App calculates and displays hours of work required
3. Visual progress bar shows the time commitment
4. User chooses "I Bought It" or "I Didn't Buy It"
5. Transaction is saved and dashboard updates

### Dashboard Analytics
- **This Month**: Total spent and saved
- **This Year**: Total spent and saved
- **Charts**: Monthly spending trends and cumulative savings
- **Compound Interest**: 10-year and 20-year projections

### Theme System
- **Cute Theme**: Pastel colors, rounded shapes, playful aesthetic
- **Professional Theme**: Clean lines, muted colors, polished look
- Theme changes apply immediately across the entire app

### Language Support
- **English & French**: Full translations for all app content
- **Selection during onboarding**: Choose language on first launch
- **Switch anytime**: Change language in Settings → Language
- **Automatic persistence**: Language choice is saved and persists across app restarts
- **Translation files**: Located in `src/locales/en.json` and `src/locales/fr.json`

## Development

### Building for Production

```bash
# iOS
npx expo build:ios

# Android
npx expo build:android
```

### Environment Configuration

The app uses the following key configurations:
- Compound interest rate: 7% (fixed)
- Wage normalization: 40 hrs/week × 4 weeks = 160 hrs/month
- Wage normalization: 40 hrs/week × 52 weeks = 2080 hrs/year

## License

MIT

## Version

1.0.0

🛠️ DEVELOPER TOOLS - QUICK GUIDE

═══════════════════════════════════════════════════════════════════

📋 SETUP

1. Edit your .env file and set:
   EXPO_PUBLIC_ENABLE_DEV_MODE=true

2. Optional: Force premium features without RevenueCat:
   EXPO_PUBLIC_FORCE_PREMIUM=true

3. Restart the dev server (npm start or npx expo start)

═══════════════════════════════════════════════════════════════════

🎯 ACCESSING DEV SETTINGS

1. Complete onboarding (or use dev tools to reset it)
2. Go to Settings tab
3. Scroll to bottom - you'll see "DEVELOPER" section
4. Tap "Dev Settings" 🛠️

═══════════════════════════════════════════════════════════════════

⚙️ AVAILABLE DEV TOOLS

✨ TOGGLE PREMIUM
   - Instantly enable/disable premium features
   - No RevenueCat needed for testing
   - App will reload after toggle

🔄 RESET ONBOARDING
   - Go back to welcome screen
   - Test onboarding flow again
   - Keeps all other data

⚠️ RESET EVERYTHING
   - Deletes all data (transactions, settings, goals, budgets)
   - Fresh start
   - App reloads to onboarding

📊 ADD MOCK TRANSACTIONS
   - Populate app with test data
   - Choose 10, 50, or 100 transactions
   - Random dates, categories, prices
   - Great for testing charts and analytics

═══════════════════════════════════════════════════════════════════

🔧 ENV VARIABLES

EXPO_PUBLIC_ENABLE_DEV_MODE=true
   - Enables dev settings screen
   - Shows dev button in Settings
   - Default: false

EXPO_PUBLIC_FORCE_PREMIUM=true
   - Forces premium status on app start
   - Bypasses RevenueCat checks
   - Perfect for testing premium features without purchasing
   - Default: false

EXPO_PUBLIC_REVENUECAT_IOS_API_KEY=appl_xxxxx
   - Your RevenueCat iOS API key
   - Get from https://app.revenuecat.com

EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY=goog_xxxxx
   - Your RevenueCat Android API key
   - Get from https://app.revenuecat.com

═══════════════════════════════════════════════════════════════════

📝 TESTING SCENARIOS

Test Onboarding:
   1. Set EXPO_PUBLIC_ENABLE_DEV_MODE=true
   2. Open app → Settings → Dev Settings
   3. Tap "Reset Onboarding"
   4. App reloads to welcome screen

Test Premium Features:
   Option A (with ENV):
      1. Set EXPO_PUBLIC_FORCE_PREMIUM=true
      2. Restart app
      3. Premium features auto-enabled

   Option B (with Dev Tools):
      1. Open Dev Settings
      2. Tap "Enable Premium"
      3. App reloads with premium active

Test Premium Charts:
   1. Enable premium (either method above)
   2. Add mock transactions (Dev Settings → Add Mock Transactions)
   3. View Dashboard, Analytics, History
   4. All charts should show data

Test Free Limits:
   1. Disable premium (Dev Settings → Disable Premium)
   2. Add 100 mock transactions
   3. Check History tab - only last 3 months show
   4. Banner appears: "Upgrade to Premium for unlimited history"

═══════════════════════════════════════════════════════════════════

⚡ QUICK RESET WORKFLOW

Need to start fresh?
   Settings → Dev Settings → Reset Everything → OK

Need to retest onboarding?
   Settings → Dev Settings → Reset Onboarding → OK

Need test data?
   Settings → Dev Settings → Add Mock Transactions → Choose amount

═══════════════════════════════════════════════════════════════════

🚨 IMPORTANT NOTES

- Dev tools ONLY work when EXPO_PUBLIC_ENABLE_DEV_MODE=true
- .env file is gitignored - won't be committed
- Use .env.example as a template
- All resets reload the app automatically
- Mock transactions use random data from last 6 months
- Force premium persists across app restarts

═══════════════════════════════════════════════════════════════════

✅ PRODUCTION BUILDS

Before building for production:
   1. Set EXPO_PUBLIC_ENABLE_DEV_MODE=false (or remove)
   2. Set EXPO_PUBLIC_FORCE_PREMIUM=false (or remove)
   3. Add real RevenueCat API keys
   4. Build: npx eas build --platform all

Dev settings will be hidden in production builds.

═══════════════════════════════════════════════════════════════════

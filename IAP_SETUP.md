# In-App Purchase Setup Guide

This guide explains how to configure in-app purchases for the Premium Financial Theme (€1.00).

## Overview

The app offers a premium theme unlock for €1.00 (or local equivalent) as a **non-consumable** product. This is a one-time purchase that unlocks the Financial Theme permanently.

## Product Details

- **Product Type**: Non-Consumable
- **Price**: €1.00 (Tier 1)
- **iOS Product ID**: `com.biosi.premium_theme`
- **Android Product ID**: `premium_theme`
- **Payment Methods**: Apple Pay (iOS) and Google Pay (Android)

## iOS Setup (App Store Connect)

### 1. Create App ID
1. Go to [Apple Developer Portal](https://developer.apple.com)
2. Navigate to Certificates, Identifiers & Profiles
3. Create a new App ID with Bundle ID: `com.yourname.biosi`
4. Enable **In-App Purchase** capability

### 2. Configure In-App Purchase
1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Navigate to your app → Features → In-App Purchases
3. Click the **+** button to create a new in-app purchase
4. Select **Non-Consumable**
5. Fill in the details:
   - **Product ID**: `com.biosi.premium_theme`
   - **Reference Name**: Premium Theme
   - **Price**: €1.00 (Tier 1)
   - **Localization**: Add for all supported languages

### 3. Add Product Details
For each language, provide:
- **Display Name**: Premium Theme / Thème Premium
- **Description**: Unlock the elegant Financial Theme with dark mode and gold accents

### 4. Add Screenshot (Optional)
Upload a screenshot showing the premium theme preview

### 5. Submit for Review
Once configured, submit the in-app purchase for review along with your app

## Android Setup (Google Play Console)

### 1. Enable In-App Purchases
1. Go to [Google Play Console](https://play.google.com/console)
2. Select your app
3. Navigate to Monetize → Products → In-app products
4. Click **Create product**

### 2. Configure Product
Fill in the details:
- **Product ID**: `premium_theme`
- **Name**: Premium Theme
- **Description**: Unlock the elegant Financial Theme with dark mode and gold accents
- **Status**: Active
- **Price**: €1.00

### 3. Set Pricing
1. Click on the product
2. Go to Pricing
3. Set base price to €1.00
4. Save and activate

### 4. Add Localization
Add translations for French and other supported languages:
- **Name (FR)**: Thème Premium
- **Description (FR)**: Débloquez le thème financier élégant avec mode sombre et accents dorés

## Testing

### iOS Testing (Sandbox)

1. Create a Sandbox Tester account in App Store Connect:
   - Go to Users and Access → Sandbox Testers
   - Add a new tester with a unique email

2. On your iOS device:
   - Sign out of your real Apple ID in Settings → App Store
   - Launch the app
   - Try to purchase - it will prompt for sandbox credentials
   - Sign in with your sandbox tester account

3. Test scenarios:
   - ✅ Successful purchase
   - ✅ Cancelled purchase
   - ✅ Restore purchase (after successful purchase)

### Android Testing (License Testers)

1. Add license testers in Google Play Console:
   - Go to Setup → License testing
   - Add tester email addresses

2. Upload an internal testing track or alpha/beta release

3. Install the app from Google Play (not sideloaded)

4. Test the same scenarios as iOS

## Implementation Notes

### Product IDs
The app uses platform-specific product IDs:
```typescript
const PREMIUM_THEME_IOS = 'com.biosi.premium_theme';
const PREMIUM_THEME_ANDROID = 'premium_theme';
```

### Payment Flow
1. User taps on Financial Theme in Theme Selection
2. If not premium, navigate to Premium Purchase screen
3. User taps "Unlock Premium Theme"
4. Native payment sheet appears (Apple Pay or Google Pay)
5. On successful purchase:
   - `isPremium` flag set to `true` in settings
   - Theme automatically switches to `financial`
   - Purchase persisted locally

### Restore Purchase
Users can restore their purchase on new devices:
1. Tap "Restore Purchase" on Premium Purchase screen
2. App queries platform for previous purchases
3. If premium theme found, unlock it automatically

## Security Notes

⚠️ **Important**: This implementation uses local validation only. For production apps with higher-value purchases, implement server-side receipt validation:
- iOS: Validate receipts with Apple's servers
- Android: Validate purchase tokens with Google Play Developer API

## Troubleshooting

### "Product not found" error
- ✅ Check product IDs match exactly
- ✅ Ensure products are approved in App Store Connect / Google Play Console
- ✅ Wait 2-4 hours after creating products for them to propagate
- ✅ Ensure app bundle ID matches

### Purchase not completing
- ✅ Check sandbox tester is configured correctly (iOS)
- ✅ Ensure license tester email is added (Android)
- ✅ Check network connection
- ✅ Review console logs for error messages

### Restore not working
- ✅ Ensure user is signed in with same Apple ID / Google account
- ✅ Check that purchase was completed successfully
- ✅ Verify purchase type is non-consumable

## Next Steps

After setup is complete:
1. Test thoroughly in sandbox/testing environments
2. Submit app for review with in-app purchase
3. Monitor purchase analytics in App Store Connect / Google Play Console
4. Consider adding server-side validation for enhanced security

## Resources

- [Apple In-App Purchase Guide](https://developer.apple.com/in-app-purchase/)
- [Google Play Billing Guide](https://developer.android.com/google/play/billing)
- [react-native-iap Documentation](https://github.com/dooboolab-community/react-native-iap)

# 📦 Guide de Build Android & iOS

Ce guide explique comment créer des builds de l'app pour les partager ou les publier.

## 🤖 Android - Créer un APK

Il y a 2 méthodes pour créer un APK Android :

### **Méthode 1 : EAS Build (Recommandée - Plus facile)**

Cette méthode utilise les serveurs d'Expo pour créer le build. **C'est GRATUIT pour Android**.

#### Prérequis
- Compte Expo (gratuit) : [expo.dev](https://expo.dev)

#### Étapes

1. **Se connecter à Expo**
   ```bash
   npx eas-cli login
   ```
   Entre ton email et mot de passe Expo.

2. **Configurer le projet**
   ```bash
   npx eas-cli build:configure
   ```
   Sélectionne "All" quand demandé.

3. **Créer un APK de test (Preview)**
   ```bash
   npx eas-cli build --platform android --profile preview
   ```

   ⏱️ **Durée** : ~10-15 minutes (build sur les serveurs Expo)

   Une fois terminé, tu recevras :
   - Un lien pour télécharger l'APK
   - Un QR code pour installer directement sur Android

4. **Partager l'APK**
   - Télécharge l'APK depuis le lien
   - Partage-le via email, WeTransfer, Google Drive, etc.
   - Ou partage le QR code pour installation directe

#### Créer un APK de production

Pour la version finale à publier sur Google Play :
```bash
npx eas-cli build --platform android --profile production
```

---

### **Méthode 2 : Build Local (Plus complexe)**

Cette méthode construit l'APK directement sur ton ordinateur.

#### Prérequis
- Android Studio installé
- Android SDK configuré
- Java JDK 17+

#### Étapes

1. **Installer Android Studio**
   - Télécharge depuis : https://developer.android.com/studio
   - Installe le SDK Android (API 34 minimum)

2. **Configurer les variables d'environnement**
   ```bash
   export ANDROID_HOME=$HOME/Android/Sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

3. **Générer le build**
   ```bash
   npx expo run:android --variant release
   ```

4. **Récupérer l'APK**
   L'APK sera dans :
   ```
   android/app/build/outputs/apk/release/app-release.apk
   ```

---

## 🍎 iOS - Créer un IPA

### **Important pour iOS**
⚠️ Pour construire pour iOS, tu as **obligatoirement** besoin de :
- Un **Mac** (macOS)
- Un **compte Apple Developer** (99€/an)
- Xcode installé

### **Méthode : EAS Build**

1. **Se connecter à Expo**
   ```bash
   npx eas-cli login
   ```

2. **Créer un build iOS (Preview)**
   ```bash
   npx eas-cli build --platform ios --profile preview
   ```

   📝 Tu devras fournir :
   - Ton Apple ID
   - Créer un certificat de distribution
   - Créer un profil de provisioning

   ⏱️ **Durée** : ~15-20 minutes

3. **Installer via TestFlight** (Recommandé)

   Pour partager avec des testeurs :
   ```bash
   npx eas-cli submit --platform ios --profile production
   ```

   L'app sera soumise à TestFlight automatiquement.

4. **Ou télécharger l'IPA**

   Tu recevras un lien pour télécharger l'IPA que tu peux installer via :
   - Xcode (sur Mac)
   - Apple Configurator (sur Mac)

---

## 📱 Tester les builds

### Android
1. Active "Sources inconnues" sur ton téléphone Android
2. Télécharge l'APK
3. Ouvre le fichier APK
4. Installe l'app

### iOS
1. **Via TestFlight** (Recommandé)
   - Installe l'app TestFlight depuis l'App Store
   - Utilise le lien d'invitation
   - Installe la beta

2. **Via installation directe** (Complexe)
   - Nécessite Xcode ou Apple Configurator
   - L'appareil doit être enregistré dans le profil de provisioning

---

## 🚀 Publier sur les stores

### Google Play Store (Android)

1. **Créer un compte Google Play Console** (25€ une fois)
   - https://play.google.com/console

2. **Créer un AAB au lieu d'APK**
   ```bash
   npx eas-cli build --platform android --profile production
   ```
   (EAS Build crée automatiquement un AAB pour production)

3. **Uploader dans Google Play Console**
   - Va dans "Release" → "Production"
   - Upload le fichier AAB
   - Remplis les informations (description, screenshots, etc.)
   - Soumets pour review

### Apple App Store (iOS)

1. **Créer un compte Apple Developer** (99€/an)
   - https://developer.apple.com

2. **Créer l'app dans App Store Connect**
   - https://appstoreconnect.apple.com
   - Crée une nouvelle app
   - Bundle ID : `com.timeworth.biosi`

3. **Build et submit**
   ```bash
   npx eas-cli build --platform ios --profile production
   npx eas-cli submit --platform ios --profile production
   ```

4. **Remplir les informations**
   - Screenshots (iPhone et iPad)
   - Description
   - Privacy policy
   - etc.

5. **Soumettre pour review**

---

## 🔧 Configuration In-App Purchases

Avant de publier sur les stores, configure les achats in-app :

### Android (Google Play)
1. Va dans Google Play Console
2. Monetize → Products → In-app products
3. Créer le produit : `premium_theme` à 1€

### iOS (App Store)
1. Va dans App Store Connect
2. Features → In-App Purchases
3. Créer le produit : `com.biosi.premium_theme` à 1€

Voir **IAP_SETUP.md** pour les détails complets.

---

## 💡 Conseils

### Pour tester rapidement
- Utilise **EAS Build Preview** (Android) - c'est rapide et gratuit
- Partage le QR code avec tes testeurs

### Pour production
- Utilise **EAS Build Production**
- Configure les in-app purchases AVANT de publier
- Prépare tes screenshots et descriptions
- Teste sur plusieurs appareils

### Versions
- Incrémente `version` dans `app.json` à chaque release (1.0.0 → 1.0.1)
- Incrémente `versionCode` pour Android (1 → 2)
- Incrémente `buildNumber` pour iOS (1 → 2)

---

## ❓ Dépannage

### "eas command not found"
```bash
npx eas-cli [commande]
```
Utilise `npx` si tu as installé localement.

### Build échoue sur EAS
- Vérifie que `app.json` est bien configuré
- Vérifie les logs d'erreur dans le dashboard Expo
- Assure-toi que toutes les dépendances sont installées

### APK ne s'installe pas sur Android
- Active "Sources inconnues" dans les paramètres Android
- Vérifie que l'APK n'est pas corrompu

### iOS build échoue
- Vérifie ton Apple Developer account
- Assure-toi que les certificats sont valides
- Vérifie que le Bundle ID est unique

---

## 📞 Support

- Documentation Expo : https://docs.expo.dev
- EAS Build : https://docs.expo.dev/build/introduction/
- Expo Forums : https://forums.expo.dev

---

## 🎯 Quick Start (Recommandé)

Pour créer un APK Android rapidement à partager :

```bash
# 1. Se connecter
npx eas-cli login

# 2. Build Preview
npx eas-cli build --platform android --profile preview

# 3. Attendre ~10-15 minutes

# 4. Télécharger l'APK depuis le lien fourni

# 5. Partager l'APK ou le QR code
```

C'est tout ! 🎉

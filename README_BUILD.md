# 🚀 Quick Build Guide - Time Worth App

## 📱 Créer un APK Android (Recommandé pour commencer)

### Méthode rapide (5 minutes de setup + 15 min de build)

1. **Créer un compte Expo (gratuit)**
   - Va sur https://expo.dev
   - Crée un compte gratuit

2. **Se connecter**
   ```bash
   npx eas-cli login
   ```
   Entre ton email et mot de passe Expo.

3. **Lancer le build Android**
   ```bash
   npm run build:android
   ```

4. **Attendre ~10-15 minutes**

   Le build se fait sur les serveurs d'Expo (gratuit pour Android).

5. **Télécharger l'APK**

   Une fois terminé, tu recevras :
   - ✅ Un lien pour télécharger l'APK
   - ✅ Un QR code pour installer directement

6. **Installer sur Android**

   - Active "Sources inconnues" dans les paramètres Android
   - Installe l'APK
   - Ou scanne le QR code

---

## 🍎 Créer un build iOS

**⚠️ Prérequis obligatoires :**
- Un Mac avec macOS
- Compte Apple Developer (99€/an)
- Xcode installé

Si tu as ces prérequis :

```bash
npm run build:ios
```

Sinon, attends d'avoir un Mac et un compte Apple Developer.

---

## 📦 Commandes disponibles

```bash
# Android - Version test
npm run build:android

# Android - Version production
npm run build:android:prod

# iOS - Version test
npm run build:ios

# iOS - Version production
npm run build:ios:prod
```

---

## 🔍 Vérifier le statut du build

1. Va sur https://expo.dev
2. Connecte-toi
3. Clique sur ton projet "biosi"
4. Va dans "Builds"
5. Tu verras le statut du build en temps réel

---

## 💡 Astuces

### Partager l'APK avec des testeurs
- Envoie-leur le lien de téléchargement
- Ou partage le QR code
- L'APK peut être installé sur n'importe quel Android

### Tester avant de publier
- Utilise la version "preview" (npm run build:android)
- C'est plus rapide et gratuit
- Parfait pour les tests

### Publier sur Google Play
- Utilise la version "production" (npm run build:android:prod)
- EAS créera automatiquement un AAB (requis par Google Play)
- Coût : 25€ une fois pour le compte Google Play Developer

---

## ❓ Problèmes fréquents

### "eas: command not found"
✅ Solution : Utilise `npx eas-cli` au lieu de `eas`

### "Not logged in"
✅ Solution : Lance `npx eas-cli login`

### Le build échoue
✅ Vérifie les logs sur expo.dev
✅ Assure-toi que toutes les dépendances sont installées (`npm install`)

---

## 📚 Documentation complète

Pour plus de détails, voir **BUILD_GUIDE.md**

Pour configurer les in-app purchases, voir **IAP_SETUP.md**

---

## 🎯 Résumé

**Pour tester rapidement l'app :**
1. Crée un compte Expo (gratuit)
2. `npx eas-cli login`
3. `npm run build:android`
4. Attends 15 minutes
5. Télécharge et installe l'APK

C'est tout ! 🎉

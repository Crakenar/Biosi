# 🔄 Système de Restauration Automatique Premium

Ce document explique comment fonctionne la restauration automatique des achats premium dans l'app.

## 📱 Comment ça fonctionne

### Au démarrage de l'app

1. **Vérification automatique** : L'app vérifie auprès d'Apple/Google si l'utilisateur a déjà acheté le thème premium
2. **Silencieuse** : Cette vérification se fait en arrière-plan, sans aucune popup
3. **Une seule fois** : La vérification ne se fait qu'une seule fois par session d'app
4. **Si trouvé** : Le thème premium se débloque automatiquement

### Scénarios d'utilisation

#### ✅ **Scénario 1 : Utilisateur existant avec achat**
1. L'utilisateur a acheté le thème sur son ancien iPhone
2. Il achète un nouvel iPhone
3. Il télécharge l'app depuis l'App Store (connecté avec le même Apple ID)
4. Il lance l'app
5. **→ Le thème premium est automatiquement débloqué** ✨

#### ✅ **Scénario 2 : Réinstallation**
1. L'utilisateur désinstalle l'app
2. Il la réinstalle
3. Il lance l'app
4. **→ Le thème premium est automatiquement débloqué** ✨

#### ✅ **Scénario 3 : Plusieurs appareils**
1. L'utilisateur a acheté le thème sur son iPhone
2. Il a aussi un iPad avec le même Apple ID
3. Il installe l'app sur son iPad
4. **→ Le thème premium est automatiquement débloqué sur iPad** ✨

#### ⚠️ **Scénario 4 : Nouvel utilisateur**
1. Nouvel utilisateur qui n'a jamais acheté
2. Il lance l'app pour la première fois
3. **→ Le thème reste verrouillé** (normal)
4. Il peut acheter via le bouton "Débloquer le thème Premium"

## 🔒 Sécurité et Fiabilité

### Comment Apple/Google se souviennent

- **Apple** : Tous les achats sont liés à l'**Apple ID**
  - Stockés dans les serveurs d'Apple
  - Disponibles sur tous les appareils avec le même Apple ID
  - Persistants même après désinstallation

- **Google** : Tous les achats sont liés au **compte Google**
  - Stockés dans les serveurs de Google
  - Disponibles sur tous les appareils avec le même compte Google
  - Persistants même après désinstallation

### Gestion des erreurs

L'app gère intelligemment les cas où la restauration échoue :

- **Pas de connexion internet** : La vérification échoue silencieusement, l'app continue de fonctionner normalement
- **Stores indisponibles** : Aucune erreur affichée, l'utilisateur peut réessayer plus tard
- **En développement** : Pas d'erreur si l'app n'est pas configurée avec les stores

## 🛠️ Implémentation technique

### Hook `usePremiumRestore`

```typescript
// S'exécute au démarrage de l'app
usePremiumRestore();
```

**Logique** :
1. Vérifie si déjà premium → Skip
2. Vérifie si déjà vérifié cette session → Skip
3. Appelle `iapService.restorePurchases()`
4. Si achat trouvé → Débloque premium automatiquement
5. Marque comme vérifié pour cette session

### Service IAP

```typescript
async restorePurchases(): Promise<boolean> {
  // Demande à Apple/Google la liste des achats
  const purchases = await RNIap.getAvailablePurchases();

  // Vérifie si le thème premium est dans la liste
  const hasPremium = purchases.some(
    (purchase) => purchase.productId === PREMIUM_PRODUCT_ID
  );

  return hasPremium;
}
```

## 🎯 Restauration manuelle (backup)

Si pour une raison quelconque la restauration automatique ne fonctionne pas, l'utilisateur peut toujours :

1. Aller dans **Paramètres → Thèmes**
2. Cliquer sur **"Thème Financial"**
3. Sur l'écran Premium, cliquer sur **"Restaurer l'achat"**

Cette option manuelle :
- Fait la même vérification
- Affiche un message de succès/échec
- Utile si l'utilisateur a des doutes

## 📊 Logs de débogage

Pour déboguer, regarde les logs de la console :

```
✅ Succès :
"Checking for previous premium purchases..."
"Premium purchase found! Unlocking premium theme..."

❌ Pas d'achat :
"Checking for previous premium purchases..."
"No premium purchase found."

⚠️ Erreur :
"Error checking premium status: [error details]"
```

## ✨ Avantages pour l'utilisateur

1. **Aucune action requise** : Le thème se débloque automatiquement
2. **Pas de popup** : Expérience fluide et transparente
3. **Fonctionne partout** : Tous les appareils avec le même compte
4. **Pas de mot de passe** : Pas besoin de se reconnecter
5. **Fiable** : Géré par Apple et Google, pas par notre app

## 🚀 Test en développement

Pour tester la restauration automatique :

### iOS (Sandbox)
1. Créer un compte sandbox tester dans App Store Connect
2. Faire un achat test sur un simulateur/appareil
3. Désinstaller l'app
4. Réinstaller l'app
5. **→ Le thème devrait se débloquer automatiquement**

### Android (License Testing)
1. Ajouter un compte de test dans Google Play Console
2. Faire un achat test
3. Désinstaller l'app
4. Réinstaller l'app
5. **→ Le thème devrait se débloquer automatiquement**

## ⚡ Performance

- **Rapide** : La vérification prend ~1-2 secondes
- **Non-bloquante** : L'app reste utilisable pendant la vérification
- **Optimisée** : Une seule vérification par session d'app
- **Mise en cache** : Le statut premium est sauvegardé localement

## 🔄 Mise à jour du statut

Le statut premium est stocké dans AsyncStorage :
```typescript
settings: {
  isPremium: true // ou false
}
```

Une fois restauré, ce statut persiste localement jusqu'à :
- Désinstallation de l'app
- Suppression des données de l'app
- Changement d'appareil

Dans ces cas, la restauration automatique se relance au prochain démarrage.

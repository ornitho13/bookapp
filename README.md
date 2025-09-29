# BookApp

Application React Native pour indexer et lire des livres audio/ebooks stockés localement sur un appareil Android (Android 10+ recommandé).

## Fonctionnalités actuelles

- Sélection d'un ou plusieurs dossiers sources via le Storage Access Framework.
- Analyse des fichiers audio (MP3, M4A, M4B, AAC, WAV) et ebooks (EPUB, PDF) grâce à `react-native-fs`.
- Persistance locale des paramètres et favoris avec AsyncStorage.
- Navigation multi-écran : bibliothèque, détail, lecteur audio, lecteur ebook, paramètres.
- Lecteur audio s'appuyant sur `react-native-track-player` (lecture/pause, progression).
- Prévisualisation du lecteur ebook avec gestion du thème et de la taille de police.

## Démarrage du projet

> ⚠️ Les dépendances NPM ne sont pas installées automatiquement dans cet environnement.

1. Installez les dépendances :
   ```bash
   npm install
   ```
2. Lancez Metro bundler :
   ```bash
   npm run start
   ```
3. Dans un second terminal, lancez l'application Android :
   ```bash
   npm run android
   ```

## Structure

```
src/
  components/    -> Composants UI réutilisables (cartes, listes)
  context/       -> Contexte global (bibliothèque, paramètres)
  navigation/    -> Navigation principale (stack)
  screens/       -> Écrans clés (bibliothèque, lecteur audio/ebook, paramètres)
  services/      -> Accès fichiers, persistance, playback
  types/         -> Types partagés
```

## Étapes suivantes suggérées

- Implémenter une base de données locale (SQLite) pour la persistance avancée des livres et progrès.
- Extraire les métadonnées (ID3, EPUB OPF) pour enrichir les fiches.
- Gérer la reprise automatique de lecture audio et le suivi des progrès.
- Intégrer un moteur de rendu EPUB complet (`epubjs-rn`) et un lecteur PDF (`react-native-pdf`).
- Ajouter des tests unitaires (Jest) et end-to-end (Detox).

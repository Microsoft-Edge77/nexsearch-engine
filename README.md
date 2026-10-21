# NexSearch

NexSearch est un moteur de recherche au design **Metro / Windows 8.1** : écran d’accueil à tuiles dynamiques, animations turnstile, typographie Segoe UI et couleur d’accent personnalisable. Il fonctionne sur mobile, tablette et ordinateur.

## Fonctionnalités

- **Accueil** : heure, date, logo, barre de recherche et tuiles classées en « Aujourd’hui » (météo géolocalisée, horloge, image du jour, paysages, photos incroyables), « À la une » (live tiles des médias), « Explorer » (Wikipédia, carte, calculatrice, traducteur, minuteur) et « Récemment » (recherches précédentes).
- **Résultats** : onglets web, images, vidéos, actualités, shopping et cartes ; AI Overview avec sources ; aperçu Wikipédia ; un résultat sur quatre en live tile qui se retourne pour montrer le site.
- **Outils intégrés** : tapez « calculatrice », « traducteur » ou « minuteur 5 min » (ou un calcul comme `12*(3+4)`).
- **Visionneuse d’images** : défilement (flèches, clavier, swipe), téléchargement, accès au site, taille réelle.
- **Paramètres** : couleur d’accent, AI Overview activé/désactivé, fond d’écran flouté, historique local supprimable.

## Technologies

TanStack Start (React 19), Tailwind CSS 4, lucide-react, déploiement Netlify (Image CDN). Données en direct côté navigateur : Open-Meteo (météo), Wikipédia (aperçu), Nominatim + OpenStreetMap (cartes), MyMemory (traduction).

## Lancer en local

```bash
pnpm install
pnpm dev            # http://localhost:3000
# ou, avec l’émulation Netlify (Image CDN) :
netlify dev
```

## Feuille de route

Les résultats web, images, vidéos, actualités, shopping et la synthèse IA utilisent pour l’instant des données d’exemple (`src/lib/fixtures.ts`). Les prochaines étapes — recherche Bing + DuckDuckGo, classement et AI Overview par l’IA, actualités Google News / MSN, image Bing du jour, Amazon — sont détaillées dans [PLAN.md](PLAN.md).

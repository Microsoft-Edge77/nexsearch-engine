# NexSearch — feuille de route

NexSearch est un moteur de recherche au design Metro / Windows 8.1. Le produit est construit par étapes : d’abord toute l’interface visible et cliquable, puis, étape par étape, le branchement des vraies sources de résultats et de l’IA.

Toutes les données d’exemple sont centralisées dans `src/lib/fixtures.ts`. Chaque générateur (`getWebResults`, `getAiOverview`, `getImageResults`, `getVideoResults`, `getNewsResults`, `getShoppingResults`, `MEDIA_TILES`, `DAILY_IMAGE`) sera remplacé par un appel serveur sans changer l’interface.

## Étape 1 — Interface Metro complète ✅

- Écran d’accueil : logo, « NexSearch », heure, date, barre de recherche, groupes de tuiles « Aujourd’hui », « À la une », « Explorer », « Récemment ».
- Tuiles dynamiques (flip, peek, diaporama) et animations turnstile.
- Météo réelle par géolocalisation (Open-Meteo), emplacement modifiable.
- Page de résultats : logo, barre de recherche, paramètres, onglets web / images / vidéos / actualités / shopping / cartes.
- AI Overview (exemple), sources, aperçu Wikipédia réel, un résultat sur quatre en live tile avec aperçu du site.
- Visionneuse d’images (défilement, clavier, swipe, téléchargement, site, taille réelle).
- Carte OpenStreetMap intégrée (géocodage Nominatim réel).
- Calculatrice, minuteur et traducteur intégrés.
- Paramètres : couleur d’accent, AI Overview, fond d’écran, historique local supprimable.

## Étape 2 — Recherche web réelle (Bing + DuckDuckGo)

- Fonction serveur `/api/search?q=&tab=web` qui interroge les deux sources en parallèle, fusionne et dédoublonne par URL.
- **Décision à prendre :** l’API officielle Bing Web Search a été retirée par Microsoft en 2025. Il faut choisir un fournisseur qui expose des résultats Bing (agrégateur de SERP) et/ou une API alternative (Brave Search). DuckDuckGo n’a pas d’API web complète : son API Instant Answer peut compléter les résultats.
- Mise en cache des réponses (Netlify Blobs, quelques minutes) pour limiter les coûts.
- Remplacer `getWebResults` par l’appel serveur, avec états de chargement et d’erreur.

## Étape 3 — Classement et AI Overview par l’IA

- Via Netlify AI Gateway (sans clé à gérer) : reclassement par pertinence des résultats fusionnés, puis synthèse « AI Overview » en streaming avec citations numérotées vers les sources.
- Respect du réglage « AI Overview » (pas d’appel si désactivé).
- Remplacer `getAiOverview` et le score « Pertinence IA ».

## Étape 4 — Images et vidéos réelles

- Images et vidéos issues des mêmes fournisseurs (Bing + DuckDuckGo), avec vraies dimensions, miniatures et pages sources.
- Images distantes servies via le Image CDN de Netlify (domaines autorisés dans `netlify.toml`).
- Téléchargement en passant par une fonction proxy (les images distantes ne supportent pas toujours l’attribut `download`).

## Étape 5 — Actualités et « À la une » en direct

- Actualités : flux RSS Google News et MSN analysés côté serveur, filtrables par source.
- Tuiles « À la une » de l’accueil : flux RSS des médias (Le Monde, franceinfo, BBC…), rafraîchis par une fonction planifiée et mis en cache.

## Étape 6 — Image Bing du jour

- Fonction serveur qui lit l’image du jour Bing (HPImageArchive), mise en cache quotidienne.
- Alimente le fond d’écran flouté et la tuile « Image du jour ». Tuiles « Paysages » et « Photos incroyables » alimentées par l’archive des images Bing.

## Étape 7 — Shopping Amazon

- Produits réels via l’API Amazon Product Advertising (nécessite un compte Partenaires Amazon) ; à défaut, conserver les liens de recherche amazon.fr.

## Étape 8 — Finitions

- Traducteur via l’API Microsoft Translator (même moteur que Bing Traducteur).
- Aperçus de sites des live tiles par un service de captures mis en cache.
- Suggestions de recherche en direct, mode PWA installable, audit d’accessibilité.

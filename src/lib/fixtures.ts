/**
 * Demonstration data for NexSearch.
 *
 * Every screen that will later be fed by live search engines (Bing,
 * DuckDuckGo, Google News, MSN, Amazon) or by the AI ranking/summary reads
 * from this module, so a later milestone can swap each generator for a
 * server call without touching the UI.
 */

export const ACCENTS = [
  { name: 'Bleu', value: '#2d89ef' },
  { name: 'Cyan', value: '#1ba1e2' },
  { name: 'Cobalt', value: '#0050ef' },
  { name: 'Indigo', value: '#6a00ff' },
  { name: 'Violet', value: '#aa00ff' },
  { name: 'Magenta', value: '#d80073' },
  { name: 'Cramoisi', value: '#a20025' },
  { name: 'Rouge', value: '#e51400' },
  { name: 'Orange', value: '#fa6800' },
  { name: 'Ambre', value: '#f0a30a' },
  { name: 'Citron vert', value: '#a4c400' },
  { name: 'Vert', value: '#60a917' },
  { name: 'Émeraude', value: '#008a00' },
  { name: 'Sarcelle', value: '#00aba9' },
  { name: 'Brun', value: '#825a2c' },
] as const

export const PHOTOS = {
  daily: '/img/daily.png',
  landscapes: ['/img/landscape-1.png', '/img/landscape-2.png', '/img/landscape-3.png'],
  amazing: ['/img/amazing-1.png', '/img/amazing-2.png', '/img/amazing-3.png'],
  city: '/img/city.png',
}

const ALL_PHOTOS = [
  PHOTOS.daily,
  ...PHOTOS.landscapes,
  ...PHOTOS.amazing,
  PHOTOS.city,
]

export const DAILY_IMAGE = {
  src: PHOTOS.daily,
  title: 'Lever de soleil sur un lac alpin',
  caption: 'Les premiers rayons embrasent les sommets enneigés au-dessus des eaux turquoise.',
}

export const LANDSCAPE_CAPTIONS = [
  'Collines de Toscane, Italie',
  'Plage de sable noir, Islande',
  'Aurore boréale sur un fjord, Norvège',
]

export const AMAZING_CAPTIONS = [
  'Libellule couverte de rosée',
  'Orage nocturne sur un canyon',
  'Montgolfières en Cappadoce',
]

/* ---------- Home: "À la une" media tiles ---------- */

export interface MediaTile {
  media: string
  url: string
  color: string
  size: 'm' | 'w'
  image?: string
  headlines: string[]
}

export const MEDIA_TILES: MediaTile[] = [
  {
    media: 'Le Monde',
    url: 'https://www.lemonde.fr',
    color: '#1a1a1a',
    size: 'w',
    image: PHOTOS.city,
    headlines: [
      'Les villes européennes accélèrent leur transition énergétique',
      'Rentrée culturelle : les expositions à ne pas manquer cet automne',
      'Intelligence artificielle : l’Europe précise ses règles',
    ],
  },
  {
    media: 'franceinfo',
    url: 'https://www.francetvinfo.fr',
    color: '#e3001b',
    size: 'm',
    headlines: [
      'Météo : un automne plus doux que la normale',
      'Les trains de nuit font leur grand retour',
      'Ce qui change au 1er novembre',
    ],
  },
  {
    media: 'BBC News',
    url: 'https://www.bbc.com/news',
    color: '#bb1919',
    size: 'm',
    headlines: [
      'Scientists map the deepest ocean trench in record detail',
      'Electric ferries take to the North Sea',
      'The return of the night sky: dark-sky parks grow',
    ],
  },
  {
    media: 'Le Figaro',
    url: 'https://www.lefigaro.fr',
    color: '#163860',
    size: 'w',
    image: PHOTOS.landscapes[0],
    headlines: [
      'Tourisme : les régions françaises qui séduisent hors saison',
      'Gastronomie : la cuisine de terroir réinventée',
      'Économie : la confiance des ménages se redresse',
    ],
  },
  {
    media: 'Libération',
    url: 'https://www.liberation.fr',
    color: '#e60028',
    size: 'm',
    headlines: [
      'Cinéma : le documentaire français à l’honneur',
      'Les bibliothèques ouvrent le dimanche',
      'Vélo en ville : un usage record',
    ],
  },
  {
    media: '20 Minutes',
    url: 'https://www.20minutes.fr',
    color: '#0076bf',
    size: 'm',
    headlines: [
      'Les applis les plus téléchargées de la semaine',
      'Jeux vidéo : les sorties de l’automne',
      'Astuces pour réduire sa facture de chauffage',
    ],
  },
  {
    media: 'L’Équipe',
    url: 'https://www.lequipe.fr',
    color: '#d6001c',
    size: 'w',
    image: PHOTOS.amazing[2],
    headlines: [
      'Ligue 1 : le choc de la journée tient toutes ses promesses',
      'Tennis : la nouvelle génération frappe fort',
      'Cyclisme : le parcours de la prochaine Grande Boucle dévoilé',
    ],
  },
  {
    media: 'Les Échos',
    url: 'https://www.lesechos.fr',
    color: '#9b1b30',
    size: 'm',
    headlines: [
      'Start-up : la French Tech lève de nouveaux fonds',
      'Bourse : le CAC 40 en légère hausse',
      'Semi-conducteurs : l’Europe investit',
    ],
  },
  {
    media: 'The Verge',
    url: 'https://www.theverge.com',
    color: '#5200ff',
    size: 'm',
    headlines: [
      'The best laptops you can buy right now',
      'Retro design is back in consumer tech',
      'Hands-on with the newest foldable phones',
    ],
  },
  {
    media: 'Reuters',
    url: 'https://www.reuters.com',
    color: '#ff8000',
    size: 'm',
    headlines: [
      'Global markets steady ahead of central bank meetings',
      'Renewables overtake coal in new energy report',
      'Shipping routes adapt to changing climate',
    ],
  },
]

/* ---------- Search: web results ---------- */

export type Engine = 'Bing' | 'DuckDuckGo'

export interface WebResult {
  id: string
  title: string
  url: string
  displayUrl: string
  snippet: string
  engines: Engine[]
  score: number
  color: string
  /** Rendered as a flipping live tile (about one result in four) */
  tile?: boolean
}

const enc = encodeURIComponent

function cap(q: string) {
  return q.charAt(0).toUpperCase() + q.slice(1)
}

export function getWebResults(q: string): WebResult[] {
  const Q = cap(q)
  const slug = enc(Q.replace(/\s+/g, '_'))
  const raw: Omit<WebResult, 'id' | 'tile'>[] = [
    {
      title: `${Q} — Wikipédia`,
      url: `https://fr.wikipedia.org/wiki/${slug}`,
      displayUrl: 'fr.wikipedia.org › wiki',
      snippet: `Article encyclopédique consacré à ${q} : histoire, définitions, contexte et références vérifiées par la communauté Wikipédia.`,
      engines: ['Bing', 'DuckDuckGo'],
      score: 98,
      color: '#3a3a3a',
    },
    {
      title: `${Q} : définition — Dictionnaire Larousse`,
      url: `https://www.larousse.fr/dictionnaires/francais/${enc(q)}`,
      displayUrl: 'larousse.fr › dictionnaires',
      snippet: `Définitions de ${q}, synonymes, expressions et citations dans le dictionnaire de français Larousse.`,
      engines: ['Bing'],
      score: 91,
      color: '#c8102e',
    },
    {
      title: `${Q} — vidéos sur YouTube`,
      url: `https://www.youtube.com/results?search_query=${enc(q)}`,
      displayUrl: 'youtube.com › results',
      snippet: `Reportages, tutoriels et documentaires autour de ${q}, classés par popularité et fraîcheur.`,
      engines: ['Bing', 'DuckDuckGo'],
      score: 88,
      color: '#e62117',
    },
    {
      title: `${Q} — toute l’actualité | Le Monde`,
      url: `https://www.lemonde.fr/recherche/?search_keywords=${enc(q)}`,
      displayUrl: 'lemonde.fr › recherche',
      snippet: `Retrouvez les articles, analyses et enquêtes du Monde consacrés à ${q}.`,
      engines: ['DuckDuckGo'],
      score: 86,
      color: '#1a1a1a',
    },
    {
      title: `${Q} | Britannica`,
      url: `https://www.britannica.com/search?query=${enc(q)}`,
      displayUrl: 'britannica.com › search',
      snippet: `Encyclopaedia Britannica: expert-written overview of ${q} with images, facts and related topics.`,
      engines: ['Bing'],
      score: 84,
      color: '#0d4ea6',
    },
    {
      title: `Discussions sur ${q} — Reddit`,
      url: `https://www.reddit.com/search/?q=${enc(q)}`,
      displayUrl: 'reddit.com › search',
      snippet: `Avis, questions et retours d’expérience de la communauté à propos de ${q}.`,
      engines: ['DuckDuckGo'],
      score: 79,
      color: '#ff4500',
    },
    {
      title: `${Q} — Wiktionnaire`,
      url: `https://fr.wiktionary.org/wiki/${enc(q)}`,
      displayUrl: 'fr.wiktionary.org › wiki',
      snippet: `Étymologie, prononciation et traductions du mot ${q} dans le dictionnaire libre.`,
      engines: ['Bing', 'DuckDuckGo'],
      score: 76,
      color: '#006699',
    },
    {
      title: `${Q} : dossiers et explications — Futura`,
      url: `https://www.futura-sciences.com/recherche/?q=${enc(q)}`,
      displayUrl: 'futura-sciences.com › recherche',
      snippet: `Comprendre ${q} simplement grâce aux dossiers, définitions et actualités scientifiques de Futura.`,
      engines: ['Bing'],
      score: 72,
      color: '#00a3a6',
    },
    {
      title: `Images de ${q} — Wikimedia Commons`,
      url: `https://commons.wikimedia.org/w/index.php?search=${enc(q)}`,
      displayUrl: 'commons.wikimedia.org',
      snippet: `Photographies, illustrations et médias libres de droits liés à ${q}.`,
      engines: ['DuckDuckGo'],
      score: 69,
      color: '#339966',
    },
    {
      title: `Idées et inspirations ${q} — Pinterest`,
      url: `https://www.pinterest.fr/search/pins/?q=${enc(q)}`,
      displayUrl: 'pinterest.fr › search',
      snippet: `Des milliers d’idées visuelles autour de ${q}, sélectionnées par la communauté.`,
      engines: ['Bing'],
      score: 63,
      color: '#bd081c',
    },
    {
      title: `Projets open source « ${q} » — GitHub`,
      url: `https://github.com/search?q=${enc(q)}`,
      displayUrl: 'github.com › search',
      snippet: `Dépôts, code et projets open source mentionnant ${q}.`,
      engines: ['DuckDuckGo'],
      score: 58,
      color: '#24292e',
    },
    {
      title: `${Q} — Le Figaro`,
      url: `https://recherche.lefigaro.fr/recherche/${enc(q)}/`,
      displayUrl: 'lefigaro.fr › recherche',
      snippet: `Toutes les informations et dépêches du Figaro sur ${q}.`,
      engines: ['Bing'],
      score: 55,
      color: '#163860',
    },
  ]
  return raw
    .sort((a, b) => b.score - a.score)
    .map((r, i) => ({ ...r, id: `r${i}`, tile: i % 4 === 2 }))
}

/* ---------- Search: AI Overview ---------- */

export interface AiOverview {
  paragraphs: string[]
  bullets: string[]
  sources: { title: string; url: string }[]
}

const CURATED_OVERVIEWS: Record<string, Omit<AiOverview, 'sources'>> = {
  'windows 8.1': {
    paragraphs: [
      'Windows 8.1 est un système d’exploitation de Microsoft sorti en octobre 2013 comme mise à jour gratuite de Windows 8. Il est célèbre pour son interface « Metro » (Modern UI), basée sur des tuiles dynamiques et une typographie Segoe UI épurée.',
    ],
    bullets: [
      'Retour du bouton Démarrer et démarrage direct sur le Bureau.',
      'Tailles de tuiles supplémentaires et écran d’accueil plus personnalisable.',
      'Support étendu terminé le 10 janvier 2023.',
    ],
  },
  paris: {
    paragraphs: [
      'Paris est la capitale de la France et sa ville la plus peuplée, avec environ 2,1 millions d’habitants intra-muros. Traversée par la Seine, elle est réputée pour son patrimoine, ses musées et sa gastronomie.',
    ],
    bullets: [
      'Monuments emblématiques : tour Eiffel, Louvre, Notre-Dame, Arc de triomphe.',
      'Divisée en 20 arrondissements disposés en spirale.',
      'L’une des villes les plus visitées au monde.',
    ],
  },
  'tour eiffel': {
    paragraphs: [
      'La tour Eiffel est une tour de fer puddlé de 330 mètres construite par Gustave Eiffel pour l’Exposition universelle de 1889, sur le Champ-de-Mars à Paris.',
    ],
    bullets: [
      'Environ 6 à 7 millions de visiteurs par an.',
      'Trois niveaux accessibles au public.',
      'Classée au patrimoine mondial de l’UNESCO avec les rives de la Seine.',
    ],
  },
}

export function getAiOverview(q: string, results: WebResult[]): AiOverview {
  const sources = results.slice(0, 4).map((r) => ({ title: r.title, url: r.url }))
  const curated = CURATED_OVERVIEWS[q.trim().toLowerCase()]
  if (curated) return { ...curated, sources }
  return {
    paragraphs: [
      `D’après les sources les mieux classées par Bing et DuckDuckGo, « ${q} » fait l’objet d’une documentation abondante : des références encyclopédiques et linguistiques en donnent la définition, tandis que les médias et les communautés en ligne en couvrent l’actualité et les usages.`,
    ],
    bullets: [
      `Pour une définition fiable, Wikipédia et le Larousse sont les sources les plus pertinentes.`,
      `L’actualité récente sur ${q} est couverte par la presse française et internationale.`,
      `Des vidéos explicatives et des discussions communautaires complètent ces ressources.`,
    ],
    sources,
  }
}

/* ---------- Search: images, videos, news, shopping ---------- */

export interface ImageResult {
  id: string
  src: string
  title: string
  site: string
  pageUrl: string
  width: number
  height: number
  engine: Engine
}

export function getImageResults(q: string): ImageResult[] {
  const sites = [
    ['wikimedia.org', `https://commons.wikimedia.org/w/index.php?search=${enc(q)}`],
    ['flickr.com', `https://www.flickr.com/search/?text=${enc(q)}`],
    ['unsplash.com', `https://unsplash.com/s/photos/${enc(q)}`],
    ['pexels.com', `https://www.pexels.com/search/${enc(q)}/`],
  ] as const
  return Array.from({ length: 16 }, (_, i) => {
    const [site, pageUrl] = sites[i % sites.length]
    return {
      id: `img${i}`,
      src: ALL_PHOTOS[i % ALL_PHOTOS.length],
      title: `${cap(q)} — photo ${i + 1}`,
      site,
      pageUrl,
      width: i % 3 === 0 ? 1584 : 1376,
      height: i % 3 === 0 ? 672 : 768,
      engine: (i % 2 ? 'DuckDuckGo' : 'Bing') as Engine,
    }
  })
}

export interface VideoResult {
  id: string
  thumb: string
  title: string
  channel: string
  platform: string
  duration: string
  views: string
  url: string
  engine: Engine
}

export function getVideoResults(q: string): VideoResult[] {
  const Q = cap(q)
  const titles = [
    `${Q} : tout comprendre en 10 minutes`,
    `Documentaire — l’histoire de ${q}`,
    `${Q} expliqué simplement`,
    `Les secrets de ${q} enfin révélés`,
    `${Q} : le guide complet`,
    `Reportage : ${q} vu de l’intérieur`,
    `Top 10 des faits étonnants sur ${q}`,
    `${Q} en 4K`,
  ]
  const platforms = [
    ['YouTube', `https://www.youtube.com/results?search_query=${enc(q)}`],
    ['Dailymotion', `https://www.dailymotion.com/search/${enc(q)}`],
    ['Vimeo', `https://vimeo.com/search?q=${enc(q)}`],
  ] as const
  return titles.map((title, i) => {
    const [platform, url] = platforms[i % platforms.length]
    return {
      id: `v${i}`,
      thumb: ALL_PHOTOS[(i + 3) % ALL_PHOTOS.length],
      title,
      channel: ['Savoir+', 'Arte', 'Le Monde', 'Explorer'][i % 4],
      platform,
      duration: ['10:24', '52:10', '6:48', '14:02', '23:37', '41:15', '8:59', '3:12'][i],
      views: ['1,2 M', '340 k', '86 k', '2,4 M', '512 k', '73 k', '960 k', '45 k'][i],
      url,
      engine: (i % 2 ? 'DuckDuckGo' : 'Bing') as Engine,
    }
  })
}

export interface NewsResult {
  id: string
  title: string
  outlet: string
  feed: 'Google News' | 'MSN'
  ago: string
  summary: string
  url: string
  image?: string
}

export function getNewsResults(q: string): NewsResult[] {
  const Q = cap(q)
  const rows: [string, string, NewsResult['feed'], string][] = [
    [`${Q} : ce qu’il faut retenir cette semaine`, 'Le Monde', 'Google News', 'il y a 1 h'],
    [`Pourquoi ${q} fait autant parler de lui`, 'franceinfo', 'MSN', 'il y a 2 h'],
    [`${Q} : les experts livrent leur analyse`, 'Le Figaro', 'Google News', 'il y a 4 h'],
    [`Enquête : les coulisses de ${q}`, 'Libération', 'MSN', 'il y a 6 h'],
    [`${Q}, une tendance qui s’installe`, '20 Minutes', 'Google News', 'il y a 9 h'],
    [`${Q} : the latest developments`, 'Reuters', 'MSN', 'hier'],
    [`Ce que ${q} change pour vous`, 'Ouest-France', 'Google News', 'hier'],
    [`${Q} : chiffres clés et perspectives`, 'Les Échos', 'MSN', 'il y a 2 j'],
  ]
  return rows.map(([title, outlet, feed, ago], i) => ({
    id: `n${i}`,
    title,
    outlet,
    feed,
    ago,
    summary: `${outlet} revient sur ${q} et fait le point sur les dernières informations disponibles, les réactions et les prochaines étapes.`,
    url:
      feed === 'Google News'
        ? `https://news.google.com/search?q=${enc(q)}&hl=fr&gl=FR&ceid=FR:fr`
        : `https://www.msn.com/fr-fr/feed?q=${enc(q)}`,
    image: i % 3 === 0 ? ALL_PHOTOS[(i + 1) % ALL_PHOTOS.length] : undefined,
  }))
}

export interface ShoppingResult {
  id: string
  title: string
  price: string
  oldPrice?: string
  rating: number
  reviews: number
  prime: boolean
  image: string
  url: string
}

export function getShoppingResults(q: string): ShoppingResult[] {
  const Q = cap(q)
  const items = [
    [`${Q} — édition Premium`, '49,99 €', '64,99 €', 4.6, 2312, true],
    [`Pack ${q} découverte`, '24,90 €', undefined, 4.3, 845, true],
    [`${Q} Pro, nouvelle génération`, '129,00 €', '149,00 €', 4.8, 5120, true],
    [`Livre : ${Q}, le guide illustré`, '19,90 €', undefined, 4.5, 412, false],
    [`${Q} — modèle compact`, '34,99 €', undefined, 4.1, 198, true],
    [`Coffret cadeau ${q}`, '59,00 €', '69,00 €', 4.7, 733, false],
    [`${Q} Essentials`, '14,99 €', undefined, 4.0, 1024, true],
    [`${Q} édition collector`, '89,90 €', undefined, 4.9, 287, false],
  ] as const
  return items.map(([title, price, oldPrice, rating, reviews, prime], i) => ({
    id: `p${i}`,
    title,
    price,
    oldPrice,
    rating,
    reviews,
    prime,
    image: ALL_PHOTOS[(i + 5) % ALL_PHOTOS.length],
    url: `https://www.amazon.fr/s?k=${enc(q)}`,
  }))
}

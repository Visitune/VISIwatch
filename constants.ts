import { RiskLevel, SourceType, WatchItem } from './types';

export const CATEGORIES = [
  "Tous",
  "Rappel Produit",
  "Réglementation/Science",
  "International",
  "Alerte Sanitaire",
  "Actualités",
  "Veille"
];

// Sources officielles supportées par nos connecteurs
export const OFFICIAL_SOURCES = [
  { id: 'all', name: 'Toutes les sources', type: 'ALL' },
  { id: 'RappelConso', name: 'RappelConso (France)', type: SourceType.FR_GOV },
  { id: 'EFSA', name: 'EFSA (Global)', type: SourceType.SCIENTIFIC },
  { id: 'AFSCA', name: 'AFSCA (Belgique)', type: SourceType.FR_GOV },
  { id: 'RASFF', name: 'RASFF (Alertes UE)', type: SourceType.EU_RASFF },
  { id: 'FDA', name: 'FDA (USA & Press)', type: SourceType.TRADE },
  { id: 'FSA', name: 'FSA UK (News & Alerts)', type: SourceType.FR_GOV },
  { id: 'FSNews', name: 'Food Safety News', type: SourceType.TRADE },
  { id: 'FoodNav', name: 'Food Navigator', type: SourceType.TRADE },
  { id: 'FSMag', name: 'Food Safety Magazine', type: SourceType.TRADE },
  { id: 'FoodCan', name: 'Food in Canada', type: SourceType.TRADE },
  { id: 'FoodReady', name: 'FoodReady AI', type: SourceType.TRADE },
  { id: 'ANSES', name: 'ANSES (Avis)', type: SourceType.SCIENTIFIC }
];

// Fallback items in case APIs are totally down
export const MOCK_WATCH_ITEMS: WatchItem[] = [
  {
    id: 'system-1',
    title: 'Initialisation du système de veille',
    source: 'Système',
    sourceType: SourceType.FR_GOV,
    date: new Date().toISOString().split('T')[0],
    riskLevel: RiskLevel.LOW,
    category: 'Technique',
    summary: 'Connexion aux flux: EFSA, FoodSafetyNews... Chargement en cours.',
    fullText: 'Chargement en cours...'
  }
];
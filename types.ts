export enum RiskLevel {
  LOW = 'Faible',
  MEDIUM = 'Moyen',
  HIGH = 'Élevé',
  CRITICAL = 'Critique'
}

export enum SourceType {
  FR_GOV = 'Gouv.fr (Galatée/Alim\'confiance)',
  EU_RASFF = 'RASFF (Europe)',
  SCIENTIFIC = 'Scientifique (EFSA/PubChem)',
  TRADE = 'Presse & Syndicats'
}

export interface WatchItem {
  id: string;
  title: string;
  source: string;
  sourceType: SourceType;
  date: string;
  riskLevel: RiskLevel;
  category: string; // e.g., "Microbiologie", "Chimique", "Réglementation"
  summary: string;
  url?: string;
  fullText?: string; // Mock content for AI analysis
}

export interface StatData {
  name: string;
  value: number;
}

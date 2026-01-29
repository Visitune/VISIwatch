import { WatchItem, SourceType, RiskLevel } from '../types';

// ============================================================================
// 1. CONFIGURATION DES SOURCES
// ============================================================================

const API_ENDPOINTS = {
  RAPPEL_CONSO: "https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/rappelconso0/records",
  OPEN_FDA: "https://api.fda.gov/food/enforcement.json"
};

const RSS_FEEDS = {
  // --- France & Europe ---
  EFSA_ALL: {
    url: "https://www.efsa.europa.eu/en/all/rss",
    name: "EFSA (Global)",
    type: SourceType.SCIENTIFIC
  },
  AFSCA_BE: {
    url: "https://favv-afsca.be/fr/rss.xml",
    name: "AFSCA (Belgique)",
    type: SourceType.FR_GOV
  },
  RASFF: { 
    url: "https://webgate.ec.europa.eu/rasff-window/backend/public/consumer/rss/all/", 
    name: "RASFF (Alertes UE)", 
    type: SourceType.EU_RASFF 
  },
  ANSES_AVIS: {
    url: "https://www.anses.fr/fr/rss.xml",
    name: "ANSES (Avis)",
    type: SourceType.SCIENTIFIC
  },

  // --- International & Presse Spécialisée ---
  FDA_PRESS: {
    url: "https://www.fda.gov/about-fda/contact-fda/stay-informed/rss-feeds/press-releases/rss.xml",
    name: "FDA Press Releases",
    type: SourceType.FR_GOV
  },
  FS_NEWS: { 
    url: "https://feeds.feedburner.com/foodsafetynews/mRcs", 
    name: "Food Safety News", 
    type: SourceType.TRADE 
  },
  FOOD_NAV: { 
    url: "https://www.foodnavigator.com/arc/outboundfeeds/rss/", 
    name: "Food Navigator", 
    type: SourceType.TRADE 
  },
  FSA_NEWS: {
    url: "https://www.food.gov.uk/rss-feed/news", 
    name: "FSA UK",
    type: SourceType.FR_GOV
  },
  // --- Nouveaux Flux Activés ---
  FS_MAG: {
    // Flux Topic Food Safety Magazine
    url: "https://www.food-safety.com/rss/topic/296",
    name: "Food Safety Magazine",
    type: SourceType.TRADE
  },
  FOOD_CAN: {
    url: "https://www.foodincanada.com/feed/",
    name: "Food in Canada",
    type: SourceType.TRADE
  },
  FOOD_READY: {
    url: "https://foodready.ai/feed/",
    name: "FoodReady AI",
    type: SourceType.TRADE
  }
};

// ============================================================================
// 2. LOGIQUE MÉTIER & FILTRAGE
// ============================================================================

const determineRiskLevel = (text: string, sourceName: string = ''): RiskLevel => {
  const t = (text || '').toLowerCase();
  
  if ((sourceName.includes('RASFF') || sourceName.includes('CDC') || sourceName.includes('Rappel')) && (t.includes('alert') || t.includes('recall') || t.includes('risk'))) {
    return RiskLevel.CRITICAL;
  }

  if (t.match(/listeria|salmonella|e\. coli|botulism|mort|death|décès|urgent|outbreak|épidémie|recall|rappel|danger/)) return RiskLevel.CRITICAL;
  if (t.match(/allergène|allergen|toxin|poison|lead|plomb|mercury|plastic|glass|metal|pesticide|contamination|foreign/)) return RiskLevel.HIGH;
  if (t.match(/arrêté|décret|règlement|loi|jorf|officiel|directive|avis/)) return RiskLevel.LOW;
  
  return RiskLevel.MEDIUM;
};

const getCategory = (sourceName: string): string => {
  if (sourceName.includes('EFSA') || sourceName.includes('ANSES')) return 'Réglementation';
  if (sourceName.includes('RASFF') || sourceName.includes('Rappel') || sourceName.includes('CDC')) return 'Alerte Sanitaire';
  return 'Actualités';
};

const cleanText = (str: string): string => {
  if (!str) return "Détails non disponibles.";
  try {
      let clean = str.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
      clean = clean.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
      return clean.substring(0, 400) + (clean.length > 400 ? '...' : '');
  } catch (e) { return str; }
};

// ============================================================================
// 3. MOTEUR D'EXTRACTION (PROXY RACE - STRATÉGIE ROBUSTE)
// ============================================================================

// Liste des proxys à tester en parallèle (Course)
const getProxyUrls = (targetUrl: string) => [
    `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`,
    `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`
];

// Helper pour fetcher avec timeout
const fetchWithTimeout = async (url: string, timeout = 15000) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(id);
        return response;
    } catch (error) {
        clearTimeout(id);
        throw error;
    }
};

const fetchRSS = async (feedKey: keyof typeof RSS_FEEDS): Promise<WatchItem[]> => {
    const config = RSS_FEEDS[feedKey];
    const proxies = getProxyUrls(config.url);

    // Fonction de parsing XML unifiée
    const parseXML = (xmlText: string): WatchItem[] => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");
        
        // Support RSS (<item>) et Atom (<entry>)
        const isAtom = xmlDoc.getElementsByTagName("entry").length > 0;
        const nodes = isAtom ? xmlDoc.querySelectorAll("entry") : xmlDoc.querySelectorAll("item");

        return Array.from(nodes).slice(0, 20).map((item, idx) => {
            const title = item.querySelector("title")?.textContent?.trim() || "Information";
            
            // Date parsing
            let date = new Date().toISOString().split('T')[0];
            const rawDate = item.querySelector("pubDate")?.textContent || item.querySelector("date")?.textContent || item.querySelector("updated")?.textContent;
            if (rawDate) {
                const d = new Date(rawDate);
                if (!isNaN(d.getTime())) date = d.toISOString().split('T')[0];
            }

            // Description extraction
            const descRaw = item.querySelector("description")?.textContent || item.querySelector("summary")?.textContent || item.querySelector("content")?.textContent || "";
            const summary = cleanText(descRaw);

            // Link extraction
            let link = item.querySelector("link")?.textContent || "";
            if (!link) {
                 // Atom link handling
                 const linkNode = item.querySelector("link");
                 if (linkNode) link = linkNode.getAttribute("href") || "";
            }

            return {
                id: `rss-${feedKey}-${idx}-${Date.now()}`,
                title,
                source: config.name,
                sourceType: config.type,
                date,
                riskLevel: determineRiskLevel(title + " " + summary, config.name),
                category: getCategory(config.name),
                summary,
                url: link,
                fullText: `TITRE: ${title}\nDATE: ${date}\nSOURCE: ${config.name}\n\n${summary}\n\nLIEN: ${link}`
            };
        });
    };

    // Stratégie "Race" : On lance les requêtes simultanément vers les proxys
    try {
        const fetchPromises = proxies.map(url => 
            fetchWithTimeout(url).then(res => {
                if (!res.ok) throw new Error('Proxy error');
                return res.text();
            })
        );

        // Manual implementation of Promise.any behavior
        const xmlString = await new Promise<string>((resolve, reject) => {
            let errors: any[] = [];
            let rejectedCount = 0;
            if (fetchPromises.length === 0) return reject(new Error("No proxies defined"));
            
            fetchPromises.forEach(p => {
                p.then(resolve).catch(e => {
                    errors.push(e);
                    rejectedCount++;
                    if (rejectedCount === fetchPromises.length) {
                        reject(new Error("All proxies failed"));
                    }
                });
            });
        });

        let items = parseXML(xmlString);
        return items;
    } catch (e) {
        return [];
    }
};

// --- API REST ---

const fetchRappelConso = async (): Promise<WatchItem[]> => {
  try {
    const res = await fetch(`${API_ENDPOINTS.RAPPEL_CONSO}?limit=20&refine=categorie_de_produit:"Alimentation"&order_by=date_de_publication desc`);
    const data = await res.json();
    return data.results.map((item: any, idx: number) => ({
      id: `rc-${idx}-${Date.now()}`,
      title: `${item.nom_de_la_marque_du_produit || 'Produit'} - ${item.noms_des_modeles_ou_references || ''}`,
      source: 'RappelConso',
      sourceType: SourceType.FR_GOV,
      date: item.date_de_publication?.split('T')[0] || new Date().toISOString().split('T')[0],
      riskLevel: determineRiskLevel(item.risques_encourus_par_le_consommateur, 'RappelConso'),
      category: 'Rappel Produit',
      summary: cleanText(item.motif_du_rappel),
      url: "https://rappel.conso.gouv.fr",
      fullText: item.motif_du_rappel
    }));
  } catch (e) { return []; }
};

const fetchOpenFDA = async (): Promise<WatchItem[]> => {
  try {
    const res = await fetch(`${API_ENDPOINTS.OPEN_FDA}?search=status:Ongoing&limit=5&sort=recall_initiation_date:desc`);
    const data = await res.json();
    return data.results.map((item: any, idx: number) => ({
      id: `fda-${idx}-${Date.now()}`,
      title: `Recall (USA): ${item.product_description?.substring(0, 80)}...`,
      source: 'FDA (USA)',
      sourceType: SourceType.TRADE,
      date: item.recall_initiation_date ? `${item.recall_initiation_date.substring(0,4)}-${item.recall_initiation_date.substring(4,6)}-${item.recall_initiation_date.substring(6,8)}` : new Date().toISOString().split('T')[0],
      riskLevel: RiskLevel.HIGH,
      category: 'International',
      summary: cleanText(item.reason_for_recall),
      url: "https://www.fda.gov/safety/recalls-market-withdrawals-safety-alerts",
      fullText: item.reason_for_recall
    }));
  } catch (e) { return []; }
};

// ============================================================================
// 4. EXPORT FINAL
// ============================================================================

export const fetchRealFeed = async (): Promise<WatchItem[]> => {
  const promises = [
    fetchRappelConso(),
    fetchOpenFDA(),
    ...Object.keys(RSS_FEEDS).map(key => fetchRSS(key as keyof typeof RSS_FEEDS))
  ];

  const results = await Promise.allSettled(promises);
  let aggregatedItems: WatchItem[] = [];

  results.forEach(res => {
    if (res.status === 'fulfilled') {
      aggregatedItems = [...aggregatedItems, ...res.value];
    }
  });

  // Déduplication stricte
  const uniqueItems = new Map();
  aggregatedItems.forEach(item => {
      const key = item.title.toLowerCase().trim();
      if (!uniqueItems.has(key)) uniqueItems.set(key, item);
  });

  return Array.from(uniqueItems.values())
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
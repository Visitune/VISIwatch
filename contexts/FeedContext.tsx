import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { WatchItem, RiskLevel } from '../types';
import { fetchRealFeed } from '../services/externalDataService';

interface FeedContextType {
  items: WatchItem[];
  loading: boolean;
  lastUpdated: Date | null;
  refreshFeed: () => Promise<void>;
  stats: {
    totalItems: number;
    criticalCount: number;
    bySource: { name: string; value: number }[];
    byRisk: { name: string; value: number }[];
    byCategory: { name: string; value: number }[];
  };
}

const FeedContext = createContext<FeedContextType | undefined>(undefined);

const CACHE_KEY = 'foodwatch_feed_cache';
const CACHE_TIME_KEY = 'foodwatch_feed_time';

export const FeedProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<WatchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Initialisation : Cache puis Réseau
  useEffect(() => {
    const init = async () => {
      // 1. Charger le cache immédiatement
      const cachedData = localStorage.getItem(CACHE_KEY);
      const cachedTime = localStorage.getItem(CACHE_TIME_KEY);
      
      if (cachedData) {
        try {
          setItems(JSON.parse(cachedData));
          if (cachedTime) setLastUpdated(new Date(cachedTime));
          setLoading(false); // On affiche le cache tout de suite
        } catch (e) {
          console.error("Cache corrupted");
        }
      }

      // 2. Rafraîchir en arrière-plan
      await refreshFeed(false);
    };
    init();
  }, []);

  const refreshFeed = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const data = await fetchRealFeed();
      if (data.length > 0) {
        setItems(data);
        const now = new Date();
        setLastUpdated(now);
        // Mise à jour du cache
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        localStorage.setItem(CACHE_TIME_KEY, now.toISOString());
      }
    } catch (e) {
      console.error("Erreur mise à jour flux:", e);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  // Calcul des statistiques en temps réel (mémoïsé pour la performance)
  const stats = useMemo(() => {
    const totalItems = items.length;
    const criticalCount = items.filter(i => i.riskLevel === RiskLevel.CRITICAL).length;

    // Distribution par Source (Top 5)
    const sourceMap = new Map<string, number>();
    items.forEach(i => sourceMap.set(i.source, (sourceMap.get(i.source) || 0) + 1));
    const bySource = Array.from(sourceMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    // Distribution par Risque
    const riskMap = new Map<string, number>();
    items.forEach(i => riskMap.set(i.riskLevel, (riskMap.get(i.riskLevel) || 0) + 1));
    const byRisk = Array.from(riskMap.entries()).map(([name, value]) => ({ name, value }));

    // Distribution par Catégorie
    const catMap = new Map<string, number>();
    items.forEach(i => catMap.set(i.category, (catMap.get(i.category) || 0) + 1));
    const byCategory = Array.from(catMap.entries()).map(([name, value]) => ({ name, value }));

    return { totalItems, criticalCount, bySource, byRisk, byCategory };
  }, [items]);

  return (
    <FeedContext.Provider value={{ items, loading, lastUpdated, refreshFeed, stats }}>
      {children}
    </FeedContext.Provider>
  );
};

export const useFeed = () => {
  const context = useContext(FeedContext);
  if (context === undefined) {
    throw new Error('useFeed must be used within a FeedProvider');
  }
  return context;
};
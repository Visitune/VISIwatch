import React, { useState, useMemo } from 'react';
import { Search, Filter, Download, ExternalLink, Bot, RefreshCw, Database, Globe, Beaker, ShieldAlert, Newspaper, Radio, Calendar, X } from 'lucide-react';
import { CATEGORIES, OFFICIAL_SOURCES } from '../constants';
import { RiskBadge } from '../components/RiskBadge';
import { WatchItem, RiskLevel } from '../types';
import { useNavigate } from 'react-router-dom';
import { useFeed } from '../contexts/FeedContext';

// Composant Skeleton (Fond Blanc)
const FeedSkeleton = () => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 animate-pulse">
        <div className="flex justify-between mb-4">
            <div className="h-4 bg-gray-100 rounded w-1/4"></div>
            <div className="h-4 bg-gray-100 rounded w-16"></div>
        </div>
        <div className="h-6 bg-gray-100 rounded w-3/4 mb-3"></div>
        <div className="space-y-2 mb-4">
            <div className="h-3 bg-gray-100 rounded w-full"></div>
            <div className="h-3 bg-gray-100 rounded w-5/6"></div>
        </div>
        <div className="flex gap-2">
            <div className="h-8 bg-gray-100 rounded w-24"></div>
            <div className="h-8 bg-gray-100 rounded w-24"></div>
        </div>
    </div>
);

export const WatchFeed: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [selectedRisk, setSelectedRisk] = useState<string>('Tous');
  const [selectedSource, setSelectedSource] = useState<string>('Toutes les sources');
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const { items, loading, refreshFeed, lastUpdated } = useFeed();
  const navigate = useNavigate();

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // 1. Filtre Texte
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.summary.toLowerCase().includes(searchTerm.toLowerCase());
      
      // 2. Filtres Selects
      const matchesCategory = selectedCategory === 'Tous' || item.category === selectedCategory || item.category.includes(selectedCategory);
      const matchesRisk = selectedRisk === 'Tous' || item.riskLevel === selectedRisk;
      const matchesSource = selectedSource === 'Toutes les sources' || 
                            item.source.toLowerCase().includes(selectedSource.split('(')[0].trim().toLowerCase());
      
      // 3. Filtre Date
      let matchesDate = true;
      if (startDate || endDate) {
          const itemDate = new Date(item.date);
          const start = startDate ? new Date(startDate) : null;
          const end = endDate ? new Date(endDate) : null;

          if (start && itemDate < start) matchesDate = false;
          if (end && itemDate > end) matchesDate = false;
      }
      
      return matchesSearch && matchesCategory && matchesRisk && matchesSource && matchesDate;
    });
  }, [searchTerm, selectedCategory, selectedRisk, selectedSource, startDate, endDate, items]);

  const resetFilters = () => {
      setSearchTerm('');
      setSelectedCategory('Tous');
      setSelectedRisk('Tous');
      setSelectedSource('Toutes les sources');
      setStartDate('');
      setEndDate('');
  };

  const handleDownload = (item: WatchItem) => {
    const element = document.createElement("a");
    const file = new Blob([`TITRE: ${item.title}\nSOURCE: ${item.source}\nDATE: ${item.date}\n\nRÉSUMÉ:\n${item.summary}\n\nTEXTE COMPLET:\n${item.fullText}`], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `resume-${item.id}.txt`;
    document.body.appendChild(element);
    element.click();
  };

  const handleAnalyze = (item: WatchItem) => {
    navigate('/analyze', { state: { initialText: item.fullText || item.summary } });
  };

  const getSourceIcon = (sourceName: string) => {
    const s = sourceName.toLowerCase();
    if (s.includes('rappelconso')) return <ShieldAlert className="w-4 h-4 text-blue-600" />;
    if (s.includes('rasff')) return <Radio className="w-4 h-4 text-red-600" />;
    if (s.includes('fda')) return <Globe className="w-4 h-4 text-orange-600" />;
    if (s.includes('science') || s.includes('pmc') || s.includes('anses')) return <Beaker className="w-4 h-4 text-purple-600" />;
    if (s.includes('news')) return <Newspaper className="w-4 h-4 text-emerald-600" />;
    return <Database className="w-4 h-4 text-gray-500" />;
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center">
            Flux de Veille
          </h1>
          <p className="text-gray-500 text-xs md:text-sm flex items-center mt-1 flex-wrap gap-2">
             Agrégateur RSS & API.
             {lastUpdated && <span className="text-gray-400 border-l pl-2">Sync: {lastUpdated.toLocaleTimeString()}</span>}
             <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                {items.length} articles
             </span>
          </p>
        </div>
        <div className="flex gap-3">
            <button 
                onClick={() => refreshFeed()}
                disabled={loading}
                className="flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 hover:bg-gray-50 transition-colors shadow-sm active:scale-95 font-medium w-full md:w-auto text-sm"
            >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Actualiser</span>
            </button>
        </div>
      </div>

      {/* Zone de filtres sticky. Sur mobile, top-0 correspond au haut du scroll container (main), donc sous le header fixe */}
      <div className="bg-white p-4 md:p-5 rounded-xl shadow-sm border border-gray-200 sticky top-0 z-20 space-y-4">
        {/* Barre de recherche */}
        <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Recherche mots-clés (ex: Salmonelle...)"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 placeholder-gray-400 bg-white text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>

        {/* Filtres (Grille adaptée mobile) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
             <div className="space-y-1 col-span-2 md:col-span-1">
                <label className="text-[10px] md:text-xs font-bold text-gray-700 uppercase tracking-wide">Source</label>
                <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    value={selectedSource}
                    onChange={(e) => setSelectedSource(e.target.value)}
                >
                    {OFFICIAL_SOURCES.map(src => (
                    <option key={src.id} value={src.name}>{src.name}</option>
                    ))}
                </select>
             </div>

             <div className="space-y-1">
                <label className="text-[10px] md:text-xs font-bold text-gray-700 uppercase tracking-wide">Catégorie</label>
                <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
             </div>

             <div className="space-y-1">
                <label className="text-[10px] md:text-xs font-bold text-gray-700 uppercase tracking-wide">Risque</label>
                <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    value={selectedRisk}
                    onChange={(e) => setSelectedRisk(e.target.value)}
                >
                    <option value="Tous">Tous</option>
                    {Object.values(RiskLevel).map(risk => <option key={risk} value={risk}>{risk}</option>)}
                </select>
             </div>

             <div className="space-y-1 col-span-2 md:col-span-1">
                <label className="text-[10px] md:text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Période
                </label>
                <div className="flex items-center gap-2">
                    <input 
                        type="date" 
                        className="w-full px-2 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs md:text-sm"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>
             </div>
        </div>

        {/* Résumé Filtres */}
        {(selectedCategory !== 'Tous' || selectedRisk !== 'Tous' || selectedSource !== 'Toutes les sources' || startDate || endDate || searchTerm) && (
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <span className="text-xs text-gray-600 font-medium">
                    {filteredItems.length} résultat(s)
                </span>
                <button 
                    onClick={resetFilters}
                    className="text-xs text-red-600 hover:text-red-800 flex items-center gap-1 font-bold px-2 py-1 rounded hover:bg-red-50 transition-colors"
                >
                    <X className="w-3 h-3" />
                    Effacer
                </button>
            </div>
        )}
      </div>

      <div className="flex-1">
        <div className="space-y-4 pb-10">
          {loading && items.length === 0 && (
              <>
                <FeedSkeleton />
                <FeedSkeleton />
              </>
          )}

          {!loading && filteredItems.length === 0 && (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                <Filter className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-900 font-medium">Aucun résultat ne correspond à vos critères.</p>
                <button onClick={resetFilters} className="text-emerald-600 text-sm mt-4 hover:underline font-bold">
                    Réinitialiser
                </button>
            </div>
          )}

          {filteredItems.map((item) => (
              <div key={item.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 group relative">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                         <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-50 border border-gray-200 text-[10px] font-bold text-gray-700 uppercase tracking-wider">
                            {item.source}
                         </span>
                         <RiskBadge level={item.riskLevel} />
                    </div>
                    <span className="text-xs text-gray-400 font-medium pl-1">
                        {item.date}
                    </span>
                  </div>
                </div>
                
                <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2 leading-snug">
                    {item.title}
                </h3>
                
                <div className="mb-4">
                     <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                        {item.summary}
                     </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                    <div className="flex gap-2 w-full md:w-auto">
                        <button 
                            onClick={() => handleAnalyze(item)}
                            className="flex-1 md:flex-none flex items-center justify-center space-x-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-2 rounded-md hover:bg-emerald-100 transition-colors border border-emerald-100"
                        >
                            <Bot className="w-3.5 h-3.5" />
                            <span>Analyser IA</span>
                        </button>
                        <button 
                            onClick={() => handleDownload(item)}
                            className="flex-none flex items-center justify-center space-x-1.5 text-xs font-bold text-gray-700 bg-white border border-gray-200 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            <Download className="w-3.5 h-3.5" />
                        </button>
                        {item.url && (
                            <a 
                                href={item.url} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="flex-none flex items-center justify-center px-3 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                            >
                                <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                        )}
                    </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
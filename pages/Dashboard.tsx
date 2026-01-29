import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertTriangle, FileCheck, Globe, Activity, Loader, ArrowRight, Bot, ExternalLink } from 'lucide-react';
import { useFeed } from '../contexts/FeedContext';
import { RiskLevel } from '../types';
import { RiskBadge } from '../components/RiskBadge';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#059669', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];
const RISK_COLORS: Record<string, string> = {
  [RiskLevel.LOW]: '#3b82f6',
  [RiskLevel.MEDIUM]: '#f59e0b',
  [RiskLevel.HIGH]: '#f97316',
  [RiskLevel.CRITICAL]: '#ef4444',
};

export const Dashboard: React.FC = () => {
  const { stats, loading, lastUpdated, items } = useFeed();
  const navigate = useNavigate();

  // On récupère les 8 éléments les plus récents pour la liste rapide
  const recentItems = items.slice(0, 8);

  // Cards Data (Nettoyé)
  const statCards = [
    { 
      label: 'Alertes Critiques', 
      value: stats.criticalCount, 
      icon: AlertTriangle, 
      color: 'text-red-600', 
      bg: 'bg-red-50' 
    },
    { 
      label: 'Articles en Veille', 
      value: stats.totalItems, 
      icon: FileCheck, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50' 
    },
    { 
      label: 'Sources Actives', 
      value: stats.bySource.length, 
      icon: Globe, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50' 
    }
  ];

  if (loading && stats.totalItems === 0) {
      return (
          <div className="flex h-full items-center justify-center space-x-3 text-gray-500">
              <Loader className="w-6 h-6 animate-spin" />
              <span>Chargement des données en direct...</span>
          </div>
      );
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord</h1>
          <p className="text-gray-500 mt-1">Vue d'ensemble et dernières entrées du flux.</p>
        </div>
        <div className="text-sm text-gray-500 bg-white px-3 py-1 rounded-md border shadow-sm flex items-center gap-2">
          {loading && <Loader className="w-3 h-3 animate-spin" />}
          Màj: {lastUpdated ? lastUpdated.toLocaleTimeString() : '...'}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
            </div>
            <div className={`p-4 rounded-lg ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique Sources */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Volume par Source (Top 5)</h3>
          <div className="flex-1 min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.bySource}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.bySource.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-2">
            {stats.bySource.map((d, i) => (
              <div key={i} className="flex items-center text-xs text-gray-600">
                <span className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: COLORS[i % COLORS.length] }}></span>
                {d.name} ({d.value})
              </div>
            ))}
          </div>
        </div>

        {/* Graphique Risques */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Répartition des Risques</h3>
          <div className="flex-1 min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.byRisk} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip 
                    cursor={{ fill: '#f3f4f6' }} 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                    {stats.byRisk.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={RISK_COLORS[entry.name] || '#cbd5e1'} />
                    ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Liste des Dernières Alertes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
         <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-gray-500" />
                <h3 className="text-lg font-bold text-gray-900">Dernières Alertes & Publications</h3>
            </div>
            <button 
                onClick={() => navigate('/watch')}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1 group"
            >
                Voir tout le flux
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
         </div>
         
         <div className="divide-y divide-gray-100">
            {recentItems.length === 0 ? (
                <div className="p-8 text-center text-gray-400">Aucune donnée récente disponible.</div>
            ) : (
                recentItems.map((item) => (
                    <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row gap-4 sm:items-center justify-between group">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                    {item.source}
                                </span>
                                <span className="text-xs text-gray-400">{item.date}</span>
                            </div>
                            <h4 className="text-gray-900 font-medium truncate pr-4" title={item.title}>
                                {item.title}
                            </h4>
                        </div>
                        
                        <div className="flex items-center gap-4 shrink-0">
                            <RiskBadge level={item.riskLevel} />
                            
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                    onClick={() => navigate('/analyze', { state: { initialText: item.fullText || item.summary } })}
                                    className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-full border border-transparent hover:border-emerald-100 transition-all"
                                    title="Analyser avec IA"
                                >
                                    <Bot className="w-4 h-4" />
                                </button>
                                {item.url && (
                                    <a 
                                        href={item.url} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full border border-transparent hover:border-blue-100 transition-all"
                                        title="Voir la source"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                ))
            )}
         </div>
         <div className="p-3 bg-gray-50 text-center border-t border-gray-100">
             <span className="text-xs text-gray-400">Affichage des 8 éléments les plus récents</span>
         </div>
      </div>
      
    </div>
  );
};
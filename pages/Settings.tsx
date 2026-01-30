import React, { useState } from 'react';
import { ExternalLink, BookOpen, Globe, FileText, Newspaper, Activity, BrainCircuit, ShieldCheck, List, Search, Key, Save, Eye, EyeOff, Trash2, CheckCircle } from 'lucide-react';
import { useApiKey } from '../contexts/ApiKeyContext';

const DIRECTORY_LINKS = [
  {
    title: "EFSA Publications",
    desc: "Journal officiel et avis scientifiques de l'Autorité Européenne.",
    url: "https://www.efsa.europa.eu/en/publications",
    icon: BookOpen,
    color: "text-blue-600",
    bg: "bg-blue-50"
  },
  {
    title: "RappelConso",
    desc: "Site officiel des alertes de produits dangereux (France).",
    url: "https://rappel.conso.gouv.fr/",
    icon: ShieldCheck,
    color: "text-red-600",
    bg: "bg-red-50"
  },
  {
    title: "RASFF Portal",
    desc: "Portail des alertes rapides pour les denrées alimentaires (UE).",
    url: "https://webgate.ec.europa.eu/rasff-window/screen/search",
    icon: FileText,
    color: "text-yellow-600",
    bg: "bg-yellow-50"
  },
  {
    title: "ANSES",
    desc: "Agence nationale de sécurité sanitaire (Avis & Rapports).",
    url: "https://www.anses.fr/fr",
    icon: Activity,
    color: "text-pink-600",
    bg: "bg-pink-50"
  },
  {
    title: "FDA Food",
    desc: "U.S. Food and Drug Administration (Réglementation & Recalls).",
    url: "https://www.fda.gov/food",
    icon: Globe,
    color: "text-gray-600",
    bg: "bg-gray-100"
  },
  {
    title: "Food Safety News",
    desc: "Actualités internationales sur la sécurité sanitaire.",
    url: "https://www.foodsafetynews.com/",
    icon: Newspaper,
    color: "text-green-600",
    bg: "bg-green-50"
  },
  {
    title: "Food Safety Magazine",
    desc: "Magazine de référence pour les professionnels de la qualité.",
    url: "https://www.food-safety.com/",
    icon: Newspaper,
    color: "text-red-600",
    bg: "bg-red-50"
  },
  {
    title: "Food Navigator",
    desc: "Actualités business et innovations alimentaires (Europe).",
    url: "https://www.foodnavigator.com/",
    icon: Globe,
    color: "text-orange-600",
    bg: "bg-orange-50"
  },
  {
    title: "Food in Canada",
    desc: "Actualités de l'industrie alimentaire canadienne.",
    url: "https://www.foodincanada.com/",
    icon: Globe,
    color: "text-red-500",
    bg: "bg-red-50"
  },
  {
    title: "FoodReady AI",
    desc: "Solutions et actualités sur la conformité alimentaire.",
    url: "https://foodready.ai/",
    icon: BrainCircuit,
    color: "text-purple-600",
    bg: "bg-purple-50"
  },
  {
    title: "FSA UK",
    desc: "Food Standards Agency (Royaume-Uni).",
    url: "https://www.food.gov.uk/",
    icon: ShieldCheck,
    color: "text-emerald-600",
    bg: "bg-emerald-50"
  }
];

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'resources' | 'guide' | 'api'>('api');
  const { apiKey, setApiKey, removeApiKey } = useApiKey();
  const [inputValue, setInputValue] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (inputValue.trim()) {
      setApiKey(inputValue);
      setInputValue('');
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const handleRemove = () => {
    removeApiKey();
    setInputValue('');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Paramètres & Ressources</h1>
        <p className="text-gray-500">Configuration de l'IA et accès aux sources officielles.</p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-4 border-b border-gray-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('api')}
          className={`pb-3 px-1 flex items-center gap-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'api' 
              ? 'border-emerald-600 text-emerald-700' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <Key className="w-4 h-4" />
          Clé API Gemini
        </button>
        <button
          onClick={() => setActiveTab('resources')}
          className={`pb-3 px-1 flex items-center gap-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'resources' 
              ? 'border-emerald-600 text-emerald-700' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <Globe className="w-4 h-4" />
          Annuaire des Sources
        </button>
        <button
          onClick={() => setActiveTab('guide')}
          className={`pb-3 px-1 flex items-center gap-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'guide' 
              ? 'border-emerald-600 text-emerald-700' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Guide d'utilisation
        </button>
      </div>

      {/* CONTENU : API KEY */}
      {activeTab === 'api' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-fade-in max-w-2xl">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-purple-50 rounded-lg text-purple-600">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Configuration de l'IA Gemini</h2>
              <p className="text-sm text-gray-500 mt-1">
                Pour utiliser les fonctions d'analyse (résumés, alertes, plans d'action), vous devez fournir une clé API Google Gemini.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {apiKey ? (
              <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded-full shadow-sm">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-emerald-900">Clé API active</p>
                    <p className="text-xs text-emerald-700">Votre clé est enregistrée localement dans votre navigateur.</p>
                  </div>
                </div>
                <button 
                  onClick={handleRemove}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Supprimer la clé"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 text-sm text-yellow-800">
                <p className="font-medium">Aucune clé configurée.</p>
                <p className="mt-1">L'analyse IA ne fonctionnera pas sans clé valide.</p>
              </div>
            )}

            {!apiKey && (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Entrez votre clé API Gemini</label>
                <div className="relative">
                  <input
                    type={showKey ? "text" : "password"}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                  />
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex justify-between items-center mt-2">
                   <a 
                     href="https://aistudio.google.com/app/apikey" 
                     target="_blank" 
                     rel="noreferrer"
                     className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                   >
                     Obtenir une clé gratuitement <ExternalLink className="w-3 h-3" />
                   </a>
                   <button
                    onClick={handleSave}
                    disabled={!inputValue.trim()}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-colors ${
                      inputValue.trim() ? 'bg-emerald-600 hover:bg-emerald-700 shadow-sm' : 'bg-gray-300 cursor-not-allowed'
                    }`}
                   >
                     <Save className="w-4 h-4" />
                     Enregistrer
                   </button>
                </div>
              </div>
            )}
            
            {saved && (
              <div className="flex items-center gap-2 text-emerald-600 text-sm animate-fade-in justify-end">
                <CheckCircle className="w-4 h-4" />
                <span>Clé enregistrée avec succès !</span>
              </div>
            )}
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-100">
             <p className="text-xs text-gray-400 text-center">
               La clé est stockée uniquement dans la session de votre navigateur (SessionStorage).<br/>
               Elle n'est jamais envoyée à nos serveurs, mais directement à l'API Google.
             </p>
          </div>
        </div>
      )}

      {/* CONTENU : ANNUAIRE */}
      {activeTab === 'resources' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
          <div className="p-6 border-b border-gray-100">
             <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Globe className="w-5 h-5 text-gray-400" />
                Accès Rapide aux Portails Officiels
             </h2>
             <p className="text-sm text-gray-500 mt-1">
               Liens directs pour approfondir vos recherches sur les sites d'origine.
             </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6 bg-gray-50/50">
             {DIRECTORY_LINKS.map((link, idx) => (
               <a 
                  key={idx} 
                  href={link.url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all group"
               >
                  <div className="flex items-start justify-between mb-3">
                     <div className={`p-2 rounded-lg ${link.bg}`}>
                        <link.icon className={`w-5 h-5 ${link.color}`} />
                     </div>
                     <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-gray-500" />
                  </div>
                  <h3 className="font-semibold text-gray-800 text-sm">{link.title}</h3>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    {link.desc}
                  </p>
               </a>
             ))}
          </div>
        </div>
      )}

      {/* CONTENU : GUIDE */}
      {activeTab === 'guide' && (
        <div className="space-y-6 animate-fade-in">

          {/* Section: Comment ça marche */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              Guide d'utilisation
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-700 font-bold text-sm">1</div>
                <div>
                  <h3 className="font-medium text-gray-900">Tableau de Bord</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Visualisez en un coup d'œil les tendances du jour. Les graphiques vous montrent la répartition des alertes par niveau de risque et par source. Utilisez la section "Dernières Alertes" pour une action rapide.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-700 font-bold text-sm">2</div>
                <div>
                  <h3 className="font-medium text-gray-900">Flux de Veille</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Accédez à la liste complète des articles. Utilisez les filtres (Source, Catégorie, Risque) pour cibler votre recherche (ex: "Salmonelle" ou "Listeria").
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-700 font-bold text-sm">3</div>
                <div>
                  <h3 className="font-medium text-gray-900">Analyser avec l'IA</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Sur n'importe quel article, cliquez sur le bouton <span className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-100 mx-1"><BrainCircuit className="w-3 h-3 mr-1"/> Analyser (IA)</span> pour lancer l'assistant intelligent.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Comprendre les Analyses IA */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-blue-600" />
              Interpréter les Analyses IA
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              L'outil d'analyse propose trois modes de lecture pour s'adapter à vos besoins opérationnels :
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <List className="w-4 h-4 text-blue-600" />
                  <h4 className="font-semibold text-gray-900 text-sm">Résumé Simple</h4>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Génère une synthèse concise du texte. Idéal pour comprendre rapidement un long règlement ou un article scientifique complexe sans lire les détails techniques.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <Search className="w-4 h-4 text-orange-600" />
                  <h4 className="font-semibold text-gray-900 text-sm">Analyse d'Impact</h4>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  L'IA joue le rôle d'un consultant. Elle identifie les conséquences concrètes pour une usine (ex: "Mise à jour HACCP requise", "Changement d'étiquetage", "Renforcement contrôles réception").
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:border-emerald-300 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <h4 className="font-semibold text-gray-900 text-sm">Plan d'Action (CAPA)</h4>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Génère une checklist opérationnelle (Actions Correctives et Préventives). Utile pour réagir immédiatement à une alerte sanitaire ou un rappel produit.
                </p>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-100 rounded-md text-xs text-yellow-800 flex gap-2">
               <AlertTriangleIcon className="w-4 h-4 shrink-0" />
               <p>
                 <strong>Avertissement :</strong> L'intelligence artificielle est un outil d'aide à la décision. Les résultats doivent toujours être validés par un expert humain avant toute application réglementaire stricte.
               </p>
            </div>
          </div>

        </div>
      )}
      
      <div className="px-6 py-4 flex justify-between items-center text-xs text-gray-400">
          <span>v1.9.2 (VISIwatch AI)</span>
          <span>© 2024 VISIwatch AI</span>
      </div>
    </div>
  );
};

// Petite icône locale pour l'avertissement
const AlertTriangleIcon = ({className}: {className?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
);
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { BrainCircuit, Play, AlertCircle, Copy, CheckCircle } from 'lucide-react';
import { analyzeRegulation } from '../services/geminiService';

export const Analyzer: React.FC = () => {
  const location = useLocation();
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'summary' | 'impact' | 'action'>('summary');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Check if state was passed via navigation (e.g. from WatchFeed)
    if (location.state && location.state.initialText) {
      setInputText(location.state.initialText);
    }
  }, [location]);

  const handleAnalysis = async () => {
    if (!inputText.trim()) {
        setError("Veuillez entrer du texte à analyser.");
        return;
    }

    setLoading(true);
    setError(null);
    setResult('');

    try {
      // API key is now handled internally via process.env.API_KEY
      const response = await analyzeRegulation(inputText, mode);
      setResult(response);
    } catch (err: any) {
      setError(err.message || "Une erreur s'est produite.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analyseur Intelligent (IA)</h1>
        <p className="text-gray-500">Utilisez Gemini pour synthétiser des textes réglementaires ou évaluer des risques.</p>
      </div>

      {/* Adaptation Mobile: Flex column sur mobile, Grid sur Desktop. Hauteur auto sur mobile, calculée sur desktop. */}
      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 h-auto lg:h-[calc(100vh-220px)]">
        {/* Input Section */}
        <div className="flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px] lg:min-h-0">
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <span className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Texte Source</span>
                <div className="flex space-x-2">
                   <button 
                    onClick={() => setInputText('')}
                    className="text-xs text-gray-500 hover:text-red-600 font-medium"
                   >
                    Effacer
                   </button>
                </div>
            </div>
            <textarea
                className="flex-1 w-full p-4 resize-none focus:outline-none text-sm text-gray-800 font-mono leading-relaxed disabled:bg-gray-50 disabled:text-gray-400"
                placeholder="Collez ici le texte du règlement, de l'alerte ou de l'article scientifique..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
            />
            <div className="p-4 border-t border-gray-100 bg-white">
                <div className="flex flex-col sm:flex-row gap-3">
                    <select 
                        value={mode} 
                        onChange={(e) => setMode(e.target.value as any)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                    >
                        <option value="summary">Résumé Simple</option>
                        <option value="impact">Analyse d'Impact</option>
                        <option value="action">Plan d'Action (CAPA)</option>
                    </select>
                    <button
                        onClick={handleAnalysis}
                        disabled={loading}
                        className={`flex-1 flex items-center justify-center space-x-2 rounded-lg px-4 py-2 text-white font-medium transition-all ${
                            loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md hover:shadow-lg'
                        }`}
                    >
                        {loading ? (
                            <span className="animate-pulse">Analyse en cours...</span>
                        ) : (
                            <>
                                <Play className="w-4 h-4 fill-current" />
                                <span>Lancer l'Analyse</span>
                            </>
                        )}
                    </button>
                </div>
                {error && (
                    <div className="mt-3 text-red-600 text-sm flex items-center bg-red-50 p-2 rounded animate-fade-in">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        <span>{error}</span>
                    </div>
                )}
            </div>
        </div>

        {/* Output Section */}
        <div className="flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative min-h-[400px] lg:min-h-0">
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <BrainCircuit className="w-4 h-4 text-purple-600" />
                    <span className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Résultat Gemini</span>
                </div>
                {result && (
                    <button 
                        onClick={copyToClipboard} 
                        className="text-gray-500 hover:text-emerald-600 transition-colors"
                        title="Copier"
                    >
                        {copied ? <CheckCircle className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                    </button>
                )}
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto bg-gray-50/50">
                {result ? (
                    <div className="prose prose-sm prose-emerald max-w-none text-gray-800 whitespace-pre-wrap leading-7">
                        {result}
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-60">
                        <BrainCircuit className="w-16 h-16 mb-4 stroke-1" />
                        <p className="text-center font-medium">Les résultats de l'analyse IA s'afficheront ici.</p>
                        <p className="text-xs text-center mt-2 max-w-xs">
                           La qualité de l'analyse dépend de la précision du texte fourni.
                        </p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};
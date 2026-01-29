import React from 'react';
import { HashRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { Dashboard } from './pages/Dashboard';
import { WatchFeed } from './pages/WatchFeed';
import { Analyzer } from './pages/Analyzer';
import { Settings } from './pages/Settings';
import { ApiKeyProvider } from './contexts/ApiKeyContext';
import { FeedProvider } from './contexts/FeedContext';

const Layout: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden text-slate-800">
      
      {/* Sidebar Desktop */}
      <Sidebar />

      {/* Header Mobile Fixe */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-sm border-b border-gray-200 z-30 flex items-center px-4 shadow-sm">
         <img
            src="https://raw.githubusercontent.com/M00N69/RAPPELCONSO/main/logo%2004%20copie.jpg"
            alt="Logo"
            className="w-8 h-8 object-contain rounded-md mr-3"
          />
          <div>
            <span className="text-lg font-bold text-gray-800 tracking-tight block leading-none">VISIwatch AI</span>
            <span className="text-[10px] text-emerald-600 font-medium tracking-wide">VEILLE SANITAIRE</span>
          </div>
      </div>

      {/* Main Content Area */}
      {/* Ajout de pt-16 (padding top) pour le header mobile et pb-20 (padding bottom) pour la nav mobile */}
      {/* Sur desktop (md), on annule ces paddings et on applique la marge gauche */}
      <main className="flex-1 overflow-y-auto h-full w-full bg-gray-50
                       pt-16 pb-20 px-4
                       md:ml-64 md:pt-8 md:pb-8 md:px-8">
        <Outlet />
      </main>

      {/* Navigation Mobile Bottom */}
      <MobileNav />

    </div>
  );
};

const App: React.FC = () => {
  return (
    <ApiKeyProvider>
      <FeedProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="watch" element={<WatchFeed />} />
              <Route path="analyze" element={<Analyzer />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </Router>
      </FeedProvider>
    </ApiKeyProvider>
  );
};

export default App;
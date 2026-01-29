import React from 'react';
import { LayoutDashboard, ListFilter, BrainCircuit, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const NavItem = ({ to, icon: Icon, label, active }: { to: string, icon: any, label: string, active: boolean }) => (
  <Link
    to={to}
    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
      active 
        ? 'bg-emerald-100 text-emerald-800 font-medium' 
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`}
  >
    <Icon className="w-5 h-5" />
    <span>{label}</span>
  </Link>
);

export const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <div className="hidden md:flex w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex-col z-30">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <img 
            src="https://raw.githubusercontent.com/M00N69/RAPPELCONSO/main/logo%2004%20copie.jpg" 
            alt="Logo VISIwatch" 
            className="w-10 h-10 object-contain rounded-lg shadow-sm"
          />
          <span className="text-xl font-bold text-gray-800 tracking-tight">VISIwatch AI</span>
        </div>
        <p className="text-xs text-gray-400 mt-2 pl-1">Veille Sanitaire & Réglementaire</p>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        <NavItem 
          to="/" 
          icon={LayoutDashboard} 
          label="Tableau de Bord" 
          active={location.pathname === '/'} 
        />
        <NavItem 
          to="/watch" 
          icon={ListFilter} 
          label="Flux de Veille" 
          active={location.pathname === '/watch'} 
        />
        <NavItem 
          to="/analyze" 
          icon={BrainCircuit} 
          label="Analyse IA" 
          active={location.pathname === '/analyze'} 
        />
      </nav>

      <div className="p-4 border-t border-gray-100">
        <NavItem 
          to="/settings" 
          icon={Settings} 
          label="Paramètres API" 
          active={location.pathname === '/settings'} 
        />
      </div>
    </div>
  );
};
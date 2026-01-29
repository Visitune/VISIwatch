import React from 'react';
import { LayoutDashboard, ListFilter, BrainCircuit, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const MobileNavItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => (
  <NavLink
    to={to}
    className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-200 ${
      isActive ? 'text-emerald-600' : 'text-gray-400 hover:text-gray-600'
    }`}
  >
    <Icon className="w-6 h-6" />
    <span className="text-[10px] font-medium tracking-wide">{label}</span>
  </NavLink>
);

export const MobileNav: React.FC = () => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-16 z-40 flex items-center justify-around px-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pb-safe">
      <MobileNavItem to="/" icon={LayoutDashboard} label="Tableau" />
      <MobileNavItem to="/watch" icon={ListFilter} label="Veille" />
      <MobileNavItem to="/analyze" icon={BrainCircuit} label="IA" />
      <MobileNavItem to="/settings" icon={Settings} label="Options" />
    </div>
  );
};
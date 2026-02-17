
import React from 'react';
import { Sun, Moon, Bell, Search, Menu } from 'lucide-react';
import { AppView } from '../types';

interface HeaderProps {
  activeView: AppView;
  isDarkMode: boolean;
  toggleTheme: () => void;
  onMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeView, isDarkMode, toggleTheme, onMenuToggle }) => {
  return (
    <header className={`
      h-16 flex items-center justify-between px-4 lg:px-6 border-b transition-colors sticky top-0 z-30
      ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}
    `}>
      <div className="flex items-center gap-3 lg:gap-4">
        <button 
          onClick={onMenuToggle}
          className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <Menu size={20} />
        </button>
        <h2 className="font-bold text-base lg:text-xl text-slate-800 dark:text-white capitalize truncate max-w-[150px] lg:max-w-none">
          {activeView}
        </h2>
      </div>

      <div className="flex items-center gap-2 lg:gap-3">
        <div className={`relative hidden sm:block group`}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Procurar..." 
            className={`
              pl-9 pr-4 py-2 rounded-full text-xs border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all sm:w-48 lg:w-64
              ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-100 border-transparent'}
            `}
          />
        </div>

        <button 
          onClick={toggleTheme}
          className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'bg-slate-800 text-yellow-400' : 'bg-slate-100 text-slate-600'}`}
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button className={`p-2 rounded-lg relative ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'}`}>
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-800"></span>
        </button>
      </div>
    </header>
  );
};

export default Header;

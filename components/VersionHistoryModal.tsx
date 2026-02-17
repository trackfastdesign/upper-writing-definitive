
import React, { useEffect } from 'react';
import { X, RotateCcw, Clock, History } from 'lucide-react';
import { ContentItem, ContentVersion } from '../types';

interface VersionHistoryModalProps {
  item: ContentItem;
  onClose: () => void;
  onRestore: (itemId: string, version: ContentVersion) => void;
  isDarkMode: boolean;
}

const VersionHistoryModal: React.FC<VersionHistoryModalProps> = ({ item, onClose, onRestore, isDarkMode }) => {
  // Previne scroll do body quando o modal está aberto
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-0 lg:p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className={`w-full max-w-2xl h-full lg:h-auto lg:max-h-[85vh] overflow-hidden lg:rounded-3xl shadow-2xl flex flex-col ${isDarkMode ? 'bg-slate-900 text-white border border-slate-800' : 'bg-white text-slate-900'}`}>
        <div className="p-4 lg:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-inherit z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl">
              <History size={20} />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-base lg:text-lg truncate">Histórico de Versões</h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[200px] lg:max-w-md font-medium uppercase tracking-widest">{item.title}</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all"
            aria-label="Fechar"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4 custom-scrollbar">
          <div className="p-4 rounded-2xl border-2 border-blue-500 bg-blue-50/50 dark:bg-blue-900/10 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Versão Ativa Agora</span>
              <span className="text-sm font-bold">{item.date}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-full text-[10px] font-black tracking-widest animate-pulse">
              LIVE
            </div>
          </div>

          {!item.versions || item.versions.length === 0 ? (
            <div className="py-20 text-center text-slate-400 italic text-sm flex flex-col items-center gap-3 opacity-50">
              <Clock size={40} />
              <p>Nenhuma versão anterior para restaurar.</p>
            </div>
          ) : (
            item.versions.map((version) => (
              <div 
                key={version.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group ${isDarkMode ? 'border-slate-800 hover:bg-slate-800/50 hover:border-blue-500/30' : 'border-slate-100 hover:bg-slate-50 hover:border-blue-200'}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock size={14} className="text-slate-400" />
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{version.date}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 font-mono leading-relaxed opacity-70">
                    {version.content.substring(0, 150)}...
                  </p>
                </div>
                <button 
                  onClick={() => onRestore(item.id, version)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 dark:bg-blue-600 text-white rounded-xl text-xs font-black transition-all hover:scale-105 active:scale-95 shadow-lg shadow-slate-900/10"
                >
                  <RotateCcw size={16} />
                  RESTAURAR
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-4 lg:p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-center">
          <p className="text-[9px] text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] font-black leading-relaxed">
            A restauração criará um backup automático da versão atual <br className="hidden lg:block" /> no histórico antes de sobrescrever.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VersionHistoryModal;

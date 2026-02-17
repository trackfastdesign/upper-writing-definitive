
import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface NavigationWarningModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  isDarkMode: boolean;
}

const NavigationWarningModal: React.FC<NavigationWarningModalProps> = ({ onConfirm, onCancel, isDarkMode }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className={`w-full max-w-md rounded-2xl shadow-2xl overflow-hidden ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'}`}>
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold">Alterações não salvas</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Você tem trabalho pendente que será perdido se sair agora.</p>
            </div>
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl mb-6">
            <p className="text-sm leading-relaxed">
              Deseja descartar as alterações e continuar ou voltar para salvar seu material?
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={onCancel}
              className={`flex-1 px-4 py-3 rounded-xl font-bold transition-all border ${isDarkMode ? 'border-slate-700 hover:bg-slate-700' : 'border-slate-200 hover:bg-slate-100'}`}
            >
              Voltar e Salvar
            </button>
            <button 
              onClick={onConfirm}
              className="flex-1 px-4 py-3 rounded-xl font-bold bg-rose-600 hover:bg-rose-700 text-white transition-all shadow-lg shadow-rose-600/20"
            >
              Descartar e Sair
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigationWarningModal;

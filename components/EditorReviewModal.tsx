
import React from 'react';
import { X, CheckCircle2, AlertCircle, Info, Hash, Target, MessageCircle } from 'lucide-react';
import { ContentAnalysis } from '../types';

interface EditorReviewModalProps {
  analysis: ContentAnalysis;
  originalContent: string;
  onClose: () => void;
  isDarkMode: boolean;
}

const EditorReviewModal: React.FC<EditorReviewModalProps> = ({ analysis, originalContent, onClose, isDarkMode }) => {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md">
      <div className={`w-full max-w-6xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white'}`}>
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-purple-600 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold">Revisão Editorial & SEO</h2>
              <p className="text-xs opacity-80 uppercase tracking-widest font-bold">Feedback gerado por Gemini 3.0 Flash</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
          {/* Left: Original Text */}
          <div className={`flex-1 p-8 overflow-y-auto border-r ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
            <h3 className="text-sm font-bold uppercase text-slate-400 mb-4 tracking-widest">Texto Original</h3>
            <div className={`prose dark:prose-invert max-w-none whitespace-pre-wrap text-sm leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              {originalContent}
            </div>
          </div>

          {/* Right: AI Feedback */}
          <div className={`flex-1 p-8 overflow-y-auto ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
            <h3 className="text-sm font-bold uppercase text-slate-400 mb-6 tracking-widest">Feedback da IA</h3>
            
            <div className="space-y-8">
              {/* Titles Section */}
              <section>
                <div className="flex items-center gap-2 mb-4 text-purple-600 dark:text-purple-400">
                  <Hash size={20} />
                  <h4 className="font-bold">Sugestões de Títulos (H1)</h4>
                </div>
                <div className="space-y-2">
                  {analysis.titles.map((t, idx) => (
                    <div key={idx} className={`p-3 rounded-xl border text-sm font-medium ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-800'}`}>
                      {t}
                    </div>
                  ))}
                </div>
              </section>

              {/* Meta Description Section */}
              <section>
                <div className="flex items-center gap-2 mb-4 text-blue-600 dark:text-blue-400">
                  <Target size={20} />
                  <h4 className="font-bold">Meta Description (SEO)</h4>
                </div>
                <div className={`p-4 rounded-xl text-sm italic border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-600'}`}>
                  {analysis.metaDescription}
                </div>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tone of Voice */}
                <section>
                  <div className="flex items-center gap-2 mb-3 text-emerald-600 dark:text-emerald-400">
                    <MessageCircle size={18} />
                    <h4 className="font-bold text-sm">Tom de Voz</h4>
                  </div>
                  <div className={`px-3 py-2 rounded-lg text-xs font-bold uppercase ${isDarkMode ? 'bg-slate-800 text-emerald-400 border border-emerald-900/30' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'}`}>
                    {analysis.toneOfVoice}
                  </div>
                </section>

                {/* Fact Checking */}
                <section>
                  <div className="flex items-center gap-2 mb-3 text-amber-600 dark:text-amber-400">
                    <AlertCircle size={18} />
                    <h4 className="font-bold text-sm">Fact-Checking</h4>
                  </div>
                  <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {analysis.factCheck}
                  </p>
                </section>
              </div>

              {/* General Suggestions */}
              <section className={`p-5 rounded-2xl border-l-4 border-purple-500 ${isDarkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div className="flex items-center gap-2 mb-3 text-purple-600">
                  <Info size={18} />
                  <h4 className="font-bold text-sm uppercase tracking-wide">Considerações do Editor</h4>
                </div>
                <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  {analysis.suggestions}
                </p>
              </section>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`p-4 border-t text-center ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
          <button 
            onClick={onClose}
            className="px-8 py-2 bg-slate-800 text-white dark:bg-slate-700 rounded-full font-bold hover:bg-slate-700 transition-all text-sm"
          >
            Fechar Análise
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditorReviewModal;

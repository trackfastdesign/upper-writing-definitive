
import React, { useState } from 'react';
import { 
  Wand2, 
  Twitter, 
  Instagram, 
  Youtube, 
  Linkedin, 
  Copy, 
  Check, 
  Loader2, 
  ArrowRight,
  FileText,
  Share2
} from 'lucide-react';
import { repurposeContent } from '../services/geminiService';
import { RepurposedContent } from '../types';

interface RepurposingPaneProps {
  isDarkMode: boolean;
}

const RepurposingPane: React.FC<RepurposingPaneProps> = ({ isDarkMode }) => {
  const [sourceText, setSourceText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<RepurposedContent | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleTransform = async () => {
    if (!sourceText.trim()) return;
    setIsLoading(true);
    try {
      const repurposed = await repurposeContent(sourceText);
      setResults(repurposed);
    } catch (error) {
      console.error(error);
      alert('Erro ao processar o conteúdo. Verifique sua conexão e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const PlatformCard = ({ 
    title, 
    icon: Icon, 
    content, 
    colorClass, 
    bgClass, 
    id 
  }: { 
    title: string; 
    icon: any; 
    content: string | string[]; 
    colorClass: string; 
    bgClass: string;
    id: string;
  }) => {
    const isThread = Array.isArray(content);
    const fullText = isThread ? content.join('\n\n') : content;

    return (
      <div className={`p-6 rounded-3xl border transition-all ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200 shadow-sm'} flex flex-col h-full`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${bgClass} ${colorClass}`}>
              <Icon size={20} />
            </div>
            <h4 className="font-bold text-sm tracking-tight">{title}</h4>
          </div>
          <button 
            onClick={() => copyToClipboard(fullText, id)}
            className={`p-2 rounded-lg transition-all ${copiedId === id ? 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'text-slate-400 hover:text-blue-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
          >
            {copiedId === id ? <Check size={18} /> : <Copy size={18} />}
          </button>
        </div>

        <div className={`flex-1 overflow-y-auto custom-scrollbar text-sm leading-relaxed pr-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
          {isThread ? (
            <div className="space-y-4">
              {content.map((tweet, i) => (
                <div key={i} className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
                  <p>{tweet}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="whitespace-pre-wrap">{content}</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Input Section */}
      <div className={`p-8 rounded-3xl border transition-all ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-purple-600 text-white rounded-2xl shadow-lg shadow-purple-500/20">
            <Wand2 size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold">Multi-Format Magic</h2>
            <p className={`text-xs font-bold uppercase tracking-[0.2em] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              Um conteúdo, quatro plataformas em segundos
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="relative">
            <textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="Cole aqui seu artigo, roteiro ou texto original longo..."
              rows={8}
              className={`w-full p-6 rounded-3xl border outline-none focus:ring-4 focus:ring-purple-500/20 transition-all text-sm leading-relaxed resize-none ${
                isDarkMode ? 'bg-slate-900 border-slate-700 text-white placeholder:text-slate-600' : 'bg-slate-50 border-slate-200 placeholder:text-slate-400'
              }`}
            />
            {!results && !isLoading && !sourceText && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                <FileText size={80} />
              </div>
            )}
          </div>

          <button
            onClick={handleTransform}
            disabled={isLoading || !sourceText.trim()}
            className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-2xl font-bold shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Wand2 size={20} />}
            <span>{isLoading ? 'TRANSFORMANDO CONTEÚDO...' : 'TRANSFORMAR AGORA'}</span>
            {!isLoading && <ArrowRight size={18} />}
          </button>
        </div>
      </div>

      {/* Results Section */}
      {results && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <PlatformCard 
            id="twitter"
            title="Thread para X / Twitter" 
            icon={Twitter} 
            content={results.twitterThread} 
            colorClass="text-slate-900 dark:text-white" 
            bgClass="bg-slate-100 dark:bg-slate-700"
          />
          <PlatformCard 
            id="instagram"
            title="Legenda Instagram" 
            icon={Instagram} 
            content={results.instagramCaption} 
            colorClass="text-pink-600" 
            bgClass="bg-pink-50 dark:bg-pink-900/20"
          />
          <PlatformCard 
            id="youtube"
            title="Script p/ Shorts & TikTok" 
            icon={Youtube} 
            content={results.youtubeShortsScript} 
            colorClass="text-red-600" 
            bgClass="bg-red-50 dark:bg-red-900/20"
          />
          <PlatformCard 
            id="linkedin"
            title="LinkedIn Executive Summary" 
            icon={Linkedin} 
            content={results.linkedInSummary} 
            colorClass="text-blue-700" 
            bgClass="bg-blue-50 dark:bg-blue-900/20"
          />
        </div>
      )}

      {!results && !isLoading && (
        <div className="py-12 flex flex-col items-center justify-center text-center opacity-30 grayscale">
          <Share2 size={60} className="mb-4 text-slate-400" />
          <p className="max-w-xs text-sm font-medium">Os seus conteúdos adaptados aparecerão aqui após a transformação.</p>
        </div>
      )}
    </div>
  );
};

export default RepurposingPane;

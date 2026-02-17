
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Save, 
  Sparkles, 
  Globe, 
  CheckCircle2, 
  Video, 
  Tag as TagIcon,
  Loader2,
  X,
  Eye,
  Layout,
  ChevronLeft,
  Clock,
  Printer,
  FileText,
  Wand2,
  BookOpen,
  Maximize2,
  Minimize2,
  History,
  ClipboardList
} from 'lucide-react';
import { AppView, ContentItem, ContentStatus, ContentAnalysis } from '../types';
import { 
  analyzeContent, 
  searchGrounding, 
  generateCreativeContent 
} from '../services/geminiService';
import EditorReviewModal from './EditorReviewModal';
import VideoGenerationModal from './VideoGenerationModal';

interface EditorPaneProps {
  type: AppView;
  initialItem: ContentItem | null;
  onSave: (item: ContentItem) => void;
  setHasUnsavedChanges: (hasChanges: boolean) => void;
  isDarkMode: boolean;
}

const EditorPane: React.FC<EditorPaneProps> = ({ 
  type, 
  initialItem, 
  onSave, 
  setHasUnsavedChanges, 
  isDarkMode 
}) => {
  const [content, setContent] = useState(initialItem?.content || '');
  const [title, setTitle] = useState(initialItem?.title || '');
  const [prompt, setPrompt] = useState('');
  const [status, setStatus] = useState<ContentStatus>(initialItem?.status || ContentStatus.DRAFT);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isStoryboardMode, setIsStoryboardMode] = useState(type === AppView.VIDEO_SCRIPTS);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  const [analysis, setAnalysis] = useState<ContentAnalysis | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  useEffect(() => {
    if (initialItem) {
      setContent(initialItem.content);
      setTitle(initialItem.title);
      setStatus(initialItem.status);
    } else {
      setContent('');
      setTitle('');
      setStatus(ContentStatus.DRAFT);
    }
    setHasUnsavedChanges(false);
  }, [initialItem, type, setHasUnsavedChanges]);

  // Prevent scroll on body when focus mode is active
  useEffect(() => {
    if (isFocusMode) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isFocusMode]);

  // Exit focus mode on Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFocusMode) setIsFocusMode(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isFocusMode]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    const item: ContentItem = {
      id: initialItem?.id || Date.now().toString(),
      title: title || 'Sem Título',
      content,
      type,
      status,
      date: new Date().toLocaleString(),
      tags: initialItem?.tags || [type.split(' ')[0]],
      versions: initialItem?.versions || []
    };
    onSave(item);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    const systemInstruction = `Você é um redator especialista em ${type}. Gere conteúdo premium e otimizado. Use Markdown.`;
    
    try {
      await generateCreativeContent(prompt, systemInstruction, (text) => {
        setContent(text);
        setHasUnsavedChanges(true);
      });
      if (window.innerWidth < 1024) setShowPreview(true);
      setPrompt('');
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSearch = async () => {
    if (!title && !content) return;
    setIsSearching(true);
    try {
      const query = title || content.substring(0, 100);
      const result = await searchGrounding(query);
      setContent(prev => prev + "\n\n---\n### Notas de Pesquisa (Grounding)\n" + result.text);
      setHasUnsavedChanges(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div 
      className={`flex flex-col h-full gap-3 sm:gap-4 relative transition-all duration-500 ease-in-out
        ${isFocusMode 
          ? 'fixed inset-0 z-[200] bg-slate-50 dark:bg-slate-950 p-4 lg:p-12 animate-in fade-in' 
          : ''}`}
    >
      {/* Header Info - Oculto no Modo Foco */}
      {!isFocusMode && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print px-1">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsFocusMode(true)}
              className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition-colors"
              title="Entrar no Modo Foco"
            >
              <Maximize2 size={18} />
            </button>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">Editor Ativo</span>
              <h1 className={`text-sm font-bold truncate max-w-[200px] sm:max-w-md ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {title || 'Documento sem título'}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3 self-end sm:self-auto">
             <div className="flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full shadow-sm">
                <div className={`w-2 h-2 rounded-full ${status === ContentStatus.PUBLISHED ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{status}</span>
             </div>
             <button className="p-2 text-slate-400 hover:text-blue-500 transition-colors" title="Exportar">
                <Printer size={18} />
             </button>
          </div>
        </div>
      )}

      {/* Main Toolbar - SEMPRE VISÍVEL mas estilizada no foco */}
      <div 
        className={`sticky top-0 z-[210] flex items-center gap-2 py-2 overflow-x-auto no-scrollbar transition-all no-print px-1
          ${isFocusMode 
            ? (isDarkMode ? 'bg-slate-950/80 backdrop-blur border-b border-slate-800 mb-8' : 'bg-slate-50/80 backdrop-blur border-b border-slate-200 mb-8') 
            : ''}`}
      >
        <div className={`flex items-center gap-1 p-1 rounded-xl border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100 shadow-sm'}`}>
          <button onClick={handleSave} className="p-2.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 rounded-lg transition-all" title="Salvar Agora"><Save size={18} /></button>
          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>
          <button onClick={handleSearch} disabled={isSearching} className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 rounded-lg transition-all" title="Pesquisa Grounding">
            {isSearching ? <Loader2 size={18} className="animate-spin" /> : <Globe size={18} />}
          </button>
          <button onClick={() => { setIsAnalyzing(true); analyzeContent(content).then(r => { setAnalysis(r); setShowReviewModal(true); setIsAnalyzing(false); }); }} disabled={isAnalyzing} className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 rounded-lg transition-all" title="Análise Editorial">
            {isAnalyzing ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
          </button>
        </div>

        <div className={`flex items-center gap-1 p-1 rounded-xl border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100 shadow-sm'}`}>
          <button 
            onClick={() => setIsStoryboardMode(!isStoryboardMode)} 
            className={`p-2.5 rounded-lg transition-all ${isStoryboardMode ? 'bg-rose-500 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
            title="Alternar Modo Storyboard"
          >
            {isStoryboardMode ? <Layout size={18} /> : <ClipboardList size={18} />}
          </button>
          {type === AppView.VIDEO_SCRIPTS && (
            <button onClick={() => setShowVideoModal(true)} className="p-2.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all" title="Produzir com Veo">
              <Video size={18} />
            </button>
          )}
        </div>

        <div className="flex-1"></div>

        {isFocusMode && (
          <button
            onClick={() => setIsFocusMode(false)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:scale-105 transition-all"
          >
            <Minimize2 size={14} /> Sair do Foco
          </button>
        )}
      </div>

      {/* Main Layout Grid */}
      <div 
        className={`grid gap-4 flex-1 min-h-0 overflow-hidden mb-4 transition-all duration-500
          ${isFocusMode ? 'grid-cols-1 max-w-4xl mx-auto w-full' : 'grid-cols-1 lg:grid-cols-2'}`}
      >
        
        {/* Lado Esquerdo: Redação & Gemini Assistant */}
        <div className={`flex flex-col gap-3 sm:gap-4 min-h-0 ${!isFocusMode && showPreview ? 'hidden lg:flex' : 'flex'}`}>
          
          {/* Gemini Assistant - Integrado */}
          <div 
            className={`p-5 sm:p-6 rounded-[2rem] sm:rounded-[2.5rem] border relative overflow-hidden transition-all duration-500
              ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-900 border-slate-900 shadow-2xl'}
              ${isFocusMode ? 'opacity-30 hover:opacity-100 focus-within:opacity-100 mb-4' : 'opacity-100'}`}
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Sparkles size={100} className="text-white" />
            </div>
            
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500 rounded-xl text-white shadow-lg">
                  <Wand2 size={18} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-xs sm:text-sm tracking-tight">Gemini Creative Engine</h3>
                  <p className="text-[9px] text-blue-400 uppercase font-black tracking-widest">IA Generativa 3.0 Active</p>
                </div>
              </div>

              <div className="flex gap-2">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Instrua a IA sobre o que redigir agora..."
                  rows={2}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-white text-xs sm:text-sm outline-none focus:ring-4 focus:ring-blue-500/20 placeholder:text-white/20 resize-none transition-all"
                />
                <button 
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt}
                  className={`px-4 sm:px-6 rounded-xl sm:rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${isGenerating ? 'bg-slate-800 text-slate-500' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-500/20 active:scale-95'}`}
                >
                  {isGenerating ? <Loader2 size={18} className="animate-spin" /> : 'Gerar'}
                </button>
              </div>
            </div>
          </div>

          {/* Campo de Redação / Storyboard */}
          <div className={`flex-1 rounded-2xl sm:rounded-[2.5rem] border overflow-hidden flex flex-col transition-all duration-500 ${isDarkMode ? 'bg-slate-800/40 border-slate-700' : 'bg-white border-slate-200 shadow-sm'} ${isFocusMode ? 'border-transparent shadow-none' : ''}`}>
            {!isFocusMode && (
              <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between no-print">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Canal de Redação</span>
                </div>
                <button onClick={() => setShowPreview(true)} className="lg:hidden flex items-center gap-2 text-[10px] font-black uppercase text-blue-600">Ver Artefato <Eye size={12} /></button>
              </div>
            )}
            
            <div className="flex-1 relative overflow-hidden flex flex-col">
              {isStoryboardMode ? (
                <div className={`flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar ${isFocusMode ? 'lg:px-12 lg:py-8' : ''}`}>
                   {/* Layout Storyboard Otimizado */}
                   <textarea
                    value={content}
                    onChange={handleContentChange}
                    placeholder="Cole aqui seu roteiro técnico..."
                    className={`w-full h-full p-4 sm:p-8 rounded-3xl border outline-none focus:ring-4 focus:ring-blue-500/10 resize-none transition-all font-mono leading-relaxed ${isDarkMode ? 'bg-slate-900/40 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'} ${isFocusMode ? 'text-base sm:text-lg' : 'text-xs sm:text-sm'}`}
                   />
                </div>
              ) : (
                <textarea
                  value={content}
                  onChange={handleContentChange}
                  placeholder="Comece a escrever sua obra-prima..."
                  className={`flex-1 p-6 sm:p-8 lg:p-10 outline-none resize-none leading-relaxed transition-all duration-500
                    ${isDarkMode ? 'bg-transparent text-slate-300' : 'bg-transparent text-slate-700'} 
                    ${isFocusMode ? 'text-lg lg:text-2xl font-serif max-w-4xl mx-auto w-full lg:p-12' : 'text-sm sm:text-base font-serif'}`}
                />
              )}
            </div>

            {!isFocusMode && (
              <div className="px-5 py-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between no-print">
                <span className="text-[9px] font-bold text-slate-400 uppercase">{content.length} caracteres</span>
                <div className="flex items-center gap-4">
                   <div className="flex items-center gap-1">
                      <Clock size={10} className="text-slate-300" />
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Auto-save: ON</span>
                   </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Lado Direito: Entrega de Artefato (Preview) - OCULTO NO FOCO */}
        {!isFocusMode && (
          <div className={`flex flex-col gap-3 sm:gap-4 min-h-0 ${showPreview ? 'flex' : 'hidden lg:flex'}`}>
            <div className={`flex-1 rounded-2xl sm:rounded-[2.5rem] border overflow-hidden flex flex-col ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200 shadow-inner'}`}>
               <div className="px-5 py-3 bg-slate-200/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between no-print">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setShowPreview(false)} className="lg:hidden p-1 hover:bg-slate-300 rounded-lg"><ChevronLeft size={16}/></button>
                    <BookOpen size={16} className="text-slate-400" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Preview Editorial</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button onClick={() => window.print()} className="p-1 text-slate-400 hover:text-blue-600 transition-colors"><Printer size={16} /></button>
                  </div>
               </div>

               <div className="flex-1 p-6 sm:p-10 overflow-y-auto custom-scrollbar no-print-bg">
                  <div className={`max-w-prose mx-auto markdown-preview prose dark:prose-invert ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>
                     {content ? (
                       <div dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }} />
                     ) : (
                       <div className="h-full flex flex-col items-center justify-center opacity-20 py-20 grayscale">
                          <FileText size={64} className="mb-4" />
                          <p className="font-bold uppercase tracking-widest text-xs">Aguardando redação...</p>
                       </div>
                     )}
                  </div>
               </div>
            </div>
            
            <div className={`p-4 rounded-2xl border flex items-center justify-between no-print ${isDarkMode ? 'bg-slate-800/40 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
               <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Leitura Estimada</span>
                    <span className="text-[10px] font-bold text-blue-500">{Math.ceil(content.split(/\s+/).length / 200)} min</span>
                  </div>
                  <div className="w-px h-6 bg-slate-100 dark:bg-slate-700 mx-1"></div>
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Palavras</span>
                    <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">{content.split(/\s+/).filter(x => x).length}</span>
                  </div>
               </div>
               <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    placeholder="Adicionar tag..." 
                    className="bg-transparent border-none outline-none text-[10px] font-bold text-slate-400 w-24 text-right"
                    onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.value = ''; }}
                  />
                  <TagIcon size={12} className="text-slate-300" />
               </div>
            </div>
          </div>
        )}
      </div>

      {/* Modais e Paineis Flutuantes com Z-Index Elevado */}
      <div className="z-[300] relative">
        {showReviewModal && analysis && (
          <EditorReviewModal 
            analysis={analysis} 
            originalContent={content} 
            onClose={() => setShowReviewModal(false)} 
            isDarkMode={isDarkMode} 
          />
        )}

        {showVideoModal && (
          <VideoGenerationModal 
            script={content} 
            onClose={() => setShowVideoModal(false)} 
            isDarkMode={isDarkMode} 
          />
        )}
      </div>
    </div>
  );
};

// Markdown Simplificado
const renderMarkdown = (text: string) => {
  return text
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl sm:text-4xl font-black mb-6">$1</h1>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl sm:text-2xl font-bold mt-8 mb-4 border-b border-slate-100 pb-2">$1</h2>')
    .replace(/^### (.*$)/gim, '<h3 class="text-lg sm:text-xl font-bold mt-6 mb-2">$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-black text-blue-600 dark:text-blue-400">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic opacity-80">$1</em>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" class="text-blue-500 underline">$1</a>')
    .replace(/\n/g, '<br/>');
};

export default EditorPane;

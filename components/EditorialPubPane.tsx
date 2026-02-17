
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Book, 
  Mail, 
  MessageSquare, 
  HelpCircle, 
  Send, 
  Loader2, 
  Check, 
  Shield, 
  Eye, 
  Code,
  Globe,
  Lock,
  ExternalLink,
  ChevronRight,
  Info,
  Hash,
  AlertCircle
} from 'lucide-react';

interface EditorialPubPaneProps {
  isDarkMode: boolean;
}

type EditorialPlatform = 'medium' | 'substack' | 'discord' | 'quora';

interface PlatformMeta {
  id: EditorialPlatform;
  name: string;
  icon: any;
  color: string;
  description: string;
}

const platforms: PlatformMeta[] = [
  { id: 'medium', name: 'Medium', icon: Book, color: 'text-slate-900 dark:text-white', description: 'Plataforma líder para artigos e ensaios.' },
  { id: 'substack', name: 'Substack', icon: Mail, color: 'text-orange-500', description: 'Newsletter e assinaturas diretas.' },
  { id: 'discord', name: 'Discord', icon: MessageSquare, color: 'text-indigo-500', description: 'Comunidades e notificações em tempo real.' },
  { id: 'quora', name: 'Quora', icon: HelpCircle, color: 'text-red-600', description: 'Compartilhamento de conhecimento Q&A.' },
];

const EditorialPubPane: React.FC<EditorialPubPaneProps> = ({ isDarkMode }) => {
  const [selectedPlatform, setSelectedPlatform] = useState<EditorialPlatform>('medium');
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');

  // Platform Specific States
  const [mediumToken, setMediumToken] = useState('');
  const [substackSubject, setSubstackSubject] = useState('');
  const [discordWebhook, setDiscordWebhook] = useState('');
  const [quoraTopics, setQuoraTopics] = useState('');

  useEffect(() => {
    // Carregar o último rascunho se disponível
    const draft = localStorage.getItem('mediastudio_draft_Escrita Criativa');
    if (draft) {
      const parsed = JSON.parse(draft);
      setContent(parsed.content || '');
      setTitle(parsed.title || '');
    }
  }, []);

  const convertedContent = useMemo(() => {
    if (!content) return '';

    switch (selectedPlatform) {
      case 'medium':
      case 'substack':
        // Markdown to Basic HTML
        return content
          .replace(/^# (.*$)/gm, '<h1>$1</h1>')
          .replace(/^## (.*$)/gm, '<h2>$1</h2>')
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
          .replace(/\n/g, '<br/>');
      case 'discord':
        // Markdown to Discord Block Style
        return `>>> **${title}**\n\n${content}\n\n*Publicado via MediaStudio Pro*`;
      case 'quora':
        // Markdown to Rich Text Simple
        return content.replace(/\n/g, '\n\n');
      default:
        return content;
    }
  }, [content, selectedPlatform, title]);

  const handlePublish = () => {
    if (!content) return;
    setIsLoading(true);
    // Simulação de API call
    setTimeout(() => {
      setIsLoading(false);
      setIsPublished(true);
      setTimeout(() => setIsPublished(false), 3000);
    }, 2000);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-12">
      {/* Platform Tabs */}
      <div className={`flex items-center gap-2 p-2 rounded-3xl border overflow-x-auto no-scrollbar ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
        {platforms.map(p => (
          <button
            key={p.id}
            onClick={() => setSelectedPlatform(p.id)}
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all whitespace-nowrap group ${
              selectedPlatform === p.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <p.icon size={20} className={selectedPlatform === p.id ? 'text-white' : p.color} />
            <div className="text-left">
              <p className="text-sm font-bold leading-none">{p.name}</p>
              <p className={`text-[10px] mt-1 font-medium opacity-60 ${selectedPlatform === p.id ? 'block' : 'hidden lg:block'}`}>Editorial Hub</p>
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Configuration (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className={`p-6 rounded-[2rem] border ${isDarkMode ? 'bg-slate-800/40 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="flex items-center gap-2 mb-6 text-blue-500">
              <Shield size={20} />
              <h3 className="font-bold uppercase tracking-widest text-xs">Configuração Segura</h3>
            </div>

            <div className="space-y-4">
              {selectedPlatform === 'medium' && (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">API Integration Token</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="password"
                      placeholder="Seu token de integração..."
                      value={mediumToken}
                      onChange={(e) => setMediumToken(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 rounded-2xl border text-sm focus:ring-4 focus:ring-blue-500/10 outline-none transition-all ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 italic">Obtenha o token nas configurações do Medium.</p>
                </div>
              )}

              {selectedPlatform === 'substack' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Assunto da Newsletter</label>
                    <input
                      type="text"
                      placeholder="Título que aparece no email..."
                      value={substackSubject}
                      onChange={(e) => setSubstackSubject(e.target.value)}
                      className={`w-full px-4 py-3 rounded-2xl border text-sm focus:ring-4 focus:ring-blue-500/10 outline-none transition-all ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                    />
                  </div>
                </div>
              )}

              {selectedPlatform === 'discord' && (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Discord Webhook URL</label>
                  <input
                    type="text"
                    placeholder="https://discord.com/api/webhooks/..."
                    value={discordWebhook}
                    onChange={(e) => setDiscordWebhook(e.target.value)}
                    className={`w-full px-4 py-3 rounded-2xl border text-sm focus:ring-4 focus:ring-blue-500/10 outline-none transition-all ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                  />
                </div>
              )}

              {selectedPlatform === 'quora' && (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Tópicos (Tags)</label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="text"
                      placeholder="Tech, Writing, AI..."
                      value={quoraTopics}
                      onChange={(e) => setQuoraTopics(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 rounded-2xl border text-sm focus:ring-4 focus:ring-blue-500/10 outline-none transition-all ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                    />
                  </div>
                </div>
              )}

              <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-700">
                <button
                  onClick={handlePublish}
                  disabled={isLoading || !content}
                  className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-xl disabled:opacity-50 ${
                    isPublished 
                      ? 'bg-emerald-500 text-white shadow-emerald-500/20' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
                  }`}
                >
                  {isLoading ? <Loader2 size={20} className="animate-spin" /> : isPublished ? <Check size={20} /> : <Send size={20} />}
                  <span>{isPublished ? 'PUBLICADO COM SUCESSO' : `PUBLICAR NO ${selectedPlatform.toUpperCase()}`}</span>
                </button>
              </div>
            </div>
          </div>

          <div className={`p-5 rounded-2xl border flex items-start gap-4 ${isDarkMode ? 'bg-indigo-900/10 border-indigo-900/30 text-indigo-300' : 'bg-indigo-50 border-indigo-100 text-indigo-700'}`}>
            <Info size={24} className="shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-widest">Dica Editorial</p>
              <p className="text-[11px] leading-relaxed opacity-80">
                O MediaStudio detecta automaticamente as tags de cabeçalho (H1, H2) e converte seu Markdown para o formato Rich Text nativo desta plataforma.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Content Preview (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4 min-h-[500px]">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                <button
                  onClick={() => setViewMode('preview')}
                  className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === 'preview' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600' : 'text-slate-400'}`}
                >
                  <Eye size={16} /> VISUALIZAR
                </button>
                <button
                  onClick={() => setViewMode('code')}
                  className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === 'code' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600' : 'text-slate-400'}`}
                >
                  <Code size={16} /> CÓDIGO FONTE
                </button>
              </div>

              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <Globe size={14} /> Global Sync
              </div>
           </div>

           <div className={`flex-1 rounded-[2.5rem] border overflow-hidden flex flex-col ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div className="p-4 bg-slate-200/50 dark:bg-slate-800/50 flex items-center justify-between border-b border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                   <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                   <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Editorial Engine Rendering</span>
                <ExternalLink size={14} className="text-slate-400" />
              </div>

              <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
                {viewMode === 'preview' ? (
                  <div className={`max-w-2xl mx-auto prose dark:prose-invert ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>
                    <h1 className="text-3xl font-black mb-6">{title || 'Título da Publicação'}</h1>
                    <div className="editorial-preview" dangerouslySetInnerHTML={{ __html: convertedContent || '<p class="opacity-30 italic text-center py-20">Nenhum conteúdo para converter...</p>' }} />
                  </div>
                ) : (
                  <pre className="p-6 font-mono text-[12px] leading-relaxed text-indigo-500 dark:text-indigo-400 whitespace-pre-wrap">
                    {convertedContent}
                  </pre>
                )}
              </div>
           </div>

           {/* Validation Status */}
           <div className="flex items-center gap-4 px-4">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${content ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Conteúdo Pronto</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${title ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Metadados OK</span>
              </div>
              <div className="ml-auto flex items-center gap-1.5 text-xs text-slate-400 italic">
                <AlertCircle size={14} />
                <span>Revisão final recomendada antes de publicar.</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default EditorialPubPane;

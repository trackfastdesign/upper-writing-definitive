
import React, { useState, useMemo } from 'react';
import { 
  Youtube, 
  Instagram, 
  Facebook, 
  Linkedin, 
  Twitter, 
  Hash, 
  Share2, 
  Eye, 
  Code, 
  Check, 
  Copy, 
  Sparkles, 
  MessageCircle,
  Clock,
  Send,
  Loader2,
  AlertCircle,
  ThumbsUp,
  ExternalLink,
  Smartphone
} from 'lucide-react';

interface SocialHubPaneProps {
  isDarkMode: boolean;
}

type PlatformId = 'youtube' | 'instagram' | 'facebook' | 'linkedin' | 'twitter' | 'tiktok';

interface PlatformConfig {
  id: PlatformId;
  name: string;
  icon: any;
  color: string;
  bgColor: string;
  previewLayout: 'video' | 'post' | 'thread';
}

const platforms: PlatformConfig[] = [
  { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'text-red-600', bgColor: 'bg-red-50 dark:bg-red-900/20', previewLayout: 'video' },
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-pink-600', bgColor: 'bg-pink-50 dark:bg-pink-900/20', previewLayout: 'post' },
  { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'text-blue-600', bgColor: 'bg-blue-50 dark:bg-blue-900/20', previewLayout: 'post' },
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'text-blue-700', bgColor: 'bg-blue-50 dark:bg-blue-900/20', previewLayout: 'post' },
  { id: 'twitter', name: 'X / Twitter', icon: Twitter, color: 'text-slate-900 dark:text-white', bgColor: 'bg-slate-100 dark:bg-slate-700', previewLayout: 'post' },
  { id: 'tiktok', name: 'TikTok', icon: MessageCircle, color: 'text-slate-900 dark:text-white', bgColor: 'bg-slate-100 dark:bg-slate-700', previewLayout: 'video' },
];

const SocialHubPane: React.FC<SocialHubPaneProps> = ({ isDarkMode }) => {
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformId>('instagram');
  const [caption, setCaption] = useState('Confira os bastidores da nossa nova produção MediaStudio Pro! ✨ #ContentCreation #AI #MediaStudio');
  const [hashtags, setHashtags] = useState('#MediaStudio #Innovation #DigitalMarketing');
  const [thumbnailUrl, setThumbnailUrl] = useState('https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1000');
  const [viewMode, setViewMode] = useState<'preview' | 'payload'>('preview');
  const [isPublishing, setIsPublishing] = useState(false);
  const [copied, setCopied] = useState(false);

  const activePlatform = useMemo(() => platforms.find(p => p.id === selectedPlatform)!, [selectedPlatform]);

  const mockPayload = useMemo(() => ({
    platform: selectedPlatform,
    timestamp: new Date().toISOString(),
    content: {
      text: caption,
      hashtags: hashtags.split(' '),
      media: {
        type: activePlatform.previewLayout === 'video' ? 'VIDEO' : 'IMAGE',
        url: thumbnailUrl,
        thumbnail_url: thumbnailUrl
      }
    },
    api_config: {
      endpoint: `https://api.${selectedPlatform}.com/v2/publish`,
      version: "2024.1",
      auth_type: "OAuth2"
    }
  }), [selectedPlatform, caption, hashtags, thumbnailUrl, activePlatform]);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(mockPayload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePublish = () => {
    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      alert('Simulação de Publicação Concluída com Sucesso! Payload enviado para a API.');
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      {/* Platform Selector */}
      <div className={`p-4 rounded-3xl border flex items-center gap-2 overflow-x-auto no-scrollbar ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
        {platforms.map(p => (
          <button
            key={p.id}
            onClick={() => setSelectedPlatform(p.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl transition-all whitespace-nowrap text-sm font-bold ${
              selectedPlatform === p.id 
                ? `${p.bgColor} ${p.color} ring-2 ring-current ring-offset-2 dark:ring-offset-slate-900` 
                : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <p.icon size={18} />
            <span>{p.name}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Composer */}
        <div className="space-y-6">
          <div className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-slate-800/40 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="text-blue-500" size={20} />
              <h3 className="font-bold">Compositor Universal</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Legenda / Caption</label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className={`w-full p-4 rounded-2xl border text-sm focus:ring-4 focus:ring-blue-500/10 outline-none resize-none transition-all ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Hashtags</label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    value={hashtags}
                    onChange={(e) => setHashtags(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-2xl border text-sm focus:ring-4 focus:ring-blue-500/10 outline-none transition-all ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Media URL (Thumbnail)</label>
                <input
                  type="text"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  className={`w-full px-4 py-3 rounded-2xl border text-sm focus:ring-4 focus:ring-blue-500/10 outline-none transition-all ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                />
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
              <button
                onClick={handlePublish}
                disabled={isPublishing}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
              >
                {isPublishing ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                <span>DISTRIBUIR AGORA</span>
              </button>
            </div>
          </div>

          <div className={`p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 flex items-start gap-3`}>
            <AlertCircle size={20} className="text-blue-500 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
              O MediaStudio ajusta automaticamente as tags meta e converte o conteúdo para o formato adequado de cada rede social antes de enviar para a fila de processamento.
            </p>
          </div>
        </div>

        {/* Right: Preview / Payload Area */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl w-fit self-center">
            <button
              onClick={() => setViewMode('preview')}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === 'preview' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600' : 'text-slate-400'}`}
            >
              <Eye size={16} /> PREVIEW
            </button>
            <button
              onClick={() => setViewMode('payload')}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === 'payload' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600' : 'text-slate-400'}`}
            >
              <Code size={16} /> API PAYLOAD
            </button>
          </div>

          {viewMode === 'preview' ? (
            <div className="flex-1 flex items-center justify-center p-4">
              <div className={`w-[320px] rounded-[3rem] border-8 border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden relative ${isDarkMode ? 'shadow-blue-500/10' : ''}`}>
                {/* Smartphone Status Bar */}
                <div className="h-6 flex items-center justify-between px-8 pt-4">
                  <span className="text-[10px] font-bold">12:00</span>
                  <div className="flex gap-1">
                    <div className="w-3 h-1.5 bg-slate-300 rounded-sm"></div>
                    <div className="w-3 h-1.5 bg-slate-300 rounded-sm"></div>
                  </div>
                </div>

                {/* Platform Specific Layouts */}
                <div className="p-4 mt-4">
                  {selectedPlatform === 'youtube' ? (
                    <div className="space-y-3">
                      <div className="aspect-video bg-slate-200 rounded-lg overflow-hidden relative">
                        <img src={thumbnailUrl} className="w-full h-full object-cover" />
                        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] px-1 rounded">10:45</div>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0"></div>
                        <div className="space-y-1 flex-1">
                          <h4 className="text-sm font-bold line-clamp-2">{caption.split('#')[0]}</h4>
                          <p className="text-[10px] text-slate-500">MediaStudio • 1k visualizações • agora</p>
                        </div>
                      </div>
                    </div>
                  ) : selectedPlatform === 'instagram' ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full ring-2 ring-pink-500 p-0.5"><div className="w-full h-full rounded-full bg-slate-200"></div></div>
                            <span className="text-[10px] font-bold">mediastudio_pro</span>
                         </div>
                         <ExternalLink size={14} className="text-slate-400" />
                      </div>
                      <div className="aspect-square bg-slate-100 rounded-sm overflow-hidden">
                        <img src={thumbnailUrl} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex gap-3 py-1">
                        <ThumbsUp size={18} className="text-slate-600" />
                        <MessageCircle size={18} className="text-slate-600" />
                        <Share2 size={18} className="text-slate-600 ml-auto" />
                      </div>
                      <p className="text-[11px] leading-relaxed">
                        <span className="font-bold mr-2">mediastudio_pro</span>
                        {caption}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                       <div className="flex gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-200"></div>
                          <div className="flex-1">
                             <h4 className="text-sm font-bold">MediaStudio Pro</h4>
                             <p className="text-[10px] text-slate-500 flex items-center gap-1"><Clock size={10} /> agora • 🌎</p>
                          </div>
                       </div>
                       <p className="text-sm leading-relaxed">{caption}</p>
                       <div className="aspect-video bg-slate-100 rounded-xl overflow-hidden">
                          <img src={thumbnailUrl} className="w-full h-full object-cover" />
                       </div>
                       <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                          <div className="flex items-center gap-1 text-[10px] text-slate-500"><ThumbsUp size={12} /> Like</div>
                          <div className="flex items-center gap-1 text-[10px] text-slate-500"><MessageCircle size={12} /> Comment</div>
                       </div>
                    </div>
                  )}
                </div>

                {/* Home Indicator */}
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-24 h-1 bg-slate-300 rounded-full"></div>
              </div>
            </div>
          ) : (
            <div className={`flex-1 rounded-3xl border overflow-hidden flex flex-col ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
              <div className="p-3 bg-slate-200 dark:bg-slate-800 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Payload para API Oficial</span>
                <button 
                  onClick={handleCopy}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-white dark:bg-slate-700 hover:bg-blue-600 hover:text-white shadow-sm'}`}
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? 'COPIADO' : 'COPIAR JSON'}
                </button>
              </div>
              <pre className="flex-1 p-6 text-[11px] font-mono leading-relaxed overflow-auto custom-scrollbar text-blue-500 dark:text-blue-400">
                {JSON.stringify(mockPayload, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SocialHubPane;

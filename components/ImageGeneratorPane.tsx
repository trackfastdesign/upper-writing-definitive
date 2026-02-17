
import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Image as ImageIcon, 
  Download, 
  Send, 
  Loader2, 
  Trash2, 
  Info,
  Layers,
  Copy,
  Check,
  Expand,
  X,
  Bookmark,
  Archive,
  RefreshCw
} from 'lucide-react';
import { generateImage, refineImagePrompt } from '../services/geminiService';
// Fix: Import ContentStatus to resolve missing property error in handleSaveToArchive
import { GeneratedImage, ContentItem, AppView, ContentStatus } from '../types';

interface ImageGeneratorPaneProps {
  isDarkMode: boolean;
  onArchive?: (item: ContentItem) => void;
}

const ImageGeneratorPane: React.FC<ImageGeneratorPaneProps> = ({ isDarkMode, onArchive }) => {
  const [userInput, setUserInput] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '9:16'>('1:1');
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState('');
  const [gallery, setGallery] = useState<GeneratedImage[]>([]);
  const [latestResult, setLatestResult] = useState<GeneratedImage | null>(null);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const savedGallery = localStorage.getItem('mediastudio_gallery_v3');
    if (savedGallery) setGallery(JSON.parse(savedGallery));
  }, []);

  useEffect(() => {
    localStorage.setItem('mediastudio_gallery_v3', JSON.stringify(gallery));
  }, [gallery]);

  const handleGenerate = async () => {
    if (!userInput.trim()) return;
    setIsGenerating(true);
    setStatus('Refinando prompt criativo...');

    try {
      const refined = await refineImagePrompt(userInput);
      setStatus('Renderizando com Imagen 4.0...');
      
      const imageUrl = await generateImage(refined, aspectRatio);

      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        url: imageUrl,
        prompt: userInput,
        refinedPrompt: refined,
        date: new Date().toLocaleString()
      };

      setLatestResult(newImage);
      setUserInput('');
    } catch (error) {
      console.error(error);
      alert('Erro ao gerar imagem. Verifique sua chave API.');
    } finally {
      setIsGenerating(false);
      setStatus('');
    }
  };

  const handleSaveToGallery = () => {
    if (!latestResult) return;
    setIsSaving(true);
    setTimeout(() => {
      setGallery(prev => [latestResult, ...prev]);
      setLatestResult(null);
      setIsSaving(false);
    }, 600);
  };

  const handleSaveToArchive = () => {
    if (!latestResult || !onArchive) return;
    
    // Fix: Added missing 'status' property to satisfy ContentItem interface
    const newItem: ContentItem = {
      id: Date.now().toString(),
      title: `Imagem: ${latestResult.prompt.substring(0, 30)}...`,
      content: `![${latestResult.prompt}](${latestResult.url})\n\n**Prompt:** ${latestResult.prompt}\n\n**Prompt IA:** ${latestResult.refinedPrompt}`,
      type: AppView.IMAGE_LAB,
      status: ContentStatus.PUBLISHED,
      date: new Date().toLocaleDateString(),
      tags: ['AI-Image', 'Imagen4'],
      versions: []
    };
    
    onArchive(newItem);
    alert('Salvo no arquivo do projeto!');
  };

  const downloadWithMetadata = (image: GeneratedImage) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = image.url;
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const footerHeight = 60;
      canvas.width = img.width;
      canvas.height = img.height + footerHeight;

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, img.height, canvas.width, footerHeight);
      ctx.drawImage(img, 0, 0);
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('GERADO POR IA • MEDIASTUDIO PRO • IMAGEN 4.0', canvas.width / 2, img.height + 38);

      const link = document.createElement('a');
      link.download = `MediaStudio_AI_${image.id}.jpg`;
      link.href = canvas.toDataURL('image/jpeg', 0.95);
      link.click();
    };
  };

  const copyPrompt = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col gap-10 pb-20">
      {/* Creation Section */}
      <div className={`p-8 rounded-[2rem] border transition-all ${isDarkMode ? 'bg-slate-800/40 border-slate-700 shadow-2xl' : 'bg-white border-slate-200 shadow-xl shadow-slate-200/50'}`}>
        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl shadow-lg">
            <Sparkles size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Image Lab</h2>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Criação Visual Imagen 4.0</p>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <div className="relative group">
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Descreva o conceito visual... (ex: 'Cyberpunk Rio de Janeiro, hiper-detalhado, luz neon')"
              rows={4}
              className={`w-full p-6 rounded-2xl border outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-lg leading-relaxed resize-none ${
                isDarkMode ? 'bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-600' : 'bg-slate-50 border-slate-200 placeholder:text-slate-400'
              }`}
            />
            {isGenerating && (
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center text-white z-20 animate-in fade-in duration-300">
                <Loader2 className="animate-spin mb-4 text-blue-400" size={48} />
                <p className="text-lg font-bold tracking-widest uppercase animate-pulse">{status}</p>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex flex-col gap-3">
              <label className="text-[10px] font-bold uppercase text-slate-500 tracking-widest ml-1">Proporção</label>
              <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl">
                {(['1:1', '16:9', '9:16'] as const).map(ratio => (
                  <button
                    key={ratio}
                    onClick={() => setAspectRatio(ratio)}
                    className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${
                      aspectRatio === ratio 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800'
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !userInput.trim()}
              className="group flex items-center gap-3 px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50"
            >
              {isGenerating ? <Loader2 size={22} className="animate-spin" /> : <Send size={22} />}
              <span className="text-base uppercase tracking-widest">Gerar Imagem</span>
            </button>
          </div>
        </div>
      </div>

      {/* Latest Result Slot */}
      {latestResult && (
        <div className="animate-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-3 mb-6">
            <RefreshCw size={20} className="text-blue-500" />
            <h3 className="text-xl font-bold">Resultado Recente</h3>
            <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase rounded-md tracking-tighter">Novo</span>
          </div>
          
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 rounded-[2.5rem] border ${isDarkMode ? 'bg-slate-800/40 border-slate-700' : 'bg-white border-slate-200 shadow-2xl shadow-blue-500/5'}`}>
            <div className="relative group rounded-3xl overflow-hidden bg-slate-900 aspect-square shadow-2xl">
              <img src={latestResult.url} alt="Latest Result" className="w-full h-full object-contain" />
              <button 
                onClick={() => setSelectedImage(latestResult)}
                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <Expand size={32} className="text-white" />
              </button>
            </div>
            
            <div className="flex flex-col justify-center gap-8">
              <div className="space-y-4">
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-500 mb-2">Prompt Original</h4>
                  <p className={`text-lg font-medium leading-relaxed italic ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>"{latestResult.prompt}"</p>
                </div>
                <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-purple-500 mb-3 flex items-center gap-2">
                    <Sparkles size={14} /> Expansão de IA
                  </h4>
                  <p className={`text-xs leading-relaxed italic opacity-70 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{latestResult.refinedPrompt}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button 
                  onClick={handleSaveToGallery}
                  disabled={isSaving}
                  className="flex items-center justify-center gap-3 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-xl shadow-blue-500/20 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50"
                >
                  {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Bookmark size={20} />}
                  <span>SALVAR NA GALERIA</span>
                </button>
                <button 
                  onClick={handleSaveToArchive}
                  className={`flex items-center justify-center gap-3 py-4 rounded-2xl font-bold border transition-all hover:-translate-y-1 active:scale-95 ${isDarkMode ? 'border-slate-700 hover:bg-slate-700' : 'border-slate-200 hover:bg-slate-100'}`}
                >
                  <Archive size={20} />
                  <span>ARQUIVAR PROJETO</span>
                </button>
                <button 
                  onClick={() => downloadWithMetadata(latestResult)}
                  className={`flex items-center justify-center gap-3 py-4 rounded-2xl font-bold border transition-all hover:-translate-y-1 active:scale-95 ${isDarkMode ? 'border-slate-700 hover:bg-slate-700' : 'border-slate-200 hover:bg-slate-100'}`}
                >
                  <Download size={20} />
                  <span>BAIXAR JPG</span>
                </button>
                <button 
                  onClick={() => setLatestResult(null)}
                  className={`flex items-center justify-center gap-3 py-4 rounded-2xl font-bold border transition-all hover:-translate-y-1 active:scale-95 ${isDarkMode ? 'border-slate-700 hover:bg-slate-700' : 'border-slate-200 hover:bg-slate-100'}`}
                >
                  <Trash2 size={20} />
                  <span>DESCARTAR</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Section */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ImageIcon size={24} className="text-blue-500" />
            <h3 className="text-xl font-bold">Arquivos de Imagem Salvos</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{gallery.length} ITENS</p>
          </div>
        </div>

        {gallery.length === 0 ? (
          <div className={`p-24 flex flex-col items-center justify-center text-center rounded-[2.5rem] border-2 border-dashed ${isDarkMode ? 'border-slate-800 bg-slate-800/20' : 'border-slate-100 bg-slate-50/50'}`}>
            <Layers className="text-slate-300 dark:text-slate-700 mb-6" size={80} />
            <p className="text-slate-400 font-medium italic">Sua galeria está vazia. Gere uma imagem e clique em 'Salvar'.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {gallery.map(img => (
              <div 
                key={img.id}
                className={`group relative rounded-[2rem] overflow-hidden border transition-all ${isDarkMode ? 'bg-slate-800/80 border-slate-700 hover:border-blue-500/50' : 'bg-white border-slate-200 shadow-md hover:shadow-2xl hover:-translate-y-1'}`}
              >
                <div className="relative aspect-square overflow-hidden bg-slate-900 group-cursor-pointer" onClick={() => setSelectedImage(img)}>
                  <img src={img.url} alt={img.prompt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Expand size={32} className="text-white opacity-80" />
                  </div>
                </div>
                
                <div className="p-6">
                  <p className="text-xs font-medium line-clamp-2 mb-6 h-8 text-slate-500 italic">"{img.prompt}"</p>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => downloadWithMetadata(img)}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/10"
                    >
                      <Download size={16} /> Salvar
                    </button>
                    <button 
                      onClick={() => copyPrompt(img.prompt, img.id)}
                      className={`p-3 rounded-xl transition-all ${copiedId === img.id ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-blue-500'}`}
                    >
                      {copiedId === img.id ? <Check size={18} /> : <Copy size={18} />}
                    </button>
                    <button 
                      onClick={() => setGallery(prev => prev.filter(i => i.id !== img.id))}
                      className="p-3 bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-red-500 rounded-xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox / Preview Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300">
          <button 
            onClick={() => setSelectedImage(null)}
            className="absolute top-8 right-8 p-4 text-white/50 hover:text-white transition-colors"
          >
            <X size={40} />
          </button>
          
          <div className="max-w-6xl w-full flex flex-col lg:flex-row gap-10 items-center">
            <div className="flex-1 rounded-3xl overflow-hidden shadow-2xl border border-white/10">
              <img src={selectedImage.url} alt="Expanded" className="w-full h-auto max-h-[80vh] object-contain" />
            </div>
            
            <div className="w-full lg:w-96 space-y-8 text-white">
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-2">Prompt Original</h4>
                <p className="text-lg font-light leading-relaxed">"{selectedImage.prompt}"</p>
              </div>
              
              <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-purple-400 mb-4 flex items-center gap-2">
                  <Sparkles size={14} /> Prompt Refinado pela IA
                </h4>
                <p className="text-sm text-white/60 leading-relaxed italic">"{selectedImage.refinedPrompt}"</p>
              </div>

              <div className="pt-4 flex flex-col gap-3">
                <button 
                  onClick={() => downloadWithMetadata(selectedImage)}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all"
                >
                  <Download size={20} /> Baixar Versão Final
                </button>
                <div className="flex items-center justify-center gap-4 text-[10px] text-white/30 font-bold uppercase tracking-tighter">
                  <span>720p Optimized</span>
                  <span>•</span>
                  <span>Imagen 4.0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGeneratorPane;

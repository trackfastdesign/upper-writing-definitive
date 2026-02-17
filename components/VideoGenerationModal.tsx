
import React, { useState, useEffect } from 'react';
import { X, Clapperboard, Loader2, Play, Download, AlertCircle } from 'lucide-react';
import { generateVideo } from '../services/geminiService';

interface VideoGenerationModalProps {
  script: string;
  onClose: () => void;
  isDarkMode: boolean;
}

const VideoGenerationModal: React.FC<VideoGenerationModalProps> = ({ script, onClose, isDarkMode }) => {
  const [status, setStatus] = useState<string>("Preparando roteiro...");
  const [isGenerating, setIsGenerating] = useState<boolean>(true);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    
    const startGeneration = async () => {
      try {
        const url = await generateVideo(script.substring(0, 1000), (s) => {
          if (active) setStatus(s);
        });
        if (active) {
          setVideoUrl(url);
          setIsGenerating(false);
        }
      } catch (err: any) {
        if (active) {
          console.error(err);
          if (err.message?.includes("Requested entity was not found")) {
            setError("Chave API ou Projeto não configurado corretamente. Verifique se o projeto tem faturamento ativo.");
          } else {
            setError("Ocorreu um erro na geração do vídeo. Tente novamente mais tarde.");
          }
          setIsGenerating(false);
        }
      }
    };

    startGeneration();
    return () => { active = false; };
  }, [script]);

  const handleDownload = () => {
    if (!videoUrl) return;
    const a = document.createElement('a');
    a.href = videoUrl;
    a.download = 'mediastudio-veo-video.mp4';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
      <div className={`w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col ${isDarkMode ? 'bg-slate-900 border border-slate-800 text-white' : 'bg-white'}`}>
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-red-600 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <Clapperboard size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold">Gerador de Vídeo Veo</h2>
              <p className="text-xs opacity-80 uppercase tracking-widest font-bold">Produção Audiovisual Gemini 3.1 Fast</p>
            </div>
          </div>
          {!isGenerating && (
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all">
              <X size={24} />
            </button>
          )}
        </div>

        <div className="p-10 flex flex-col items-center justify-center min-h-[400px]">
          {isGenerating ? (
            <div className="text-center space-y-6">
              <div className="relative">
                <div className="w-24 h-24 border-4 border-red-100 dark:border-red-900/30 border-t-red-600 rounded-full animate-spin mx-auto"></div>
                <Clapperboard className="absolute inset-0 m-auto text-red-600 animate-pulse" size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold">Gerando sua obra-prima...</h3>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{status}</p>
              </div>
              <div className="max-w-xs mx-auto p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/50">
                <p className="text-xs text-blue-600 dark:text-blue-400 italic">
                  "Grandes vídeos levam tempo. Aproveite este momento para um café!"
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-rose-100 dark:bg-rose-900/30 text-rose-600 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle size={40} />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-rose-600">Ops! Algo deu errado</h3>
                <p className="text-sm max-w-md mx-auto">{error}</p>
              </div>
              <div className="pt-4 flex gap-3 justify-center">
                <button 
                   onClick={() => window.open('https://ai.google.dev/gemini-api/docs/billing', '_blank')}
                   className="px-4 py-2 text-sm font-bold text-blue-600 hover:underline"
                >
                  Documentação de Faturamento
                </button>
                <button onClick={onClose} className="px-6 py-2 bg-slate-200 dark:bg-slate-800 rounded-full font-bold text-sm">
                  Fechar
                </button>
              </div>
            </div>
          ) : videoUrl ? (
            <div className="w-full space-y-6">
              <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-100 dark:border-slate-800">
                <video src={videoUrl} controls className="w-full h-full" autoPlay loop />
              </div>
              
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-lg">
                    <Play size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Seu vídeo está pronto!</p>
                    <p className="text-xs text-slate-500">Formato MP4 • 720p • 16:9</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <button 
                    onClick={handleDownload}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
                  >
                    <Download size={18} />
                    Download
                  </button>
                  <button 
                    onClick={onClose}
                    className="flex-1 md:flex-none px-6 py-2.5 bg-slate-200 dark:bg-slate-700 rounded-xl font-bold text-sm hover:bg-slate-300 dark:hover:bg-slate-600 transition-all"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default VideoGenerationModal;

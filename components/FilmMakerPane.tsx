
import React, { useState } from 'react';
import { 
  Clapperboard, 
  Plus, 
  Trash2, 
  Play, 
  Download, 
  Loader2, 
  Video,
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { VideoTake } from '../types';
import { generateVideo } from '../services/geminiService';

const FilmMakerPane: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const [takes, setTakes] = useState<VideoTake[]>([]);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [currentDuration, setCurrentDuration] = useState<5 | 10 | 15 | 25>(5);

  const addTake = () => {
    if (!currentPrompt.trim()) return;
    const newTake: VideoTake = {
      id: Date.now().toString(),
      duration: currentDuration,
      prompt: currentPrompt,
      status: 'idle'
    };
    setTakes([...takes, newTake]);
    setCurrentPrompt('');
  };

  const handleGenerateTake = async (id: string) => {
    const take = takes.find(t => t.id === id);
    if (!take) return;

    setTakes(prev => prev.map(t => t.id === id ? { ...t, status: 'generating' } : t));

    try {
      const durationInstruction = `Gere um vídeo de aproximadamente ${take.duration} segundos. `;
      const url = await generateVideo(durationInstruction + take.prompt, () => {});
      setTakes(prev => prev.map(t => t.id === id ? { ...t, status: 'done', videoUrl: url } : t));
    } catch (error) {
      setTakes(prev => prev.map(t => t.id === id ? { ...t, status: 'error' } : t));
    }
  };

  const removeTake = (id: string) => setTakes(takes.filter(t => t.id !== id));

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500 pb-20">
      <div className={`p-8 rounded-[2.5rem] border ${isDarkMode ? 'bg-slate-800/40 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 bg-rose-600 text-white rounded-2xl shadow-lg shadow-rose-500/20">
            <Clapperboard size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Estúdio de Cinema (Takes)</h2>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Produção Modular com Gemini Veo</p>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Duração do Take</label>
            <div className="flex gap-2">
              {[5, 10, 15, 25].map((d) => (
                <button
                  key={d}
                  onClick={() => setCurrentDuration(d as any)}
                  className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${currentDuration === d ? 'bg-rose-600 text-white' : 'bg-slate-100 dark:bg-slate-900 text-slate-500'}`}
                >
                  {d}s
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <textarea
              value={currentPrompt}
              onChange={(e) => setCurrentPrompt(e.target.value)}
              placeholder="Descreva a cena para este take..."
              className={`flex-1 p-4 rounded-2xl border outline-none focus:ring-4 focus:ring-rose-500/10 resize-none ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
              rows={2}
            />
            <button
              onClick={addTake}
              disabled={!currentPrompt.trim()}
              className="px-8 bg-rose-600 text-white rounded-2xl font-bold hover:bg-rose-700 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Plus size={20} /> ADICIONAR
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {takes.map((take, idx) => (
          <div key={take.id} className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-slate-800/40 border-slate-700' : 'bg-white border-slate-200'} flex flex-col gap-4 group`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-900/30 text-rose-600 flex items-center justify-center font-bold text-xs">{idx + 1}</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
                  <Clock size={12} /> {take.duration}s
                </span>
              </div>
              <button onClick={() => removeTake(take.id)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>

            <p className="text-sm font-medium italic text-slate-500">"{take.prompt}"</p>

            {take.videoUrl ? (
              <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-xl border-4 border-slate-100 dark:border-slate-800">
                <video src={take.videoUrl} controls className="w-full h-full" />
              </div>
            ) : (
              <div className="aspect-video bg-slate-100 dark:bg-slate-900 rounded-2xl flex flex-col items-center justify-center gap-4 text-center p-8 border-2 border-dashed border-slate-200 dark:border-slate-800">
                {take.status === 'generating' ? (
                  <>
                    <Loader2 size={32} className="animate-spin text-rose-600" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 animate-pulse">Processando Take...</p>
                  </>
                ) : (
                  <>
                    <Video size={32} className="text-slate-300" />
                    <button 
                      onClick={() => handleGenerateTake(take.id)}
                      className="px-6 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition-all shadow-lg shadow-rose-600/20"
                    >
                      GERAR TAKE
                    </button>
                  </>
                )}
              </div>
            )}
            
            {take.videoUrl && (
              <div className="flex gap-2">
                <a 
                  href={take.videoUrl} 
                  download={`take_${idx+1}.mp4`}
                  className="flex-1 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-black transition-all"
                >
                  <Download size={14} /> BAIXAR MP4
                </a>
              </div>
            )}
          </div>
        ))}
        {takes.length === 0 && (
          <div className="lg:col-span-2 py-20 flex flex-col items-center justify-center opacity-20 grayscale">
            <Clapperboard size={80} className="mb-4" />
            <p className="font-bold uppercase tracking-widest">Sua sequência de takes aparecerá aqui</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilmMakerPane;

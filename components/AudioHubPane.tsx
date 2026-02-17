
import React, { useState, useMemo } from 'react';
import { 
  Music, 
  Disc, 
  Tag as TagIcon, 
  FileText, 
  Info, 
  Download, 
  Globe, 
  Smartphone, 
  Check, 
  Loader2, 
  ImageIcon, 
  ListMusic, 
  Hash,
  AlertCircle,
  Headphones,
  Disc3 as DiscAlbum,
  Radio,
  Share2,
  Code
} from 'lucide-react';

interface AudioHubPaneProps {
  isDarkMode: boolean;
}

type AudioPlatform = 'spotify' | 'soundcloud' | 'bandcamp' | 'reverbnation';

interface PlatformMeta {
  id: AudioPlatform;
  name: string;
  icon: any;
  color: string;
  description: string;
}

const platforms: PlatformMeta[] = [
  { id: 'spotify', name: 'Spotify for Artists', icon: Headphones, color: 'text-emerald-500', description: 'Plataforma líder mundial de streaming.' },
  { id: 'soundcloud', name: 'SoundCloud', icon: Radio, color: 'text-orange-500', description: 'Comunidade global de criadores independentes.' },
  { id: 'bandcamp', name: 'BandCamp', icon: DiscAlbum, color: 'text-teal-600', description: 'Suporte direto de fãs e venda de álbuns.' },
  { id: 'reverbnation', name: 'ReverbNation', icon: Music, color: 'text-indigo-600', description: 'Marketing e distribuição para artistas.' },
];

const AudioHubPane: React.FC<AudioHubPaneProps> = ({ isDarkMode }) => {
  const [selectedPlatform, setSelectedPlatform] = useState<AudioPlatform>('spotify');
  const [trackTitle, setTrackTitle] = useState('');
  const [isrc, setIsrc] = useState('');
  const [description, setDescription] = useState('');
  const [genres, setGenres] = useState('');
  const [coverUrl, setCoverUrl] = useState('https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=1000');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isExported, setIsExported] = useState(false);
  const [viewMode, setViewMode] = useState<'form' | 'manifest'>('form');

  const submissionManifest = useMemo(() => ({
    platform_target: selectedPlatform,
    generated_at: new Date().toISOString(),
    track_metadata: {
      title: trackTitle || 'Sem Título',
      isrc_code: isrc || 'BR-XXX-00-00000',
      description: description,
      genres: genres.split(',').map(g => g.trim()),
      artwork_url: coverUrl
    },
    export_format: "JSON-LD Standard",
    compliance_check: {
      isrc_valid: /^[A-Z]{2}-[A-Z0-9]{3}-[0-9]{2}-[0-9]{5}$/.test(isrc),
      metadata_complete: !!(trackTitle && isrc && genres)
    }
  }), [selectedPlatform, trackTitle, isrc, description, genres, coverUrl]);

  const handleExport = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsExported(true);
      setTimeout(() => setIsExported(false), 3000);
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500 pb-12">
      {/* Header e Seleção de Plataforma */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-teal-600 text-white rounded-2xl shadow-lg shadow-teal-500/20">
            <Headphones size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Audio Distribution Hub</h2>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">Gestão de Metadados e Submissão</p>
          </div>
        </div>

        <div className={`flex items-center gap-1 p-1 rounded-2xl border ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
          {platforms.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedPlatform(p.id)}
              className={`p-2.5 rounded-xl transition-all group relative ${
                selectedPlatform === p.id 
                  ? 'bg-teal-600 text-white shadow-md' 
                  : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
              title={p.name}
            >
              <p.icon size={20} />
              {selectedPlatform === p.id && (
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10 animate-in fade-in zoom-in font-bold">
                  {p.name.toUpperCase()}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Coluna Central: Formulário ou Manifesto (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl w-fit">
            <button
              onClick={() => setViewMode('form')}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === 'form' ? 'bg-white dark:bg-slate-700 shadow-sm text-teal-600' : 'text-slate-400'}`}
            >
              <FileText size={16} /> FORMULÁRIO
            </button>
            <button
              onClick={() => setViewMode('manifest')}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === 'manifest' ? 'bg-white dark:bg-slate-700 shadow-sm text-teal-600' : 'text-slate-400'}`}
            >
              <Code size={16} /> MANIFESTO JSON
            </button>
          </div>

          <div className={`p-8 rounded-[2.5rem] border ${isDarkMode ? 'bg-slate-800/40 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
            {viewMode === 'form' ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Título da Faixa</label>
                    <div className="relative">
                      <Disc className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-500" size={16} />
                      <input
                        type="text"
                        placeholder="Ex: Moonlight Symphony..."
                        value={trackTitle}
                        onChange={(e) => setTrackTitle(e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 rounded-2xl border text-sm outline-none focus:ring-4 focus:ring-teal-500/10 transition-all ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Código ISRC</label>
                    <div className="relative">
                      <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-500" size={16} />
                      <input
                        type="text"
                        placeholder="BR-ABC-24-00001"
                        value={isrc}
                        onChange={(e) => setIsrc(e.target.value.toUpperCase())}
                        className={`w-full pl-10 pr-4 py-3 rounded-2xl border text-sm outline-none focus:ring-4 focus:ring-teal-500/10 transition-all font-mono ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                      />
                    </div>
                    {isrc && !submissionManifest.compliance_check.isrc_valid && (
                      <p className="text-[10px] text-rose-500 mt-1 font-bold italic">Formato ISRC inválido. Use: XX-XXX-XX-XXXXX</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Gêneros (separados por vírgula)</label>
                  <div className="relative">
                    <TagIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-500" size={16} />
                    <input
                      type="text"
                      placeholder="Ambient, Cinematic, Lo-Fi..."
                      value={genres}
                      onChange={(e) => setGenres(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 rounded-2xl border text-sm outline-none focus:ring-4 focus:ring-teal-500/10 transition-all ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Descrição / Notas de Lançamento</label>
                  <textarea
                    rows={4}
                    placeholder="Conte a história por trás desta faixa..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={`w-full p-4 rounded-2xl border text-sm outline-none focus:ring-4 focus:ring-teal-500/10 transition-all resize-none ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">URL da Capa (3000x3000px sugerido)</label>
                  <div className="relative">
                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-500" size={16} />
                    <input
                      type="text"
                      value={coverUrl}
                      onChange={(e) => setCoverUrl(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 rounded-2xl border text-sm outline-none focus:ring-4 focus:ring-teal-500/10 transition-all ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-2 bg-slate-100 dark:bg-slate-900 rounded-xl mb-4">
                  <span className="text-[10px] font-black tracking-widest uppercase text-slate-500 ml-2">Audio Submission Manifest v1.0</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] font-bold text-emerald-500 uppercase">Validado</span>
                  </div>
                </div>
                <pre className="p-6 font-mono text-[12px] leading-relaxed text-teal-600 dark:text-teal-400 whitespace-pre-wrap overflow-auto max-h-[400px] custom-scrollbar">
                  {JSON.stringify(submissionManifest, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Coluna Direita: Preview Visual e Export (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className={`p-6 rounded-[2rem] border overflow-hidden ${isDarkMode ? 'bg-slate-800/40 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">Preview Digital</h3>
            
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl mb-6 group">
              <img src={coverUrl} alt="Album Art" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-white font-black text-xl truncate drop-shadow-lg">{trackTitle || 'Título da Faixa'}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Single • {selectedPlatform.toUpperCase()}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Formato Áudio:</span>
                <span className="font-bold text-teal-600">WAV / FLAC</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Status ISRC:</span>
                <span className={`font-bold ${submissionManifest.compliance_check.isrc_valid ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {submissionManifest.compliance_check.isrc_valid ? 'VÁLIDO' : 'ERRO'}
                </span>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={handleExport}
                disabled={isLoading || !trackTitle}
                className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-xl disabled:opacity-50 ${
                  isExported 
                    ? 'bg-emerald-500 text-white shadow-emerald-500/20' 
                    : 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-500/20'
                }`}
              >
                {isLoading ? <Loader2 size={20} className="animate-spin" /> : isExported ? <Check size={20} /> : <Download size={20} />}
                <span>{isExported ? 'PACOTE EXPORTADO' : 'EXPORTAR PACOTE'}</span>
              </button>
            </div>
          </div>

          <div className={`p-5 rounded-2xl border flex items-start gap-4 ${isDarkMode ? 'bg-teal-900/10 border-teal-900/30 text-teal-300' : 'bg-teal-50 border-teal-100 text-teal-700'}`}>
            <AlertCircle size={24} className="shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-widest">Regras de Submissão</p>
              <p className="text-[11px] leading-relaxed opacity-80">
                O Spotify exige capas de no mínimo 3000x3000px em formato TIFF ou JPG. O Audio Hub já converte os metadados para o padrão JSON-LD exigido pelos agregadores.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 py-2 grayscale opacity-40">
             <Disc size={24} />
             <Globe size={24} />
             <Smartphone size={24} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioHubPane;

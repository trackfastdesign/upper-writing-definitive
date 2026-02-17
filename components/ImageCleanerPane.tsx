
import React, { useState, useRef } from 'react';
import { 
  ScanText, 
  Upload, 
  Download, 
  Loader2, 
  X, 
  FileText, 
  Image as ImageIcon,
  Sparkles,
  CheckCircle2,
  Trash2,
  Copy,
  Check,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { extractTextFromImage, cleanImageText } from '../services/geminiService';

const ImageCleanerPane: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const [image, setImage] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [cleanedImage, setCleanedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState('');
  const [step, setStep] = useState<'upload' | 'results'>('upload');
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImage(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const processImage = async () => {
    if (!image) return;
    setIsProcessing(true);
    setStatus("Analisando estrutura visual...");
    
    try {
      // Executa em sequência para fornecer feedback de status mais preciso
      setStatus("Extraindo texto (OCR)...");
      const text = await extractTextFromImage(image);
      setExtractedText(text);
      
      setStatus("Removendo artefatos e reconstruindo fundo...");
      const cleaned = await cleanImageText(image);
      setCleanedImage(cleaned);
      
      setStep('results');
    } catch (error: any) {
      console.error(error);
      alert(`Erro no processamento: ${error.message || "A IA encontrou uma dificuldade técnica com esta imagem."}`);
    } finally {
      setIsProcessing(false);
      setStatus('');
    }
  };

  const reset = () => {
    setImage(null);
    setExtractedText('');
    setCleanedImage(null);
    setStep('upload');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(extractedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6 sm:gap-8 animate-in fade-in duration-500 pb-20">
      <div className={`p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border ${isDarkMode ? 'bg-slate-800/40 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 sm:p-4 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-500/20">
            <ScanText size={24} className="sm:w-7 sm:h-7" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">IA OCR & Limpeza</h2>
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-400">Entrega de Artefatos Digitais</p>
          </div>
        </div>

        {step === 'upload' ? (
          <div 
            onClick={() => !isProcessing && fileInputRef.current?.click()}
            className={`cursor-pointer border-2 border-dashed rounded-[2rem] sm:rounded-[2.5rem] p-10 sm:p-20 flex flex-col items-center justify-center transition-all relative overflow-hidden ${
              image ? 'border-indigo-500 bg-indigo-50/10' : 'border-slate-200 dark:border-slate-800 hover:border-indigo-400'
            } ${isProcessing ? 'cursor-wait' : ''}`}
          >
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
            
            {image ? (
              <div className="relative group max-w-full">
                <img src={image} className="max-h-64 sm:max-h-80 rounded-2xl shadow-2xl transition-all group-hover:scale-[1.02]" alt="Upload" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-2xl transition-opacity">
                  <span className="text-white font-bold text-sm uppercase tracking-widest">Trocar Imagem</span>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-14 h-14 sm:w-20 sm:h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload size={24} className="text-slate-400 sm:w-8 sm:h-8" />
                </div>
                <h3 className="font-bold text-slate-500 text-sm sm:text-base">Clique para carregar sua imagem</h3>
                <p className="text-[9px] sm:text-[10px] text-slate-400 mt-2 uppercase tracking-[0.2em]">Sugerido: Alta resolução (JPG, PNG)</p>
              </div>
            )}

            {isProcessing && (
              <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md flex flex-col items-center justify-center text-white z-20 animate-in fade-in">
                <div className="relative">
                  <Loader2 size={48} className="animate-spin text-indigo-500 mb-4" />
                  <Sparkles size={16} className="absolute top-0 right-0 text-white animate-pulse" />
                </div>
                <p className="text-lg font-black uppercase tracking-widest animate-pulse">{status}</p>
                <p className="text-xs text-indigo-300 mt-2 opacity-60">Isso pode levar alguns segundos...</p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-4">
             <button onClick={reset} className="flex items-center gap-2 px-6 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-rose-500 hover:text-white transition-all">
                <Trash2 size={14} /> Descartar Projeto
             </button>
             <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-500 rounded-xl border border-emerald-500/20">
                <CheckCircle2 size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">Processamento Concluído</span>
             </div>
          </div>
        )}

        {image && step === 'upload' && !isProcessing && (
          <div className="mt-10 flex justify-center">
            <button
              onClick={processImage}
              className="group flex items-center gap-3 px-12 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-2xl shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all uppercase tracking-widest text-sm"
            >
              <Sparkles size={20} />
              <span>Gerar Artefatos</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>

      {step === 'results' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 animate-in slide-in-from-bottom-6 duration-700">
          
          {/* Artefato 1: Texto Extraído */}
          <div className={`flex flex-col gap-4 rounded-[2rem] sm:rounded-[2.5rem] border overflow-hidden transition-all ${isDarkMode ? 'bg-slate-800/40 border-slate-700 shadow-xl' : 'bg-white border-slate-200 shadow-xl shadow-slate-200/50'}`}>
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
               <div className="flex items-center gap-3">
                 <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600"><FileText size={18} /></div>
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Artefato 01: Transcrição</span>
               </div>
               <button 
                onClick={copyToClipboard}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-white dark:bg-slate-800 hover:bg-blue-50 text-blue-500 border border-slate-200 dark:border-slate-700 shadow-sm'}`}
               >
                 {copied ? <Check size={14} /> : <Copy size={14} />}
                 {copied ? 'COPIADO' : 'COPIAR'}
               </button>
            </div>
            <div className="p-6 sm:p-10 flex-1 flex flex-col">
              <div className={`flex-1 rounded-2xl p-6 font-serif text-lg leading-relaxed max-h-[300px] overflow-y-auto custom-scrollbar border border-transparent ${isDarkMode ? 'text-slate-300' : 'text-slate-700 bg-slate-50/50'}`}>
                {extractedText === "Nenhum texto detectado" ? (
                  <div className="h-full flex flex-col items-center justify-center opacity-30 italic">
                    <AlertTriangle size={32} className="mb-2" />
                    <p>Nenhum texto legível foi encontrado.</p>
                  </div>
                ) : (
                  <pre className="whitespace-pre-wrap font-serif">{extractedText}</pre>
                )}
              </div>
            </div>
            <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800">
               <button 
                onClick={() => {
                  const blob = new Blob([extractedText], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `MediaStudio_OCR_${Date.now()}.txt`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                disabled={extractedText === "Nenhum texto detectado"}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-lg shadow-blue-600/20 disabled:opacity-30 transition-all active:scale-[0.98]"
               >
                 <Download size={18} /> Baixar Texto Transcrito
               </button>
            </div>
          </div>

          {/* Artefato 2: Imagem Limpa */}
          <div className={`flex flex-col gap-4 rounded-[2rem] sm:rounded-[2.5rem] border overflow-hidden transition-all ${isDarkMode ? 'bg-slate-800/40 border-slate-700 shadow-xl' : 'bg-white border-slate-200 shadow-xl shadow-slate-200/50'}`}>
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
               <div className="flex items-center gap-3">
                 <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600"><ImageIcon size={18} /></div>
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Artefato 02: Limpeza Visual</span>
               </div>
               <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full border border-emerald-500/20">
                  <CheckCircle2 size={12} />
                  <span className="text-[9px] font-black uppercase tracking-widest">Restaurada</span>
               </div>
            </div>
            <div className="p-6 sm:p-10 flex-1 flex flex-col gap-6">
              <div className="grid grid-cols-2 gap-4 flex-1">
                <div className="space-y-3">
                  <p className="text-[9px] font-black uppercase text-slate-400 text-center tracking-[0.3em]">Original</p>
                  <div className="aspect-square rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 grayscale opacity-40 shadow-inner">
                    <img src={image!} className="w-full h-full object-cover" alt="Original" />
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-[9px] font-black uppercase text-indigo-500 text-center tracking-[0.3em]">Limpa (IA)</p>
                  <div className="aspect-square rounded-2xl overflow-hidden border-2 border-indigo-500/20 shadow-2xl ring-4 ring-indigo-500/5">
                    <img src={cleanedImage!} className="w-full h-full object-cover" alt="Cleaned" />
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 text-center italic">Textos, marcas d'água e elementos de UI removidos com sucesso.</p>
            </div>
            <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800">
               <a 
                href={cleanedImage!} 
                download={`MediaStudio_CleanImage_${Date.now()}.png`}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98]"
               >
                 <Download size={18} /> Baixar Imagem Sem Texto
               </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageCleanerPane;

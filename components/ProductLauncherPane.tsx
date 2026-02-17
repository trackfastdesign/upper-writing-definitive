
import React, { useState } from 'react';
import { 
  Rocket, 
  BookOpen, 
  ShoppingBag, 
  FileText, 
  CheckCircle2, 
  Send, 
  Loader2, 
  ArrowRight,
  Plus,
  Target,
  Users,
  Briefcase,
  Layers,
  Sparkles,
  FileCheck,
  Layout,
  Download,
  Info
} from 'lucide-react';
import { generateCreativeContent } from '../services/geminiService';

interface ProductLauncherPaneProps {
  isDarkMode: boolean;
}

type TabType = 'index' | 'sales' | 'materials';

const ProductLauncherPane: React.FC<ProductLauncherPaneProps> = ({ isDarkMode }) => {
  const [courseTitle, setCourseTitle] = useState('');
  const [niche, setNiche] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('index');
  const [isLoading, setIsLoading] = useState(false);
  
  const [generatedIndex, setGeneratedIndex] = useState('');
  const [generatedSalesPage, setGeneratedSalesPage] = useState('');
  const [generatedMaterials, setGeneratedMaterials] = useState('');

  const handleLaunch = async () => {
    if (!courseTitle || !niche) return;
    setIsLoading(true);
    
    const systemPrompt = "Você é um Estrategista de Lançamentos de Infoprodutos e Copywriter Sênior. Sua missão é transformar uma ideia bruta em um produto digital estruturado e altamente vendável.";

    try {
      // 1. Gerar Índice do Curso
      const indexPrompt = `Crie um currículo estruturado para o curso: "${courseTitle}" no nicho de "${niche}" para o público "${targetAudience}". 
      Divida em 5 Módulos, cada um com 3 a 4 aulas. Use Markdown para títulos (# Módulo, ## Aula).`;
      await generateCreativeContent(indexPrompt, systemPrompt, (text) => setGeneratedIndex(text));

      // 2. Gerar Sales Page (AIDA)
      const salesPrompt = `Crie uma página de vendas (Sales Page) usando o framework AIDA (Atenção, Interesse, Desejo, Ação) para o curso "${courseTitle}".
      Inclua: Título Matador (Hero), Identificação do Problema, Promessa da Solução, Detalhes do Produto, Bônus, Preço Sugerido e Call to Action.`;
      await generateCreativeContent(salesPrompt, systemPrompt, (text) => setGeneratedSalesPage(text));

      // 3. Gerar Materiais de Apoio
      const materialsPrompt = `Sugira 5 materiais complementares em PDF (workbooks, checklists, guias) que agregariam valor ao curso "${courseTitle}". Descreva brevemente o conteúdo de cada um.`;
      await generateCreativeContent(materialsPrompt, systemPrompt, (text) => setGeneratedMaterials(text));

      setActiveTab('index');
    } catch (error) {
      console.error(error);
      alert('Erro ao processar lançamento.');
    } finally {
      setIsLoading(false);
    }
  };

  const TabButton = ({ id, label, icon: Icon }: { id: TabType; label: string; icon: any }) => (
    <button
      onClick={() => setActiveTab(id)}
      disabled={!generatedIndex && id !== 'index'}
      className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold transition-all border-b-2 ${
        activeTab === id 
          ? 'border-amber-500 text-amber-600 bg-amber-500/5' 
          : 'border-transparent text-slate-400 hover:text-slate-600'
      } disabled:opacity-30`}
    >
      <Icon size={16} />
      <span>{label.toUpperCase()}</span>
    </button>
  );

  return (
    <div className="flex flex-col gap-8 pb-20 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-amber-500 text-white rounded-2xl shadow-lg shadow-amber-500/20">
            <Rocket size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Product Launcher</h2>
            <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest">Estratégia & Monetização de Infoprodutos</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Input Config */}
        <div className="lg:col-span-4 space-y-6">
          <div className={`p-8 rounded-[2.5rem] border ${isDarkMode ? 'bg-slate-800/40 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
              <Layout size={16} className="text-amber-500" /> Definição do Produto
            </h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Título do Infoproduto</label>
                <div className="relative">
                  <Target className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500" size={16} />
                  <input
                    type="text"
                    placeholder="Ex: Maestria em IA para Design..."
                    value={courseTitle}
                    onChange={(e) => setCourseTitle(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-2xl border text-sm focus:ring-4 focus:ring-amber-500/10 outline-none transition-all ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Nicho / Área de Atuação</label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500" size={16} />
                  <input
                    type="text"
                    placeholder="Ex: Marketing Digital, Saúde, Finanças..."
                    value={niche}
                    onChange={(e) => setNiche(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-2xl border text-sm focus:ring-4 focus:ring-amber-500/10 outline-none transition-all ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Avatar / Público-Alvo</label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500" size={16} />
                  <input
                    type="text"
                    placeholder="Ex: Designers iniciantes que buscam..."
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-2xl border text-sm focus:ring-4 focus:ring-amber-500/10 outline-none transition-all ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                  />
                </div>
              </div>

              <button
                onClick={handleLaunch}
                disabled={isLoading || !courseTitle || !niche}
                className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-xl shadow-amber-500/20 disabled:opacity-50"
              >
                {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Rocket size={20} />}
                <span>ESTRUTURAR LANÇAMENTO</span>
              </button>
            </div>
          </div>

          <div className={`p-6 rounded-2xl border flex items-start gap-4 ${isDarkMode ? 'bg-amber-900/10 border-amber-900/30 text-amber-300' : 'bg-amber-50 border-amber-100 text-amber-700'}`}>
            <Sparkles size={24} className="shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-widest">IA Strategic Planner</p>
              <p className="text-[11px] leading-relaxed opacity-80">
                O Product Launcher utiliza modelos de persuasão baseados em psicologia de consumo para garantir que sua oferta seja irresistível.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Output Areas */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className={`p-4 rounded-3xl border ${isDarkMode ? 'bg-slate-800/40 border-slate-700' : 'bg-white border-slate-200 shadow-sm'} flex-1 flex flex-col min-h-[600px]`}>
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 mb-6">
              <TabButton id="index" label="Grade do Curso" icon={Layers} />
              <TabButton id="sales" label="Sales Page (AIDA)" icon={ShoppingBag} />
              <TabButton id="materials" label="Materiais de Apoio" icon={FileCheck} />
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
              {isLoading && !generatedIndex ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                  <Loader2 size={48} className="animate-spin mb-4 text-amber-500" />
                  <p className="text-sm font-bold uppercase tracking-widest">Modelando seu produto digital...</p>
                </div>
              ) : !generatedIndex ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                  <BookOpen size={80} className="mb-4" />
                  <p className="text-sm font-bold uppercase tracking-widest max-w-xs">Preencha as configurações ao lado para iniciar o lançamento</p>
                </div>
              ) : (
                <div className={`prose dark:prose-invert max-w-none animate-in fade-in duration-500 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  {activeTab === 'index' && (
                    <div dangerouslySetInnerHTML={{ __html: formatOutput(generatedIndex) }} />
                  )}
                  {activeTab === 'sales' && (
                    <div dangerouslySetInnerHTML={{ __html: formatOutput(generatedSalesPage) }} />
                  )}
                  {activeTab === 'materials' && (
                    <div dangerouslySetInnerHTML={{ __html: formatOutput(generatedMaterials) }} />
                  )}
                </div>
              )}
            </div>

            {generatedIndex && (
              <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <CheckCircle2 size={14} className="text-emerald-500" /> Conteúdo Validado
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <Info size={14} className="text-amber-500" /> IA Copilot Active
                  </div>
                </div>
                <button className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white dark:bg-slate-700 rounded-xl text-xs font-bold hover:bg-black transition-all">
                  <Download size={16} /> EXPORTAR BUNDLE
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Formatação simples de Markdown para exibição rica
const formatOutput = (text: string) => {
  return text
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-black mb-6 text-amber-600 dark:text-amber-500 border-b pb-2 border-amber-500/20">$1</h1>')
    .replace(/^## (.*$)/gim, '<h2 class="text-lg font-bold mt-8 mb-4 text-slate-800 dark:text-white flex items-center gap-2"><span class="w-1.5 h-6 bg-amber-500 rounded-full"></span>$1</h2>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-amber-600 font-extrabold">$1</strong>')
    .replace(/\n/g, '<br/>');
};

export default ProductLauncherPane;


import React from 'react';
import { 
  LayoutTemplate, 
  FileText, 
  Video, 
  Search, 
  Code, 
  Rocket, 
  ChevronRight, 
  Sparkles,
  ArrowRight,
  BookOpen,
  Mail,
  Zap
} from 'lucide-react';
import { AppView, ContentItem, ContentStatus } from '../types';

interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  targetView: AppView;
  icon: any;
  color: string;
  content: string;
}

const TEMPLATES_DATA: Template[] = [
  {
    id: 'blog-post-seo',
    title: 'Artigo de Blog (Ultra-SEO)',
    description: 'Estrutura otimizada para rankeamento com H1, introdução AIDA e intertítulos estratégicos.',
    category: 'Editorial',
    targetView: AppView.SEO_EDITING,
    icon: FileText,
    color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20',
    content: `# [TÍTULO OTIMIZADO COM PALAVRA-CHAVE]\n\n## Introdução (Gancho AIDA)\n[Escreva aqui uma introdução que prenda a atenção, desperte interesse, desejo e chame para ação.]\n\n## Por que [Tópico Principal] é fundamental hoje?\n[Desenvolva o contexto do problema ou oportunidade.]\n\n## 5 Passos para Dominar [Tópico]\n\n### 1. Passo Inicial\n[Explicação detalhada...]\n\n### 2. Desenvolvimento...\n\n## Conclusão e Próximos Passos\n[Resumo e CTA principal.]\n\n--- \n**Sugestão de Meta Description:** [Insira aqui a descrição para o Google]`
  },
  {
    id: 'video-script-storyboard',
    title: 'Roteiro Storyboard (Veo)',
    description: 'Tabela técnica completa para produção audiovisual, compatível com o gerador Veo.',
    category: 'Vídeo',
    targetView: AppView.VIDEO_SCRIPTS,
    icon: Video,
    color: 'text-rose-500 bg-rose-50 dark:bg-rose-900/20',
    content: `| Tempo | Áudio | Visual | Notas de Produção |\n| --- | --- | --- | --- |\n| 00:00 | "Seja bem-vindo ao MediaStudio Pro, sua central criativa." | Close-up no logo girando em estilo neon cyberpunk. | Trilha: Synthwave suave. |\n| 00:05 | "Hoje vamos descobrir como a IA revoluciona o jornalismo." | Corte para apresentador em estúdio virtual moderno. | Luzes azuis volumétricas. |\n| 00:15 | "Tudo começa com um simples prompt..." | Overlay de interface de código e prompt de IA. | Efeito sonoro de digitação digital. |`
  },
  {
    id: 'newsletter-launch',
    title: 'Newsletter de Lançamento',
    description: 'Focado em conversão e engajamento direto com a audiência via email.',
    category: 'Monetização',
    targetView: AppView.CREATIVE_WRITING,
    icon: Mail,
    color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20',
    content: `# Assunto: Algo grande está chegando à sua redação... 🚀\n\nOlá, [NOME]!\n\nVocê já sentiu que o tempo é o seu maior inimigo na criação de conteúdo?\n\nSabemos que a rotina de um jornalista é frenética. Por isso, desenvolvemos algo que vai mudar seu fluxo de trabalho para sempre.\n\n## Conheça o novo MediaStudio Pro\n\n[Destaque aqui os 3 principais benefícios do produto...]\n\n**O que você ganha com isso?**\n- Economia de 70% no tempo de roteirização.\n- Fact-checking instantâneo com Google Search.\n- Distribuição global em 1 clique.\n\n[BOTÃO DE CTA: QUERO ACESSO ANTECIPADO]\n\nUm abraço,\nEquipe MediaStudio`
  },
  {
    id: 'api-documentation',
    title: 'Manual de Integração API',
    description: 'Layout técnico limpo para desenvolvedores, com blocos de código e endpoints.',
    category: 'Tech',
    targetView: AppView.TECH_DOCS,
    icon: Code,
    color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20',
    content: `# Guia de Integração - MediaStudio API v3\n\n## Overview\nEste guia descreve como conectar sua aplicação ao motor criativo Gemini 3.0 via MediaStudio.\n\n## Autenticação\nTodos os endpoints exigem uma chave Bearer Token no cabeçalho:\n\`\`\`bash\nAuthorization: Bearer YOUR_API_KEY\n\`\`\`\n\n## Endpoints Principais\n\n### 1. Gerar Conteúdo\n**POST** \`/v3/generate\`\n\n**Payload:**\n\`\`\`json\n{\n  "prompt": "Sua instrução aqui",\n  "max_tokens": 2048\n}\n\`\`\`\n\n## Limites de Taxa\n- 60 requisições por minuto no Plano Pro.`
  },
  {
    id: 'product-pitch',
    title: 'Pitch de Venda (Infoproduto)',
    description: 'Script persuasivo para landing pages focado em transformar leitores em compradores.',
    category: 'Vendas',
    targetView: AppView.PRODUCT_LAUNCHER,
    icon: Rocket,
    color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20',
    content: `# Headline: Domine a Arte de Criar com IA em Menos de 30 Dias!\n\n## O Problema\n[Você está cansado de olhar para uma tela branca?]\n\n## A Solução\n[Apresentamos o Método MediaStudio: O Atalho Criativo.]\n\n## O Que Você Vai Aprender\n1. Como treinar sua própria IA.\n2. Automação de postagens sociais.\n3. Monetização de roteiros de vídeo.\n\n## Garantia e Bônus\n[Garantia incondicional de 7 dias + Bônus: Pack de Prompts Exclusivos.]\n\n[VALOR: DE R$ 997 POR APENAS R$ 497]`
  }
];

interface TemplatesPaneProps {
  onApply: (view: AppView, item: ContentItem) => void;
  isDarkMode: boolean;
}

const TemplatesPane: React.FC<TemplatesPaneProps> = ({ onApply, isDarkMode }) => {
  const handleSelectTemplate = (template: Template) => {
    const newItem: ContentItem = {
      id: `template_${Date.now()}`,
      title: template.title,
      content: template.content,
      type: template.targetView,
      status: ContentStatus.DRAFT,
      date: new Date().toLocaleDateString(),
      tags: ['Template', template.category],
      versions: []
    };
    onApply(template.targetView, newItem);
  };

  return (
    <div className="flex flex-col gap-10 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
          Centro de Templates
          <span className="p-2 bg-blue-600/10 text-blue-600 rounded-xl">
            <LayoutTemplate size={20} />
          </span>
        </h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl">
          Acelere seu fluxo de trabalho com estruturas profissionais testadas para máximo engajamento e clareza técnica.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TEMPLATES_DATA.map((template) => (
          <div 
            key={template.id}
            onClick={() => handleSelectTemplate(template)}
            className={`group relative p-8 rounded-[2.5rem] border transition-all cursor-pointer flex flex-col h-full ${
              isDarkMode 
                ? 'bg-slate-800/40 border-slate-700 hover:border-blue-500/50 hover:bg-slate-800/60' 
                : 'bg-white border-slate-200 shadow-sm hover:shadow-2xl hover:-translate-y-1'
            }`}
          >
            <div className="flex items-start justify-between mb-8">
              <div className={`p-4 rounded-2xl shadow-sm ${template.color}`}>
                <template.icon size={28} />
              </div>
              <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-500' : 'bg-slate-50 border-slate-100 text-slate-400'
              }`}>
                {template.category}
              </div>
            </div>

            <div className="flex-1">
              <h3 className="text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors">
                {template.title}
              </h3>
              <p className={`text-sm leading-relaxed mb-8 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {template.description}
              </p>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                <Zap size={14} className="text-amber-500" />
                <span>Usar no {template.targetView}</span>
              </div>
              <div className="p-2 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-600/20 opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0">
                <ArrowRight size={18} />
              </div>
            </div>
          </div>
        ))}

        {/* Custom Template Placeholder Card */}
        <div className={`p-8 rounded-[2.5rem] border-2 border-dashed flex flex-col items-center justify-center text-center gap-4 group transition-all ${
          isDarkMode ? 'border-slate-800 bg-slate-800/10 hover:border-slate-700' : 'border-slate-100 bg-slate-50/50 hover:border-slate-200'
        }`}>
          <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
            <Plus size={32} />
          </div>
          <div>
            <h4 className="font-bold text-slate-500">Criar Novo Template</h4>
            <p className="text-xs text-slate-400 mt-1">Transforme um rascunho em modelo reutilizável.</p>
          </div>
        </div>
      </div>

      <div className={`p-8 rounded-[2rem] border flex items-center gap-8 ${
        isDarkMode ? 'bg-indigo-900/10 border-indigo-900/20' : 'bg-indigo-50 border-indigo-100'
      }`}>
        <div className="hidden lg:flex p-6 bg-indigo-600 text-white rounded-[2rem] shadow-xl shadow-indigo-600/20">
          <Sparkles size={40} />
        </div>
        <div className="flex-1">
          <h4 className="text-lg font-bold text-indigo-900 dark:text-indigo-400 mb-2">Estruturas Dinâmicas</h4>
          <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-indigo-700/70'}`}>
            Ao selecionar um template, o editor correspondente será aberto com a estrutura pronta. Você pode então usar a barra de ferramentas de IA para expandir cada seção ou preencher os dados reais.
          </p>
        </div>
        <button className="hidden lg:flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-indigo-600/20">
          Ver Documentação <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

const Plus = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

export default TemplatesPane;

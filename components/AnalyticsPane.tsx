
import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  Users, 
  Clock, 
  MessageSquare,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Activity,
  FileDown,
  Globe,
  Instagram,
  Linkedin,
  Youtube,
  Twitter,
  ChevronRight,
  Target,
  ShoppingCart,
  MousePointer2,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart,
  Area,
  Cell,
  PieChart,
  Pie
} from 'recharts';

interface AnalyticsPaneProps {
  isDarkMode: boolean;
}

const AnalyticsPane: React.FC<AnalyticsPaneProps> = ({ isDarkMode }) => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [isExporting, setIsExporting] = useState(false);

  const engagementData = [
    { name: 'Instagram', value: 4.8, color: '#E1306C' },
    { name: 'LinkedIn', value: 3.2, color: '#0077B5' },
    { name: 'YouTube', value: 5.5, color: '#FF0000' },
    { name: 'Twitter', value: 2.1, color: '#1DA1F2' },
  ];

  const funnelData = [
    { step: 'Leitores', count: '124.5k', percentage: 100, icon: Users, color: 'bg-blue-500' },
    { step: 'Interessados', count: '45.2k', percentage: 36, icon: MousePointer2, color: 'bg-indigo-500' },
    { step: 'Leads', count: '12.8k', percentage: 10, icon: Target, color: 'bg-purple-500' },
    { step: 'Compradores', count: '2.4k', percentage: 2, icon: ShoppingCart, color: 'bg-emerald-500' },
  ];

  const handleExportReport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert('Relatório Mensal consolidado gerado com sucesso! Iniciando download do PDF...');
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Dynamic Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
            Insights do Ecossistema
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] uppercase font-black rounded-full border border-emerald-500/20">Live</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Consolidação de dados multi-plataforma e performance de vendas.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
            {(['week', 'month', 'year'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                  timeRange === range 
                    ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
              >
                {range === 'week' ? 'Semana' : range === 'month' ? 'Mês' : 'Ano'}
              </button>
            ))}
          </div>
          
          <button 
            onClick={handleExportReport}
            disabled={isExporting}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-blue-600/20 disabled:opacity-50"
          >
            {isExporting ? <Loader2 size={16} className="animate-spin" /> : <FileDown size={16} />}
            {isExporting ? 'Processando...' : 'Gerar Relatório PDF'}
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`p-8 rounded-[2.5rem] border ${isDarkMode ? 'bg-slate-800/40 border-slate-700' : 'bg-white border-slate-200 shadow-sm'} relative overflow-hidden group`}>
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Alcance Total</p>
          <div className="flex items-end gap-3">
            <h3 className="text-4xl font-black tracking-tighter">842.5k</h3>
            <span className="mb-1.5 flex items-center gap-1 text-xs font-bold text-emerald-500">
              <ArrowUpRight size={14} /> +12%
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-4 flex items-center gap-1"><Globe size={10}/> Consolidado de 6 redes sociais</p>
        </div>

        <div className={`p-8 rounded-[2.5rem] border ${isDarkMode ? 'bg-slate-800/40 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Engajamento Médio</p>
          <div className="flex items-end gap-3">
            <h3 className="text-4xl font-black tracking-tighter">4.2%</h3>
            <span className="mb-1.5 flex items-center gap-1 text-xs font-bold text-rose-500">
              <ArrowDownRight size={14} /> -0.4%
            </span>
          </div>
          <div className="flex gap-2 mt-4">
            {engagementData.map(plat => (
              <div key={plat.name} className="w-1.5 h-4 rounded-full" style={{ backgroundColor: plat.color }}></div>
            ))}
          </div>
        </div>

        <div className={`p-8 rounded-[2.5rem] border ${isDarkMode ? 'bg-indigo-600 text-white' : 'bg-indigo-900 text-white'} shadow-2xl shadow-indigo-600/20`}>
          <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300 mb-2">ROI de Infoprodutos</p>
          <div className="flex items-end gap-3">
            <h3 className="text-4xl font-black tracking-tighter">3.8x</h3>
            <span className="mb-1.5 flex items-center gap-1 text-xs font-bold text-emerald-300">
              <ArrowUpRight size={14} /> +0.5x
            </span>
          </div>
          <p className="text-[10px] text-indigo-300 mt-4 flex items-center gap-1"><CheckCircle2 size={10}/> Performance acima da meta (2.5x)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Engagement Chart */}
        <div className={`lg:col-span-7 p-8 rounded-[2.5rem] border ${isDarkMode ? 'bg-slate-800/40 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold tracking-tight flex items-center gap-2">
              <TrendingUp size={20} className="text-blue-500" />
              Taxa de Engajamento por Rede
            </h3>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={engagementData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={isDarkMode ? '#334155' : '#f1f5f9'} />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  fontSize={12} 
                  fontWeight="bold" 
                  width={80}
                  stroke={isDarkMode ? '#94a3b8' : '#64748b'}
                />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-900 text-white p-2 px-3 rounded-lg text-xs font-bold shadow-xl border border-slate-700">
                          {payload[0].value}% de Engajamento
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={32}>
                  {engagementData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className={`lg:col-span-5 p-8 rounded-[2.5rem] border ${isDarkMode ? 'bg-slate-800/40 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
          <h3 className="text-lg font-bold tracking-tight mb-8 flex items-center gap-2">
            <ShoppingCart size={20} className="text-emerald-500" />
            Funil de Conversão
          </h3>
          <div className="space-y-4">
            {funnelData.map((step, idx) => (
              <div key={step.step} className="relative">
                <div 
                  className={`h-14 rounded-2xl flex items-center justify-between px-6 transition-all hover:scale-[1.02] ${isDarkMode ? 'bg-slate-900/50 border border-slate-800' : 'bg-slate-50 border border-slate-100'}`}
                  style={{ width: `${100 - (idx * 5)}%`, marginLeft: `${idx * 2.5}%` }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg text-white ${step.color} shadow-lg shadow-current/20`}>
                      <step.icon size={16} />
                    </div>
                    <span className="text-xs font-bold">{step.step}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black">{step.count}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase">{step.percentage}% Conv.</p>
                  </div>
                </div>
                {idx < funnelData.length - 1 && (
                  <div className="flex justify-center my-1 opacity-20">
                    <ChevronRight size={16} className="rotate-90 text-slate-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Network Comparison Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Instagram, label: 'Instagram', value: '42.5k', color: 'text-pink-500', bg: 'bg-pink-500/10' },
          { icon: Linkedin, label: 'LinkedIn', value: '18.2k', color: 'text-blue-600', bg: 'bg-blue-600/10' },
          { icon: Youtube, label: 'YouTube', value: '124k', color: 'text-red-500', bg: 'bg-red-500/10' },
          { icon: Twitter, label: 'Twitter', value: '8.4k', color: 'text-sky-500', bg: 'bg-sky-500/10' },
        ].map(plat => (
          <div key={plat.label} className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-slate-800/40 border-slate-700' : 'bg-white border-slate-100'} flex flex-col items-center text-center gap-3`}>
            <div className={`p-3 rounded-2xl ${plat.bg} ${plat.color}`}>
              <plat.icon size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{plat.label}</p>
              <h4 className="text-xl font-black">{plat.value}</h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsPane;

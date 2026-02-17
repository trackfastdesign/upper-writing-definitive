
import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Video, 
  Trash2, 
  Clock, 
  Tag as TagIcon,
  ExternalLink,
  History,
  Share2,
  Search,
  Filter,
  X,
  FileSearch,
  CheckCircle2,
  Clock3,
  Archive as ArchiveIcon,
  ChevronDown,
  LayoutGrid,
  List,
  Plus,
  Check,
  Hash
} from 'lucide-react';
import { ContentItem, AppView, ContentStatus } from '../types';

interface ArchivePaneProps {
  items: ContentItem[];
  onDelete: (id: string) => void;
  onSelect: (item: ContentItem) => void;
  onShowHistory: (item: ContentItem) => void;
}

const ArchivePane: React.FC<ArchivePaneProps> = ({ items, onDelete, onSelect, onShowHistory }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ContentStatus | 'All'>('All');
  const [typeFilter, setTypeFilter] = useState<AppView | 'All'>('All');
  const [tagFilter, setTagFilter] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Extrai todas as tags únicas dos itens para o dropdown
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    items.forEach(item => {
      if (item.tags) {
        item.tags.forEach(tag => tags.add(tag));
      }
    });
    return Array.from(tags).sort();
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (item.tags && item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
      const matchesType = typeFilter === 'All' || item.type === typeFilter;
      const matchesTag = tagFilter === 'All' || (item.tags && item.tags.includes(tagFilter));
      
      return matchesSearch && matchesStatus && matchesType && matchesTag;
    });
  }, [items, searchQuery, statusFilter, typeFilter, tagFilter]);

  const handleShare = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const shareLink = `${window.location.origin}/archive?id=${id}`;
    
    navigator.clipboard.writeText(shareLink).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }).catch(err => {
      console.error('Erro ao copiar link:', err);
    });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setTypeFilter('All');
    setTagFilter('All');
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      {/* Search and Filters Header */}
      <div className="flex flex-col gap-4 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input 
              type="text"
              placeholder="Pesquisa por título, conteúdo ou #tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm"
            />
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
             <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl">
               <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm' : 'text-slate-400'}`}
               >
                 <LayoutGrid size={18} />
               </button>
               <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm' : 'text-slate-400'}`}
               >
                 <List size={18} />
               </button>
             </div>

             <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-2 shrink-0"></div>

             <select 
               value={tagFilter}
               onChange={(e) => setTagFilter(e.target.value)}
               className="px-4 py-2 bg-slate-100 dark:bg-slate-900 border-none rounded-xl text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 focus:ring-2 focus:ring-blue-500 cursor-pointer min-w-[120px]"
             >
               <option value="All">Todas Tags</option>
               {allTags.map(tag => (
                 <option key={tag} value={tag}>#{tag}</option>
               ))}
             </select>

             <select 
               value={statusFilter}
               onChange={(e) => setStatusFilter(e.target.value as any)}
               className="px-4 py-2 bg-slate-100 dark:bg-slate-900 border-none rounded-xl text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 focus:ring-2 focus:ring-blue-500 cursor-pointer"
             >
               <option value="All">Status</option>
               <option value={ContentStatus.DRAFT}>Rascunhos</option>
               <option value={ContentStatus.PUBLISHED}>Publicados</option>
             </select>

             <select 
               value={typeFilter}
               onChange={(e) => setTypeFilter(e.target.value as any)}
               className="px-4 py-2 bg-slate-100 dark:bg-slate-900 border-none rounded-xl text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 focus:ring-2 focus:ring-blue-500 cursor-pointer"
             >
               <option value="All">Categorias</option>
               {Object.values(AppView).map(v => (
                 <option key={v} value={v}>{v}</option>
               ))}
             </select>

             {(searchQuery || statusFilter !== 'All' || typeFilter !== 'All' || tagFilter !== 'All') && (
               <button 
                onClick={clearFilters}
                className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all shrink-0"
                title="Limpar Filtros"
               >
                 <X size={20} />
               </button>
             )}
          </div>
        </div>
      </div>

      {/* Results Info */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <ArchiveIcon size={18} className="text-blue-500" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            {filteredItems.length} artefatos encontrados
          </span>
        </div>
        {tagFilter !== 'All' && (
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full border border-blue-100 dark:border-blue-800 text-[10px] font-bold">
            <TagIcon size={12} />
            Filtrando por: #{tagFilter}
          </div>
        )}
      </div>

      {filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
            <FileSearch size={48} className="text-slate-300 dark:text-slate-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">Nada no Cofre</h3>
          <p className="text-slate-500 max-w-sm">
            Não encontramos itens que correspondam aos filtros selecionados.
          </p>
          <button onClick={clearFilters} className="mt-4 text-blue-600 font-bold text-sm hover:underline">Limpar filtros e tentar novamente</button>
        </div>
      ) : (
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" 
          : "flex flex-col gap-3"
        }>
          {filteredItems.map((item) => (
            <div 
              key={item.id}
              onClick={() => onSelect(item)}
              className={`group relative bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer ${
                viewMode === 'grid' 
                  ? 'rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 p-0' 
                  : 'rounded-2xl p-4 flex items-center gap-4 hover:border-blue-500/50'
              }`}
            >
              {viewMode === 'grid' && (
                <div className={`h-2 w-full ${
                  item.type === AppView.VIDEO_SCRIPTS ? 'bg-rose-500' : 
                  item.type === AppView.SEO_EDITING ? 'bg-blue-500' : 
                  item.type === AppView.TECH_DOCS ? 'bg-slate-500' :
                  'bg-emerald-500'
                }`}></div>
              )}
              
              <div className={viewMode === 'grid' ? "p-6" : "contents"}>
                <div className={`flex items-start justify-between ${viewMode === 'grid' ? 'mb-4' : 'flex-none'}`}>
                  <div className={`p-2 rounded-xl ${
                    item.type === AppView.VIDEO_SCRIPTS ? 'bg-rose-50 text-rose-600' : 
                    item.type === AppView.SEO_EDITING ? 'bg-blue-50 text-blue-600' : 
                    'bg-emerald-50 text-emerald-600'
                  } dark:bg-slate-700 shadow-sm`}>
                    {item.type === AppView.VIDEO_SCRIPTS ? <Video size={18} /> : <FileText size={18} />}
                  </div>
                  
                  <div className="flex gap-1">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(item.id);
                      }}
                      className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                      title="Excluir"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className={viewMode === 'list' ? 'flex-1 min-w-0' : ''}>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`font-bold truncate ${viewMode === 'grid' ? 'text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400' : 'text-sm'}`}>
                      {item.title}
                    </h3>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest border ${
                      item.status === ContentStatus.PUBLISHED 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-900' 
                        : 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:border-amber-900'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  
                  {viewMode === 'grid' && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 mb-6 h-15 leading-relaxed">
                      {item.content.substring(0, 150)}...
                    </p>
                  )}
                  
                  {viewMode === 'list' && (
                    <div className="flex items-center gap-3 text-[10px] text-slate-400">
                      <span className="flex items-center gap-1"><Clock size={10} /> {item.date}</span>
                      <span className="flex items-center gap-1 uppercase tracking-tighter font-bold">{item.type}</span>
                    </div>
                  )}
                </div>

                {viewMode === 'grid' && (
                  <>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {item.tags && item.tags.map(tag => (
                        <span 
                          key={tag} 
                          onClick={(e) => {
                            e.stopPropagation();
                            setTagFilter(tag);
                          }}
                          className={`flex items-center gap-1 px-2.5 py-1 text-[10px] uppercase font-bold rounded-lg border transition-all ${
                            tagFilter === tag 
                              ? 'bg-blue-600 text-white border-blue-600' 
                              : 'bg-slate-100 dark:bg-slate-700/50 text-slate-500 dark:text-slate-300 border-transparent hover:border-blue-500/50'
                          }`}
                        >
                          <TagIcon size={10} />
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-black uppercase tracking-widest">
                        <Clock size={12} />
                        {item.date}
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={(e) => handleShare(e, item.id)}
                          className={`flex items-center gap-1.5 text-[10px] font-black px-3 py-1.5 rounded-xl transition-all uppercase tracking-widest ${
                            copiedId === item.id 
                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                            : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-600 hover:text-white'
                          }`}
                        >
                          {copiedId === item.id ? (
                            <>
                              <Check size={14} /> COPIADO
                            </>
                          ) : (
                            <>
                              <Share2 size={14} /> SHARE
                            </>
                          )}
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onShowHistory(item);
                          }}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all"
                          title="Histórico de Versões"
                        >
                          <History size={16} />
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {viewMode === 'list' && (
                   <div className="flex items-center gap-3 ml-auto">
                      <div className="hidden sm:flex gap-1 mr-2">
                        {item.tags && item.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-[9px] font-bold text-slate-500">#{tag}</span>
                        ))}
                      </div>
                      <button 
                        onClick={(e) => handleShare(e, item.id)}
                        className={`flex items-center gap-1.5 text-[10px] font-black px-3 py-1.5 rounded-xl transition-all uppercase tracking-widest ${
                          // Fix: replaced undefined variable 'id' with 'item.id'
                          copiedId === item.id 
                          ? 'bg-emerald-500 text-white' 
                          : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white shadow-sm'
                        }`}
                      >
                        {copiedId === item.id ? (
                          <>
                            <Check size={14} /> COPIADO
                          </>
                        ) : (
                          <>
                            <Share2 size={14} /> SHARE
                          </>
                        )}
                      </button>
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(item.id);
                        }}
                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                   </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArchivePane;

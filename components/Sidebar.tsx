
import React from 'react';
import { 
  PenTool, 
  Video, 
  Search, 
  BarChart3, 
  Archive,
  LayoutDashboard,
  LayoutTemplate,
  Users,
  Settings,
  Circle,
  Code,
  Image as ImageIcon,
  Wand2,
  X,
  Share2,
  BookOpen,
  Music,
  Rocket,
  Clapperboard,
  ScanText
} from 'lucide-react';
import { AppView } from '../types';

interface SidebarProps {
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isDarkMode: boolean;
  hasUnsavedChanges: boolean;
}

interface NavGroup {
  title: string;
  items: { id: AppView; icon: any; label: string; isEditor?: boolean }[];
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeView, 
  setActiveView, 
  isOpen, 
  setIsOpen,
  isDarkMode, 
  hasUnsavedChanges 
}) => {
  const navGroups: NavGroup[] = [
    {
      title: 'Criação',
      items: [
        { id: AppView.CREATIVE_WRITING, icon: PenTool, label: 'Escrita Criativa', isEditor: true },
        { id: AppView.VIDEO_SCRIPTS, icon: Video, label: 'Scripts de Vídeo', isEditor: true },
        { id: AppView.FILM_STUDIO, icon: Clapperboard, label: 'Estúdio de Cinema' },
        { id: AppView.SEO_EDITING, icon: Search, label: 'SEO & Redação', isEditor: true },
        { id: AppView.TECH_DOCS, icon: Code, label: 'Doc. Técnica', isEditor: true },
        { id: AppView.IMAGE_LAB, icon: ImageIcon, label: 'Lab. de Imagens' },
        { id: AppView.IMAGE_CLEANER, icon: ScanText, label: 'OCR & Limpeza' },
        { id: AppView.REPURPOSING, icon: Wand2, label: 'Multi-Format Magic' },
      ]
    },
    {
      title: 'Distribuição',
      items: [
        { id: AppView.SOCIAL_HUB, icon: Share2, label: 'Social Hub' },
        { id: AppView.EDITORIAL_PUB, icon: BookOpen, label: 'Publicação Editorial' },
        { id: AppView.AUDIO_HUB, icon: Music, label: 'Audio Hub' },
      ]
    },
    {
      title: 'Monetização',
      items: [
        { id: AppView.PRODUCT_LAUNCHER, icon: Rocket, label: 'Product Launcher' },
      ]
    },
    {
      title: 'Biblioteca',
      items: [
        { id: AppView.TEMPLATES, icon: LayoutTemplate, label: 'Templates' },
        { id: AppView.ARCHIVE, icon: Archive, label: 'Arquivos' },
      ]
    },
    {
      title: 'Insights',
      items: [
        { id: AppView.ANALYTICS, icon: BarChart3, label: 'Analytics' },
      ]
    },
    {
      title: 'Gestão',
      items: [
        { id: AppView.TEAM, icon: Users, label: 'Colaboração' },
        { id: AppView.SETTINGS, icon: Settings, label: 'Configurações' },
      ]
    }
  ];

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[90] lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`
        fixed left-0 top-0 bottom-0 z-[100] w-64 border-r transition-all duration-300 ease-in-out shadow-2xl lg:shadow-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white shadow-lg">
                <LayoutDashboard size={20} />
              </div>
              <div>
                <h1 className="font-extrabold text-base tracking-tight dark:text-white">MediaStudio</h1>
                <p className={`text-[9px] uppercase font-bold tracking-widest ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>Pro Creator</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="lg:hidden p-2 text-slate-400"><X size={20} /></button>
          </div>

          <nav className="flex-1 px-3 py-2 space-y-5 overflow-y-auto custom-scrollbar">
            {navGroups.map((group) => (
              <div key={group.title} className="space-y-1">
                <h3 className={`px-4 text-[9px] font-black uppercase tracking-[0.2em] mb-2 ${isDarkMode ? 'text-slate-600' : 'text-slate-500'}`}>{group.title}</h3>
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const isActive = activeView === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveView(item.id)}
                        className={`w-full flex items-center justify-between px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${isActive ? 'bg-blue-600 text-white shadow-lg' : `hover:bg-slate-100 dark:hover:bg-slate-800/50 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}`}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon size={16} className={isActive ? 'text-white' : 'text-slate-400'} />
                          <span>{item.label}</span>
                        </div>
                        {item.isEditor && hasUnsavedChanges && isActive && <Circle size={6} className="fill-amber-400 text-amber-400 animate-pulse" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          <div className={`mt-auto p-3 mx-3 mb-4 rounded-xl border ${isDarkMode ? 'bg-slate-800/30 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
            <div className="flex items-center gap-2">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Davi" className="w-8 h-8 rounded-lg" alt="Avatar" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold truncate">Davi Creator</p>
                <p className="text-[9px] font-bold text-blue-500 uppercase">Plano Pro</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

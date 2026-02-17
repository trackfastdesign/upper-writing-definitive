
import React, { useState, useEffect } from 'react';
import { 
  X,
  Menu,
  AlertTriangle,
  LayoutTemplate,
  Users,
  Settings as SettingsIcon,
  Image as ImageIcon,
  Wand2,
  Share2,
  BookOpen,
  Music,
  Rocket
} from 'lucide-react';
import { AppView, ContentItem, ContentVersion } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import EditorPane from './components/EditorPane';
import ArchivePane from './components/ArchivePane';
import AnalyticsPane from './components/AnalyticsPane';
import TeamChat from './components/TeamChat';
import ImageGeneratorPane from './components/ImageGeneratorPane';
import FilmMakerPane from './components/FilmMakerPane';
import ImageCleanerPane from './components/ImageCleanerPane';
import RepurposingPane from './components/RepurposingPane';
import SocialHubPane from './components/SocialHubPane';
import EditorialPubPane from './components/EditorialPubPane';
import AudioHubPane from './components/AudioHubPane';
import ProductLauncherPane from './components/ProductLauncherPane';
import VersionHistoryModal from './components/VersionHistoryModal';
import NavigationWarningModal from './components/NavigationWarningModal';
import TemplatesPane from './components/TemplatesPane';

const PlaceholderView: React.FC<{ title: string; icon: React.ReactNode; description: string; isDarkMode: boolean }> = ({ title, icon, description, isDarkMode }) => (
  <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8">
    <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-white text-slate-400 shadow-sm border border-slate-100'}`}>
      {icon}
    </div>
    <h2 className="text-2xl font-bold mb-2">{title}</h2>
    <p className={`max-w-md ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
      {description}
    </p>
  </div>
);

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<AppView>(AppView.CREATIVE_WRITING);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false); 
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [historyItem, setHistoryItem] = useState<ContentItem | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [pendingNavigation, setPendingNavigation] = useState<{view: AppView, item?: ContentItem} | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('mediastudio_content');
    if (saved) setContentItems(JSON.parse(saved));
    const handleResize = () => setIsSidebarOpen(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    localStorage.setItem('mediastudio_content', JSON.stringify(contentItems));
  }, [contentItems]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleSaveItem = (item: ContentItem) => {
    setContentItems(prev => {
      const existsIndex = prev.findIndex(i => i.id === item.id);
      if (existsIndex > -1) {
        const updated = [...prev];
        const oldItem = updated[existsIndex];
        if (oldItem.content !== item.content) {
          const newVersion: ContentVersion = { id: Date.now().toString(), content: oldItem.content, date: new Date().toLocaleString() };
          item.versions = [newVersion, ...(oldItem.versions || [])].slice(0, 10);
        } else {
          item.versions = oldItem.versions || [];
        }
        updated[existsIndex] = item;
        return updated;
      }
      return [item, ...prev];
    });
    setEditingItem(item);
    setHasUnsavedChanges(false);
  };

  const handleDeleteItem = (id: string) => {
    setContentItems(prev => prev.filter(i => i.id !== id));
    if (editingItem?.id === id) { setEditingItem(null); setHasUnsavedChanges(false); }
  };

  const handleRestoreVersion = (itemId: string, version: ContentVersion) => {
    setContentItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const currentAsVersion: ContentVersion = { id: Date.now().toString(), content: item.content, date: new Date().toLocaleString() };
        const updatedItem = { ...item, content: version.content, versions: [currentAsVersion, ...item.versions.filter(v => v.id !== version.id)].slice(0, 10) };
        if (editingItem?.id === itemId) { setEditingItem(updatedItem); setHasUnsavedChanges(false); }
        return updatedItem;
      }
      return item;
    }));
    setHistoryItem(null);
  };

  const navigateTo = (view: AppView, item?: ContentItem) => {
    if (hasUnsavedChanges && (activeView !== view || (item && item.id !== editingItem?.id))) {
      setPendingNavigation({ view, item });
    } else {
      setActiveView(view);
      if (item) setEditingItem(item);
      else if (activeView !== view) setEditingItem(null);
      setHasUnsavedChanges(false);
      if (window.innerWidth < 1024) setIsSidebarOpen(false);
    }
  };

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${isDarkMode ? 'dark bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <Sidebar activeView={activeView} setActiveView={(view) => navigateTo(view)} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} isDarkMode={isDarkMode} hasUnsavedChanges={hasUnsavedChanges} />
      <main className={`flex-1 flex flex-col min-h-screen transition-all duration-300 w-full ${isSidebarOpen && window.innerWidth >= 1024 ? 'lg:pl-64' : 'pl-0'}`}>
        <Header activeView={activeView} isDarkMode={isDarkMode} toggleTheme={toggleTheme} onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
        <div className="flex-1 overflow-auto p-4 lg:p-8 relative">
          <div className="max-w-7xl mx-auto h-full">
            {(activeView === AppView.CREATIVE_WRITING || activeView === AppView.VIDEO_SCRIPTS || activeView === AppView.SEO_EDITING || activeView === AppView.TECH_DOCS) && (
              <EditorPane key={activeView} type={activeView} initialItem={editingItem?.type === activeView ? editingItem : null} onSave={handleSaveItem} setHasUnsavedChanges={setHasUnsavedChanges} isDarkMode={isDarkMode} />
            )}
            {activeView === AppView.FILM_STUDIO && <FilmMakerPane isDarkMode={isDarkMode} />}
            {activeView === AppView.IMAGE_LAB && <ImageGeneratorPane isDarkMode={isDarkMode} onArchive={handleSaveItem} />}
            {activeView === AppView.IMAGE_CLEANER && <ImageCleanerPane isDarkMode={isDarkMode} />}
            {activeView === AppView.REPURPOSING && <RepurposingPane isDarkMode={isDarkMode} />}
            {activeView === AppView.SOCIAL_HUB && <SocialHubPane isDarkMode={isDarkMode} />}
            {activeView === AppView.EDITORIAL_PUB && <EditorialPubPane isDarkMode={isDarkMode} />}
            {activeView === AppView.AUDIO_HUB && <AudioHubPane isDarkMode={isDarkMode} />}
            {activeView === AppView.PRODUCT_LAUNCHER && <ProductLauncherPane isDarkMode={isDarkMode} />}
            {activeView === AppView.ARCHIVE && <ArchivePane items={contentItems} onDelete={handleDeleteItem} onSelect={(item) => navigateTo(item.type, item)} onShowHistory={(item) => setHistoryItem(item)} />}
            {activeView === AppView.ANALYTICS && <AnalyticsPane isDarkMode={isDarkMode} />}
            {activeView === AppView.TEAM && <TeamChat isDarkMode={isDarkMode} />}
            {activeView === AppView.TEMPLATES && <TemplatesPane isDarkMode={isDarkMode} onApply={(view, item) => navigateTo(view, item)} />}
            {activeView === AppView.SETTINGS && <PlaceholderView title="Configurações" icon={<SettingsIcon size={40} />} description="Ajuste chaves de API e perfis de voz." isDarkMode={isDarkMode} />}
          </div>
        </div>
      </main>
      <button onClick={() => navigateTo(AppView.SOCIAL_HUB)} className="fixed bottom-8 right-8 z-[100] w-16 h-16 bg-blue-600 text-white rounded-full shadow-[0_20px_50px_rgba(37,99,235,0.4)] flex items-center justify-center hover:scale-110 transition-all group">
        <Share2 size={28} />
        <span className="absolute right-20 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">Publicar em Massa</span>
      </button>
      {historyItem && <VersionHistoryModal item={historyItem} onClose={() => setHistoryItem(null)} onRestore={handleRestoreVersion} isDarkMode={isDarkMode} />}
      {pendingNavigation && <NavigationWarningModal onConfirm={() => { navigateTo(pendingNavigation.view, pendingNavigation.item); setPendingNavigation(null); }} onCancel={() => setPendingNavigation(null)} isDarkMode={isDarkMode} />}
    </div>
  );
};

export default App;

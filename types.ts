
export enum AppView {
  CREATIVE_WRITING = 'Escrita Criativa',
  VIDEO_SCRIPTS = 'Scripts de Vídeo',
  FILM_STUDIO = 'Estúdio de Cinema (Takes)',
  SEO_EDITING = 'SEO & Redação',
  TECH_DOCS = 'Documentação Técnica',
  IMAGE_LAB = 'Laboratório de Imagens',
  IMAGE_CLEANER = 'IA OCR & Limpeza',
  REPURPOSING = 'Multi-Format Magic',
  SOCIAL_HUB = 'Social Distribution',
  EDITORIAL_PUB = 'Publicação Editorial',
  AUDIO_HUB = 'Audio Hub',
  PRODUCT_LAUNCHER = 'Product Launcher',
  TEMPLATES = 'Templates',
  TEAM = 'Colaboração de Equipa',
  ANALYTICS = 'Analytics',
  ARCHIVE = 'Arquivos',
  SETTINGS = 'Configurações do Sistema'
}

export enum ContentStatus {
  DRAFT = 'Rascunho',
  PUBLISHED = 'Publicado'
}

export interface ContentVersion {
  id: string;
  content: string;
  date: string;
}

export interface ContentAnalysis {
  titles: string[];
  metaDescription: string;
  toneOfVoice: string;
  factCheck: string;
  suggestions: string;
}

export interface ContentItem {
  id: string;
  title: string;
  content: string;
  type: AppView;
  status: ContentStatus;
  date: string;
  tags: string[];
  versions: ContentVersion[];
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  refinedPrompt: string;
  date: string;
  extractedText?: string;
  cleanedImageUrl?: string;
}

export interface RepurposedContent {
  twitterThread: string[];
  instagramCaption: string;
  youtubeShortsScript: string;
  linkedInSummary: string;
}

export interface UserSession {
  name: string;
  role: string;
  avatar: string;
}

export interface VideoTake {
  id: string;
  duration: 5 | 10 | 15 | 25;
  prompt: string;
  status: 'idle' | 'generating' | 'done' | 'error';
  videoUrl?: string;
}

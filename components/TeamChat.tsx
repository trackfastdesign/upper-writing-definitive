
import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Trash2, 
  Hash, 
  Users, 
  Sparkles, 
  ChevronDown, 
  Check, 
  Smile, 
  Paperclip,
  UserPlus,
  Loader2
} from 'lucide-react';

interface Message {
  id: string;
  sender: string;
  role: string;
  text: string;
  timestamp: string;
  avatar: string;
  isAi?: boolean;
}

interface TeamChatProps {
  isDarkMode: boolean;
}

const TEAM_MEMBERS = [
  { name: "Davi Creator", role: "Editor-Chefe", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Davi" },
  { name: "Ana Design", role: "UI Designer", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana" },
  { name: "Lucas SEO", role: "Especialista SEO", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas" }
];

const TeamChat: React.FC<TeamChatProps> = ({ isDarkMode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [currentUserIdx, setCurrentUserIdx] = useState(0);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const currentUser = TEAM_MEMBERS[currentUserIdx];

  // Carregar do localStorage no mount
  useEffect(() => {
    const savedChat = localStorage.getItem('mediastudio_team_chat_v3');
    if (savedChat) {
      setMessages(JSON.parse(savedChat));
    } else {
      const welcome: Message = {
        id: '1',
        sender: 'MediaStudio Assistant',
        role: 'AI System',
        text: 'Bem-vindos ao hub de colaboração! Aqui vocês podem trocar ideias sobre os projetos em tempo real. O histórico é salvo automaticamente no seu navegador.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Gemini',
        isAi: true
      };
      setMessages([welcome]);
    }
  }, []);

  // Salvar no localStorage sempre que as mensagens mudarem
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('mediastudio_team_chat_v3', JSON.stringify(messages));
    }
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      const isAwayFromBottom = scrollHeight - scrollTop - clientHeight > 200;
      setShowScrollBottom(isAwayFromBottom);
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: currentUser.name,
      role: currentUser.role,
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: currentUser.avatar
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');

    // Pequena simulação de interação da IA após o envio
    if (input.toLowerCase().includes('ajuda') || input.toLowerCase().includes('gemini')) {
      setIsTyping(true);
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'MediaStudio Assistant',
          role: 'AI System',
          text: 'Entendido! Estou analisando o contexto da conversa para oferecer sugestões criativas. Como posso otimizar este fluxo?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Gemini',
          isAi: true
        };
        setMessages(prev => [...prev, aiResponse]);
        setIsTyping(false);
      }, 1500);
    }
  };

  const clearChat = () => {
    if (confirm('Deseja apagar permanentemente o histórico desta conversa?')) {
      localStorage.removeItem('mediastudio_team_chat_v3');
      setMessages([{
        id: Date.now().toString(),
        sender: 'MediaStudio Assistant',
        role: 'AI System',
        text: 'Histórico limpo. Prontos para um novo começo!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Gemini',
        isAi: true
      }]);
    }
  };

  return (
    <div className={`flex flex-col h-[calc(100vh-160px)] rounded-[2.5rem] border overflow-hidden shadow-2xl relative animate-in fade-in duration-700 ${isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'}`}>
      
      {/* Header */}
      <div className={`p-6 border-b flex items-center justify-between z-20 backdrop-blur-xl ${isDarkMode ? 'bg-slate-800/60 border-slate-700' : 'bg-white/80 border-slate-200'}`}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Users size={22} />
          </div>
          <div>
            <h3 className="font-bold text-lg flex items-center gap-2">
              Team Collaboration <Hash size={14} className="text-blue-500" />
            </h3>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <p className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em]">Criptografia Local Ativa</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden lg:flex -space-x-3 mr-4">
            {TEAM_MEMBERS.map((m, i) => (
              <img key={i} src={m.avatar} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 shadow-sm" alt={m.name} title={m.name} />
            ))}
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-bold text-slate-500">
              <UserPlus size={14} />
            </div>
          </div>
          <button onClick={clearChat} className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all">
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={chatContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-8 custom-scrollbar relative"
      >
        {messages.map((msg, index) => {
          const isMe = msg.sender === currentUser.name;
          const showSenderInfo = index === 0 || messages[index - 1].sender !== msg.sender;

          return (
            <div key={msg.id} className={`flex gap-4 ${isMe ? 'flex-row-reverse' : 'flex-row'} animate-in slide-in-from-bottom-2 duration-300`}>
              <div className="shrink-0 mt-1">
                <img src={msg.avatar} alt={msg.sender} className={`w-10 h-10 rounded-2xl shadow-sm border-2 ${isMe ? 'border-blue-500/40' : 'border-slate-200 dark:border-slate-700'}`} />
              </div>
              <div className={`flex flex-col max-w-[85%] lg:max-w-[60%] ${isMe ? 'items-end' : 'items-start'}`}>
                {showSenderInfo && (
                  <div className="flex items-center gap-2 mb-2 px-1">
                    <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{msg.sender}</span>
                    <span className="text-[10px] font-bold text-blue-500 uppercase tracking-tighter opacity-60">{msg.role}</span>
                  </div>
                )}
                <div className={`p-4 rounded-3xl shadow-sm relative leading-relaxed text-sm ${
                  msg.isAi 
                    ? 'bg-blue-600/5 dark:bg-blue-400/5 border border-blue-500/10 text-slate-700 dark:text-slate-200 rounded-tl-none' 
                    : isMe 
                      ? 'bg-blue-600 text-white rounded-tr-none shadow-blue-600/10' 
                      : isDarkMode 
                        ? 'bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-none' 
                        : 'bg-slate-100 border border-slate-100 text-slate-800 rounded-tl-none'
                }`}>
                  {msg.isAi && <Sparkles size={12} className="absolute -top-1.5 -left-1.5 text-blue-500 animate-pulse" />}
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <div className={`mt-2 flex items-center gap-1.5 text-[9px] font-bold ${isMe ? 'text-blue-100/60 justify-end' : 'text-slate-400'}`}>
                    <span>{msg.timestamp}</span>
                    {isMe && <Check size={10} />}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        {isTyping && (
          <div className="flex gap-4 animate-in fade-in duration-300">
             <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <Loader2 size={16} className="animate-spin text-blue-500" />
             </div>
             <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-3xl rounded-tl-none flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Floating Scroll Button */}
      {showScrollBottom && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-32 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white dark:bg-blue-600 rounded-full shadow-2xl hover:scale-110 transition-all text-[10px] font-black uppercase tracking-widest"
        >
          Novas Mensagens <ChevronDown size={14} />
        </button>
      )}

      {/* Input Area */}
      <div className={`p-6 lg:p-8 border-t z-20 ${isDarkMode ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
        <div className="max-w-5xl mx-auto flex flex-col gap-4">
          <div className="flex items-center gap-4 px-2">
            <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
              Falando como:
            </div>
            <div className="flex gap-2">
              {TEAM_MEMBERS.map((member, idx) => (
                <button
                  key={member.name}
                  onClick={() => setCurrentUserIdx(idx)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${
                    currentUserIdx === idx 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20 scale-105' 
                    : 'bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-700 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={member.avatar} className="w-4 h-4 rounded-full" alt="" />
                  <span className="text-[10px] font-bold">{member.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="relative group">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={`Escreva para a equipe... (Shift+Enter para nova linha)`}
              rows={1}
              className={`w-full pl-6 pr-32 py-5 rounded-[2rem] border outline-none focus:ring-8 focus:ring-blue-500/5 resize-none transition-all text-sm leading-relaxed shadow-sm ${
                isDarkMode ? 'bg-slate-900 border-slate-700 text-white placeholder:text-slate-600' : 'bg-white border-slate-200 placeholder:text-slate-400'
              }`}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <button className="p-3 text-slate-400 hover:text-blue-500 transition-colors">
                <Paperclip size={20} />
              </button>
              <button className="p-3 text-slate-400 hover:text-blue-500 transition-colors">
                <Smile size={20} />
              </button>
              <button 
                onClick={handleSend}
                disabled={!input.trim()}
                className="ml-2 p-3.5 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/30 disabled:opacity-20 active:scale-95"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamChat;

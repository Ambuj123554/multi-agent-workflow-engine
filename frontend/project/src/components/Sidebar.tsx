import { useEffect, useState } from 'react';
import { MessageSquare, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface Session {
  id: number;
  title: string;
  created_at: string;
}

interface SidebarProps {
  onNewChat: () => void;
  onSelectSession: (sessionId: number) => void;
  activeSessionId: number | null;
  refreshTrigger: number;
  darkMode: boolean;
}

export default function Sidebar({ onNewChat, onSelectSession, activeSessionId, refreshTrigger, darkMode }: SidebarProps) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const API_URL = import.meta.env.VITE_API_URL || "";

  useEffect(() => {
    fetch(`${API_URL}/api/chat/sessions`)
      .then((res) => res.json())
      .then((data) => setSessions(data.sessions || []))
      .catch(() => setSessions([]));
  }, [refreshTrigger]);

  const formatTime = (isoString: string) => {
    const normalized = isoString.endsWith('Z') ? isoString : isoString + 'Z';
    const date = new Date(normalized);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const s = darkMode
    ? {
        bg: 'bg-zinc-950 border-zinc-800',
        title: 'text-white',
        sub: 'text-zinc-500',
        section: 'text-zinc-500',
        empty: 'text-zinc-600',
        item: 'hover:bg-zinc-800',
        itemActive: 'bg-zinc-800 border border-cyan-500/40',
        itemText: 'text-zinc-300 group-hover:text-white',
        itemTime: 'text-zinc-600',
        icon: 'text-zinc-600 group-hover:text-cyan-400',
        footer: 'border-zinc-800 bg-zinc-900/40',
        userText: 'text-white',
        userSub: 'text-zinc-500',
      }
    : {
        bg: 'bg-zinc-100 border-zinc-200',
        title: 'text-zinc-900',
        sub: 'text-zinc-500',
        section: 'text-zinc-400',
        empty: 'text-zinc-400',
        item: 'hover:bg-zinc-200',
        itemActive: 'bg-zinc-200 border border-cyan-500/40',
        itemText: 'text-zinc-700 group-hover:text-zinc-900',
        itemTime: 'text-zinc-400',
        icon: 'text-zinc-400 group-hover:text-cyan-600',
        footer: 'border-zinc-200 bg-zinc-200/40',
        userText: 'text-zinc-900',
        userSub: 'text-zinc-500',
      };

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className={`w-72 border-r flex flex-col h-screen ${s.bg}`}
    >
      <div className={`p-6 border-b ${darkMode ? 'border-zinc-800' : 'border-zinc-200'}`}>
        <div className="flex items-center gap-3 mb-6">
          <div>
            <h1 className={`text-lg font-bold ${s.title}`}>AI Workflow</h1>
            <p className={`text-xs ${s.sub}`}>Multi-Agent Engine</p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNewChat}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${darkMode ? 'bg-zinc-800 hover:bg-zinc-700 text-white' : 'bg-zinc-900 hover:bg-zinc-700 text-white'}`}
        >
          <Plus className="w-5 h-5" />
          New Chat
        </motion.button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <h2 className={`text-xs font-semibold uppercase tracking-wider mb-3 px-2 ${s.section}`}>
          Chat History
        </h2>
        <div className="space-y-1">
          {sessions.length === 0 && (
            <p className={`text-xs px-2 ${s.empty}`}>No chats yet. Start a conversation!</p>
          )}
          {sessions.map((session) => (
            <motion.div
              key={session.id}
              whileHover={{ x: 3 }}
              onClick={() => onSelectSession(session.id)}
              className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer group transition-colors ${
                activeSessionId === session.id ? s.itemActive : s.item
              }`}
            >
              <MessageSquare className={`w-4 h-4 transition-colors flex-shrink-0 mt-0.5 ${s.icon}`} />
              <div className="flex-1 min-w-0">
                <p className={`text-sm truncate transition-colors ${s.itemText}`}>{session.title}</p>
                <p className={`text-xs mt-0.5 ${s.itemTime}`}>{formatTime(session.created_at)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className={`p-4 border-t ${s.footer}`}>
        <div className={`flex items-center gap-3 p-3 rounded-xl ${darkMode ? 'bg-zinc-800/50' : 'bg-zinc-200/50'}`}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
            U
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium ${s.userText}`}>User</p>
            <p className={`text-xs ${s.userSub}`}>user@example.com</p>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}


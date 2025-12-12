import { MessageSquare, Plus, Bot } from 'lucide-react';
import { motion } from 'framer-motion';

interface SidebarProps {
  onNewChat: () => void;
}

export default function Sidebar({ onNewChat }: SidebarProps) {
  const chatHistory = [
    { id: 1, title: 'Product Launch Strategy', time: '2h ago' },
    { id: 2, title: 'Market Analysis Report', time: '5h ago' },
    { id: 3, title: 'Customer Research Insights', time: '1d ago' },
    { id: 4, title: 'Competitor Analysis', time: '2d ago' },
  ];

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className="w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700/50 flex flex-col h-screen"
    >
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">AI Workflow</h1>
            <p className="text-xs text-slate-400">Multi-Agent Engine</p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-cyan-500/25"
        >
          <Plus className="w-5 h-5" />
          New Chat
        </motion.button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-2">
          Chat History
        </h2>
        <div className="space-y-2">
          {chatHistory.map((chat) => (
            <motion.div
              key={chat.id}
              whileHover={{ x: 4 }}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-800/50 cursor-pointer group transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-300 group-hover:text-white truncate transition-colors">
                  {chat.title}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{chat.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-slate-700/50">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
            U
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white">User</p>
            <p className="text-xs text-slate-400">user@example.com</p>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}

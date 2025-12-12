import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mic } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSendMessage, disabled = false }: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-slate-700/50 bg-slate-900/80 backdrop-blur-xl p-4">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="relative flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={disabled}
              placeholder="Ask me anything..."
              rows={1}
              className="w-full px-5 py-4 pr-12 bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                minHeight: '56px',
                maxHeight: '200px',
              }}
            />
            <button
              type="button"
              className="absolute right-4 bottom-4 text-slate-400 hover:text-cyan-400 transition-colors"
            >
              <Mic className="w-5 h-5" />
            </button>
          </div>

          <motion.button
            whileHover={{ scale: disabled ? 1 : 1.05 }}
            whileTap={{ scale: disabled ? 1 : 0.95 }}
            type="submit"
            disabled={disabled || !input.trim()}
            className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-2xl flex items-center justify-center text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/25"
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>

        <p className="text-xs text-slate-500 text-center mt-3">
          Powered by AI Multi-Agent Workflow Engine
        </p>
      </form>
    </div>
  );
}

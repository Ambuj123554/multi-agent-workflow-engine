import { motion } from 'framer-motion';
import { Bot, User, Loader2 } from 'lucide-react';
import AgentStepper from './AgentStepper';

interface ChatMessageProps {
  message: any;          // <-- allow object or string
  isUser: boolean;
  isTyping?: boolean;
  showAgentProcess?: boolean;
  agentStep?: number;
}

export default function ChatMessage({
  message,
  isUser,
  isTyping = false,
  showAgentProcess = false,
  agentStep = 0,
}: ChatMessageProps) {

  // Convert object message → formatted string
  const renderMessage = () => {
    if (typeof message === "object") {
      return (
        <pre className="text-sm leading-relaxed whitespace-pre-wrap">
          {JSON.stringify(message, null, 2)}
        </pre>
      );
    }
    return <p className="text-sm leading-relaxed whitespace-pre-wrap">{message}</p>;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`flex gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isUser && (
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
            <Bot className="w-5 h-5 text-white" />
          </div>
        </div>
      )}

      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-2xl`}>
        <div
          className={`rounded-2xl px-5 py-3 ${
            isUser
              ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
              : 'bg-slate-800/80 backdrop-blur-xl text-slate-100 border border-slate-700/50'
          }`}
        >
          {isTyping ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">AI is thinking...</span>
            </div>
          ) : (
            <div>
              {showAgentProcess && agentStep < 4 && (
                <div className="mb-4 pb-4 border-b border-slate-700/50">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                    Processing by Agents
                  </p>
                  <AgentStepper currentStep={agentStep} />
                </div>
              )}

              {/* FIXED MESSAGE RENDERING */}
              {renderMessage()}
            </div>
          )}
        </div>

        <p className="text-xs text-slate-500 mt-1 px-1">
          {isUser ? 'You' : 'AI Assistant'} ·{' '}
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>

      {isUser && (
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center shadow-lg">
            <User className="w-5 h-5 text-white" />
          </div>
        </div>
      )}
    </motion.div>
  );
}

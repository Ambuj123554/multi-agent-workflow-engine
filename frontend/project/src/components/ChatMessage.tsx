import { motion } from 'framer-motion';
import { Sparkles, User, Loader2 } from 'lucide-react';
import AgentStepper from './AgentStepper';
import AgentTrace from './AgentTrace';

interface Trace {
  stage: string;
  prompt_summary: string;
  response_summary: string;
  duration_ms: number;
  status: string;
}

interface ChatMessageProps {
  message: any;
  isUser: boolean;
  isTyping?: boolean;
  showAgentProcess?: boolean;
  agentStep?: number;
  darkMode: boolean;
  confidenceScore?: number;
  confidenceBreakdown?: Record<string, number>;
  traces?: Trace[];
  retries?: number;
  cacheHit?: boolean;
}

function ConfidenceBadge({ score, breakdown, darkMode }: { score: number; breakdown: Record<string, number>; darkMode: boolean }) {
  const color =
    score >= 8 ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    : score >= 6 ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
    : 'text-red-400 bg-red-500/10 border-red-500/20';

  return (
    <div className="flex items-center gap-2 mt-2 flex-wrap">
      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${color}`}>
        Confidence {score}/10
      </span>
      {Object.entries(breakdown).map(([k, v]) => (
        <span key={k} className={`text-xs px-2 py-0.5 rounded-full border ${darkMode ? 'text-zinc-400 border-zinc-700' : 'text-zinc-500 border-zinc-200'}`}>
          {k} {v}/10
        </span>
      ))}
    </div>
  );
}

export default function ChatMessage({
  message, isUser, isTyping = false, showAgentProcess = false,
  agentStep = 0, darkMode,
  confidenceScore, confidenceBreakdown = {}, traces = [], retries = 0, cacheHit = false,
}: ChatMessageProps) {

  const renderMessage = () => {
    if (typeof message === 'object') {
      return <pre className="text-sm leading-relaxed whitespace-pre-wrap">{JSON.stringify(message, null, 2)}</pre>;
    }
    return <p className="text-sm leading-relaxed whitespace-pre-wrap">{message}</p>;
  };

  const aiBubble = darkMode
    ? 'bg-zinc-900 border border-zinc-800 text-zinc-100'
    : 'bg-zinc-100 border border-zinc-200 text-zinc-800';
  const timeColor = darkMode ? 'text-zinc-600' : 'text-zinc-400';
  const divider = darkMode ? 'border-zinc-700' : 'border-zinc-200';
  const agentLabel = darkMode ? 'text-zinc-500' : 'text-zinc-400';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isUser && (
        <div className="flex-shrink-0">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md ${darkMode ? 'bg-zinc-800' : 'bg-zinc-900'}`}>
            <Sparkles className="w-5 h-5 text-white" />
          </div>
        </div>
      )}

      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-2xl w-full`}>
        <div className={`rounded-2xl px-5 py-3 w-full ${isUser ? (darkMode ? 'bg-zinc-800 text-white' : 'bg-zinc-900 text-white') : aiBubble}`}>
          {isTyping ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">AI is thinking...</span>
            </div>
          ) : (
            <div>
              {showAgentProcess && agentStep < 5 && (
                <div className={`mb-4 pb-4 border-b ${divider}`}>
                  <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${agentLabel}`}>Processing by Agents</p>
                  <AgentStepper currentStep={agentStep} />
                </div>
              )}
              {renderMessage()}
            </div>
          )}
        </div>

        {/* Confidence badge */}
        {!isUser && !isTyping && confidenceScore !== undefined && confidenceScore > 0 && (
          <ConfidenceBadge score={confidenceScore} breakdown={confidenceBreakdown} darkMode={darkMode} />
        )}

        {/* Agent trace panel */}
        {!isUser && !isTyping && traces.length > 0 && (
          <div className="w-full mt-1">
            <AgentTrace traces={traces} retries={retries} cacheHit={cacheHit} darkMode={darkMode} />
          </div>
        )}

        <p className={`text-xs mt-1 px-1 ${timeColor}`}>
          {isUser ? 'You' : 'AI Assistant'} · {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>

      {isUser && (
        <div className="flex-shrink-0">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${darkMode ? 'bg-zinc-700' : 'bg-zinc-200'}`}>
            <User className={`w-5 h-5 ${darkMode ? 'text-zinc-300' : 'text-zinc-600'}`} />
          </div>
        </div>
      )}
    </motion.div>
  );
}

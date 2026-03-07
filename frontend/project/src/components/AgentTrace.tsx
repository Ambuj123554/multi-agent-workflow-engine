import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Clock, RefreshCw, Zap } from 'lucide-react';

interface Trace {
  stage: string;
  prompt_summary: string;
  response_summary: string;
  duration_ms: number;
  status: string;
}

interface AgentTraceProps {
  traces: Trace[];
  retries: number;
  cacheHit: boolean;
  darkMode: boolean;
}

export default function AgentTrace({ traces, retries, cacheHit, darkMode }: AgentTraceProps) {
  const [open, setOpen] = useState(false);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const bg = darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50 border-zinc-200';
  const headerText = darkMode ? 'text-zinc-400' : 'text-zinc-500';
  const cardBg = darkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-zinc-200';
  const labelText = darkMode ? 'text-zinc-500' : 'text-zinc-400';
  const valueText = darkMode ? 'text-zinc-300' : 'text-zinc-700';
  const preText = darkMode ? 'bg-zinc-900 text-zinc-300 border-zinc-700' : 'bg-zinc-100 text-zinc-700 border-zinc-200';

  const statusColor = (s: string) =>
    s === 'cached' ? 'text-blue-400' : s === 'retried' ? 'text-yellow-400' : 'text-emerald-400';

  const totalMs = traces.reduce((a, t) => a + t.duration_ms, 0);

  return (
    <div className={`mt-3 rounded-xl border ${bg}`}>
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-4 py-2.5 text-xs font-medium ${headerText} hover:opacity-80 transition`}
      >
        <div className="flex items-center gap-3">
          <span>🔍 Show Reasoning</span>
          {cacheHit && (
            <span className="flex items-center gap-1 text-blue-400"><Zap className="w-3 h-3" /> Cache hit</span>
          )}
          {retries > 0 && (
            <span className="flex items-center gap-1 text-yellow-400"><RefreshCw className="w-3 h-3" /> {retries} retr{retries > 1 ? 'ies' : 'y'}</span>
          )}
          <span className="flex items-center gap-1 opacity-60"><Clock className="w-3 h-3" /> {totalMs}ms total</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-2">
              {traces.map((trace, i) => (
                <div key={i} className={`rounded-lg border ${cardBg}`}>
                  <button
                    onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
                    className="w-full flex items-center justify-between px-3 py-2 text-left"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold ${statusColor(trace.status)}`}>
                        {trace.stage}
                      </span>
                      <span className={`text-xs ${labelText}`}>{trace.duration_ms}ms</span>
                      {trace.status !== 'completed' && (
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                          trace.status === 'cached' ? 'bg-blue-500/10 text-blue-400' : 'bg-yellow-500/10 text-yellow-400'
                        }`}>{trace.status}</span>
                      )}
                    </div>
                    {expandedIdx === i ? <ChevronUp className={`w-3 h-3 ${labelText}`} /> : <ChevronDown className={`w-3 h-3 ${labelText}`} />}
                  </button>

                  <AnimatePresence>
                    {expandedIdx === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-3 pb-3 space-y-2">
                          <div>
                            <p className={`text-xs font-medium mb-1 ${labelText}`}>PROMPT</p>
                            <pre className={`text-xs rounded-lg p-2 border whitespace-pre-wrap break-words ${preText}`}>
                              {trace.prompt_summary}{trace.prompt_summary.length >= 300 ? '…' : ''}
                            </pre>
                          </div>
                          <div>
                            <p className={`text-xs font-medium mb-1 ${labelText}`}>RESPONSE</p>
                            <pre className={`text-xs rounded-lg p-2 border whitespace-pre-wrap break-words ${preText}`}>
                              {trace.response_summary}{trace.response_summary.length >= 500 ? '…' : ''}
                            </pre>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { motion } from 'framer-motion';
import { Bot, Loader2 } from 'lucide-react';

interface ProviderResult {
  provider: string;
  response: string;
  error: string;
}

interface CompareViewProps {
  query: string;
  results: ProviderResult[];
  isLoading: boolean;
  darkMode: boolean;
}

const providerMeta: Record<string, { label: string; color: string; dot: string }> = {
  groq: { label: 'Groq (LLaMA 3.3)', color: 'from-orange-500 to-red-500', dot: 'bg-orange-400' },
  gemini: { label: 'Google Gemini', color: 'from-blue-500 to-cyan-500', dot: 'bg-blue-400' },
  ollama: { label: 'Ollama (Local)', color: 'from-violet-500 to-purple-500', dot: 'bg-violet-400' },
};

export default function CompareView({ query, results, isLoading, darkMode }: CompareViewProps) {
  const card = darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50 border-zinc-200';
  const text = darkMode ? 'text-zinc-100' : 'text-zinc-800';
  const sub = darkMode ? 'text-zinc-500' : 'text-zinc-400';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto mt-4"
    >
      <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${sub}`}>
        ⚖️ LLM Comparison — "{query.slice(0, 60)}{query.length > 60 ? '…' : ''}"
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isLoading
          ? ['groq', 'gemini'].map((p) => (
              <div key={p} className={`rounded-2xl border p-4 ${card}`}>
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-2 h-2 rounded-full ${providerMeta[p]?.dot} animate-pulse`} />
                  <span className={`text-sm font-semibold ${text}`}>{providerMeta[p]?.label}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-500">
                  <Loader2 className="w-4 h-4 animate-spin" /> Generating...
                </div>
              </div>
            ))
          : results.map((r) => {
              const meta = providerMeta[r.provider] || { label: r.provider, color: 'from-zinc-500 to-zinc-600', dot: 'bg-zinc-400' };
              return (
                <div key={r.provider} className={`rounded-2xl border p-4 ${card}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`p-1.5 rounded-lg bg-gradient-to-br ${meta.color}`}>
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                    <span className={`text-sm font-semibold ${text}`}>{meta.label}</span>
                  </div>
                  {r.error ? (
                    <p className="text-xs text-red-400">⚠️ {r.error}</p>
                  ) : (
                    <p className={`text-sm leading-relaxed whitespace-pre-wrap ${text}`}>{r.response}</p>
                  )}
                </div>
              );
            })}
      </div>
    </motion.div>
  );
}

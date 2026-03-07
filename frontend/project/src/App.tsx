import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Sun, Moon, GitCompare } from 'lucide-react';
import Sidebar from './components/Sidebar';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import CompareView from './components/CompareView';

interface Trace {
  stage: string;
  prompt_summary: string;
  response_summary: string;
  duration_ms: number;
  status: string;
}

interface ProviderResult {
  provider: string;
  response: string;
  error: string;
}

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  isTyping?: boolean;
  showAgentProcess?: boolean;
  agentStep?: number;
  confidenceScore?: number;
  confidenceBreakdown?: Record<string, number>;
  traces?: Trace[];
  retries?: number;
  cacheHit?: boolean;
}

const SUGGESTIONS = [
  { label: '🔬 Research', text: 'Explain how transformer models work in deep learning' },
  { label: '📊 Analysis', text: 'Compare quantum computing vs classical computing' },
  { label: '💡 Concepts', text: 'What is the difference between AI, ML, and deep learning?' },
  { label: '🚀 Strategy', text: 'How would you build a scalable microservices architecture?' },
];

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentAgentStep, setCurrentAgentStep] = useState(0);
  const [activeSessionId, setActiveSessionId] = useState<number | null>(null);
  const [sidebarRefresh, setSidebarRefresh] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [compareResults, setCompareResults] = useState<ProviderResult[]>([]);
  const [compareQuery, setCompareQuery] = useState('');
  const [compareLoading, setCompareLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const API_URL = import.meta.env.VITE_API_URL || '';

  useEffect(() => { document.documentElement.classList.toggle('dark', darkMode); }, [darkMode]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, compareResults]);

  const simulateAgentProgress = () =>
    new Promise<void>((resolve) => {
      let step = 0;
      const iv = setInterval(() => {
        step++;
        setCurrentAgentStep(step);
        if (step >= 5) { clearInterval(iv); resolve(); }
      }, 800);
    });

  const handleSelectSession = async (sessionId: number) => {
    setActiveSessionId(sessionId);
    try {
      const res = await fetch(`${API_URL}/api/chat/sessions/${sessionId}/messages`);
      const data = await res.json();
      const loaded: Message[] = (data.messages || []).map((m: any) => ({
        id: m.id, text: m.content, isUser: m.role === 'user',
      }));
      setMessages(loaded.length > 0 ? loaded : [WELCOME_MESSAGE]);
    } catch { setMessages([WELCOME_MESSAGE]); }
  };

  const handleSendMessage = async (messageText: string) => {
    if (!API_URL) { alert('❌ Missing VITE_API_URL'); return; }

    // Comparison mode — call /api/compare
    if (compareMode) {
      setCompareQuery(messageText);
      setCompareResults([]);
      setCompareLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/compare`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: messageText, providers: ['groq', 'gemini'] }),
        });
        const data = await res.json();
        setCompareResults(data.results || []);
      } catch (e) {
        setCompareResults([{ provider: 'error', response: '', error: String(e) }]);
      } finally { setCompareLoading(false); }
      return;
    }

    const userMsg: Message = { id: Date.now(), text: messageText, isUser: true };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    const typingMsg: Message = { id: Date.now() + 1, text: '', isUser: false, isTyping: true };
    setMessages((prev) => [...prev, typingMsg]);

    try {
      setCurrentAgentStep(0);
      const progressPromise = simulateAgentProgress();
      const response = await fetch(`${API_URL}/api/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: messageText, session_id: activeSessionId }),
      });
      await progressPromise;
      if (!response.ok) throw new Error(`Backend error: ${response.status}`);
      const data = await response.json();

      if (data.session_id) { setActiveSessionId(data.session_id); setSidebarRefresh((n) => n + 1); }

      setMessages((prev) => prev.map((msg) =>
        msg.id === typingMsg.id
          ? {
              ...msg,
              text: data.response,
              isTyping: false,
              showAgentProcess: true,
              agentStep: 5,
              confidenceScore: data.confidence_score,
              confidenceBreakdown: data.confidence_breakdown,
              traces: data.traces || [],
              retries: data.retries || 0,
              cacheHit: data.cache_hit || false,
            }
          : msg
      ));
    } catch (error) {
      setMessages((prev) => prev.map((msg) =>
        msg.id === typingMsg.id
          ? { ...msg, text: `⚠️ Error: ${error instanceof Error ? error.message : 'Unknown error'}`, isTyping: false }
          : msg
      ));
    } finally { setIsLoading(false); setCurrentAgentStep(0); }
  };

  const handleNewChat = () => {
    setActiveSessionId(null);
    setMessages([]);
    setCompareResults([]);
    setCompareQuery('');
  };

  const t = darkMode
    ? { bg: 'bg-black', header: 'bg-black/90 border-zinc-800', headerText: 'text-white', subText: 'text-zinc-400',
        toggleBg: 'bg-zinc-800 hover:bg-zinc-700', toggleIcon: 'text-yellow-400',
        onlineRing: 'bg-emerald-500/10 border-emerald-500/20', onlineDot: 'bg-emerald-400', onlineText: 'text-emerald-400',
        compareBg: compareMode ? 'bg-zinc-700 border-zinc-600 text-white' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400' }
    : { bg: 'bg-white', header: 'bg-white/90 border-zinc-200', headerText: 'text-zinc-900', subText: 'text-zinc-500',
        toggleBg: 'bg-zinc-100 hover:bg-zinc-200', toggleIcon: 'text-zinc-700',
        onlineRing: 'bg-emerald-50 border-emerald-200', onlineDot: 'bg-emerald-500', onlineText: 'text-emerald-600',
        compareBg: compareMode ? 'bg-zinc-800 border-zinc-700 text-zinc-900' : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-500' };

  return (
    <div className={`flex h-screen overflow-hidden ${t.bg}`}>
      <Sidebar onNewChat={handleNewChat} onSelectSession={handleSelectSession} activeSessionId={activeSessionId} refreshTrigger={sidebarRefresh} darkMode={darkMode} />

      <div className="flex-1 flex flex-col">
        <motion.header initial={{ y: -60 }} animate={{ y: 0 }} className={`border-b backdrop-blur-xl px-8 py-4 ${t.header}`}>
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div className="flex items-center gap-3">
            </div>

            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-2 px-3 py-1.5 border rounded-full ${t.onlineRing}`}>
                <div className={`w-2 h-2 rounded-full animate-pulse ${t.onlineDot}`} />
                <span className={`text-xs font-medium ${t.onlineText}`}>Online</span>
              </div>

              {/* Compare mode toggle */}
              <button
                onClick={() => setCompareMode(!compareMode)}
                title="LLM Comparison Mode"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium transition-colors ${t.compareBg}`}
              >
                <GitCompare className="w-4 h-4" />
                Compare
              </button>

              {/* Theme toggle */}
              <button onClick={() => setDarkMode(!darkMode)} className={`p-2 rounded-xl transition-colors ${t.toggleBg}`}>
                {darkMode ? <Sun className={`w-5 h-5 ${t.toggleIcon}`} /> : <Moon className={`w-5 h-5 ${t.toggleIcon}`} />}
              </button>
            </div>
          </div>
        </motion.header>

        {/* Chat area or empty state */}
        {messages.length === 0 && !compareResults.length && !compareLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center px-8 pb-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-2xl flex flex-col items-center gap-8"
            >
              {/* Greeting */}
              <div className="text-center">
                <h2 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
                  What can I help you with?
                </h2>
                <p className={`text-sm ${darkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  Powered by a 5-stage multi-agent pipeline — Understanding · Research · Analysis · Validation · Writer
                </p>
              </div>

              {/* Suggestion cards */}
              <div className="grid grid-cols-2 gap-3 w-full">
                {SUGGESTIONS.map((s) => (
                  <motion.button
                    key={s.text}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSendMessage(s.text)}
                    className={`text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                      darkMode
                        ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:border-zinc-700'
                        : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100 hover:border-zinc-300'
                    }`}
                  >
                    <span className="font-medium block mb-1">{s.label}</span>
                    <span className={`text-xs ${darkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>{s.text}</span>
                  </motion.button>
                ))}
              </div>

              {/* Input centered */}
              <div className="w-full">
                <ChatInput onSendMessage={handleSendMessage} disabled={isLoading || compareLoading} darkMode={darkMode} />
              </div>
            </motion.div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-8 py-8">
              <div className="max-w-4xl mx-auto space-y-6">
                {compareMode && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className={`text-xs text-center border rounded-xl py-2 ${darkMode ? 'text-zinc-400 bg-zinc-900 border-zinc-800' : 'text-zinc-500 bg-zinc-50 border-zinc-200'}`}>
                    ⚖️ Comparison Mode active — your next message will run through Groq &amp; Gemini side by side
                  </motion.div>
                )}

                {messages.map((msg) => (
                  <ChatMessage
                    key={msg.id}
                    message={msg.text}
                    isUser={msg.isUser}
                    isTyping={msg.isTyping}
                    showAgentProcess={msg.showAgentProcess}
                    agentStep={msg.agentStep}
                    darkMode={darkMode}
                    confidenceScore={msg.confidenceScore}
                    confidenceBreakdown={msg.confidenceBreakdown}
                    traces={msg.traces}
                    retries={msg.retries}
                    cacheHit={msg.cacheHit}
                  />
                ))}

                {(compareResults.length > 0 || compareLoading) && (
                  <CompareView query={compareQuery} results={compareResults} isLoading={compareLoading} darkMode={darkMode} />
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            <ChatInput onSendMessage={handleSendMessage} disabled={isLoading || compareLoading} darkMode={darkMode} />
          </>
        )}
      </div>
    </div>
  );
}

export default App;

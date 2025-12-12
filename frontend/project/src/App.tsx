import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import Sidebar from './components/Sidebar';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  isTyping?: boolean;
  showAgentProcess?: boolean;
  agentStep?: number;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your AI Multi-Agent Workflow Engine. I use four specialized agents (Research, Analysis, Validation, and Writer) to provide comprehensive answers. How can I help you today?",
      isUser: false,
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [currentAgentStep, setCurrentAgentStep] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const API_URL = import.meta.env.VITE_API_URL || "";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateAgentProgress = () => {
    return new Promise<void>((resolve) => {
      let step = 0;
      const interval = setInterval(() => {
        step++;
        setCurrentAgentStep(step);

        if (step >= 4) {
          clearInterval(interval);
          resolve();
        }
      }, 800);
    });
  };

  const handleSendMessage = async (messageText: string) => {
    if (!API_URL) {
      alert("❌ ERROR: Missing API URL. Please set VITE_API_URL in your .env file.");
      return;
    }

    const userMessage: Message = {
      id: Date.now(),
      text: messageText,
      isUser: true,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    const typingMessage: Message = {
      id: Date.now() + 1,
      text: '',
      isUser: false,
      isTyping: true,
    };

    setMessages((prev) => [...prev, typingMessage]);

    try {
      setCurrentAgentStep(0);
      const progressPromise = simulateAgentProgress();

      // ---- FIXED: Use NGROK API ----
      const response = await fetch(`${API_URL}/api/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: messageText }),
      });

      await progressPromise;

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse =
        data.result || data.output || data.message || JSON.stringify(data);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === typingMessage.id
            ? {
                ...msg,
                text: aiResponse,
                isTyping: false,
                showAgentProcess: true,
                agentStep: 4,
              }
            : msg
        )
      );
    } catch (error) {
      console.error("API error:", error);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === typingMessage.id
            ? {
                ...msg,
                text:
                  "⚠️ Error: Could not reach your backend.\n\n" +
                  "➡️ Make sure NGROK is running.\n" +
                  `➡️ Expected URL: ${API_URL}/api/run\n\n` +
                  `Details: ${
                    error instanceof Error ? error.message : "Unknown error"
                  }`,
                isTyping: false,
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
      setCurrentAgentStep(0);
    }
  };

  const handleNewChat = () => {
    setMessages([
      {
        id: Date.now(),
        text: "Hello! I'm your AI Multi-Agent Workflow Engine. Ask me anything!",
        isUser: false,
      },
    ]);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      <Sidebar onNewChat={handleNewChat} />

      <div className="flex-1 flex flex-col relative">
        <motion.header
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="bg-gradient-to-r from-slate-900/80 via-slate-800/80 to-slate-900/80
                     backdrop-blur-xl border-b border-slate-700/50 px-8 py-5"
        >
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg shadow-cyan-500/25">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">AI Assistant</h1>
                <p className="text-xs text-slate-400">Multi-Agent Processing</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-xs font-medium text-emerald-400">Online</span>
              </div>
            </div>
          </div>
        </motion.header>

        <div className="flex-1 overflow-y-auto px-8 py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                message={msg.text}
                isUser={msg.isUser}
                isTyping={msg.isTyping}
                showAgentProcess={msg.showAgentProcess}
                agentStep={msg.agentStep}
              />
            ))}

            <div ref={messagesEndRef} />
          </div>
        </div>

        <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-900/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent pointer-events-none" />
      </div>
    </div>
  );
}

export default App;

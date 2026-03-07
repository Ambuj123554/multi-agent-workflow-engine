import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Mic, MicOff } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  darkMode: boolean;
}

export default function ChatInput({ onSendMessage, disabled = false, darkMode }: ChatInputProps) {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;       // keep listening like WhatsApp
      recognition.interimResults = true;   // fire on every word instantly
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;

      let finalText = '';

      recognition.onresult = (event: any) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const t = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalText += t + ' ';
          } else {
            interim = t; // latest interim word/phrase
          }
        }
        // Update instantly on every word (interim = what you're saying right now)
        setInput((finalText + interim).trimStart());
      };

      recognition.onend = () => {
        setIsListening(false);
        finalText = '';
      };

      recognition.onerror = (event: any) => {
        if (event.error !== 'no-speech') console.error('Speech error:', event.error);
        setIsListening(false);
        finalText = '';
      };

      recognitionRef.current = recognition;
    }
    return () => recognitionRef.current?.stop();
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setInput('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }
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

  const border = darkMode ? 'border-zinc-800' : 'border-zinc-200';
  const bg = darkMode ? 'bg-zinc-950' : 'bg-white';
  const inputBg = darkMode
    ? 'bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500 focus:ring-cyan-500/40 focus:border-cyan-500/40'
    : 'bg-zinc-100 border-zinc-300 text-zinc-900 placeholder-zinc-400 focus:ring-cyan-500/40 focus:border-cyan-500/40';
  const footer = darkMode ? 'text-zinc-600' : 'text-zinc-400';

  return (
    <div className={`border-t backdrop-blur-xl p-4 ${border} ${bg}`}>
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="relative flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={disabled}
              placeholder={isListening ? '🎙️ Listening...' : 'Ask me anything...'}
              rows={1}
              className={`w-full px-5 py-4 pr-12 border rounded-2xl focus:outline-none focus:ring-2 transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed ${inputBg} ${
                isListening ? 'ring-2 ring-red-500/50 border-red-500/50' : ''
              }`}
              style={{ minHeight: '56px', maxHeight: '200px' }}
            />

            {/* Mic button */}
            {speechSupported && (
              <button
                type="button"
                onClick={toggleListening}
                disabled={disabled}
                title={isListening ? 'Stop recording' : 'Start voice input'}
                className={`absolute right-4 bottom-3 w-8 h-8 rounded-xl flex items-center justify-center transition-all disabled:opacity-50 ${
                  isListening
                    ? 'bg-red-600 text-white'
                    : 'bg-black text-white hover:bg-zinc-800'
                }`}
              >
                {isListening ? (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                  >
                    <MicOff className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </button>
            )}
          </div>

          <motion.button
            whileHover={{ scale: disabled ? 1 : 1.05 }}
            whileTap={{ scale: disabled ? 1 : 0.95 }}
            type="submit"
            disabled={disabled || !input.trim()}
            className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed ${darkMode ? 'bg-zinc-800 hover:bg-zinc-700' : 'bg-zinc-900 hover:bg-zinc-700'}`}
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>

        <p className={`text-xs text-center mt-3 ${footer}`}>
          {isListening
            ? '🔴 Recording — speak now, press Send or click mic to stop'
            : 'Powered by AI Multi-Agent Workflow Engine'}
        </p>
      </form>
    </div>
  );
}

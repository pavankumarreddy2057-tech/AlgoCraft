import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Sparkles, 
  Send, 
  X, 
  Loader2, 
  Bot, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';

interface AIMentorDrawerProps {
  slug: string;
  problemTitle: string;
  statementMd: string;
  userCode: string;
  language: string;
  isOpen: boolean;
  onClose: () => void;
}

export const AIMentorDrawer: React.FC<AIMentorDrawerProps> = ({
  slug,
  problemTitle,
  statementMd,
  userCode,
  language,
  isOpen,
  onClose
}) => {
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; model?: string }>>([
    {
      sender: 'ai',
      text: "👋 Hi! I am your Socratic AI Coding Mentor. Ask me for guidance on data structures, time complexity tradeoffs, or subtle edge cases without spoiling the solution."
    }
  ]);
  const [inputQuery, setInputQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [ollamaStatus, setOllamaStatus] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/mentor/status')
        .then(res => res.json())
        .then(data => setOllamaStatus(data.ollama))
        .catch(console.error);
    }
  }, [isOpen]);

  const handleAsk = async (queryText?: string) => {
    const q = queryText || inputQuery;
    if (!q.trim() || loading) return;

    const newMsgs = [...messages, { sender: 'user' as const, text: q }];
    setMessages(newMsgs);
    setInputQuery('');
    setLoading(true);

    try {
      const res = await fetch('/api/mentor/hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemTitle,
          statementMd,
          userCode,
          language,
          userQuestion: q
        })
      });

      const data = await res.json();
      if (data.success) {
        setMessages([
          ...newMsgs,
          {
            sender: 'ai',
            text: data.data.hint,
            model: data.data.modelUsed
          }
        ]);
      }
    } catch (e: any) {
      setMessages([
        ...newMsgs,
        {
          sender: 'ai',
          text: `⚠️ Mentor communication error: ${e.message}`
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-[420px] bg-[#161b22] border-l border-[#30363d] shadow-2xl z-40 flex flex-col animate-in slide-in-from-right duration-200">
      {/* Drawer Header */}
      <div className="h-12 px-4 border-b border-[#30363d] bg-[#1e222d] flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-white">
          <Bot className="w-4 h-4 text-purple-400" />
          Socratic AI Mentor
          {ollamaStatus?.available ? (
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Ollama Active
            </span>
          ) : (
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-gray-700 text-gray-300">
              Offline Engine
            </span>
          )}
        </div>
        <button onClick={onClose} className="p-1 text-gray-400 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`p-3 rounded-xl text-xs leading-relaxed max-w-[90%] ${
                m.sender === 'user'
                  ? 'bg-emerald-600 text-white rounded-br-none'
                  : 'bg-[#0d1117] border border-[#30363d] text-gray-200 rounded-bl-none shadow-sm'
              }`}
            >
              {m.text}
            </div>
            {m.model && (
              <span className="text-[9px] text-gray-500 mt-1 font-mono">
                via {m.model}
              </span>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-xs text-purple-400 bg-[#0d1117] p-2.5 rounded-xl border border-[#30363d] w-max">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Thinking Socratic hint...
          </div>
        )}
      </div>

      {/* Quick Prompts */}
      <div className="p-3 border-t border-[#30363d] bg-[#0d1117]/60 space-y-1.5">
        <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Suggested Questions</div>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => handleAsk("What algorithmic pattern applies here?")}
            className="px-2 py-1 rounded bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] text-[11px] text-gray-300 text-left transition-colors"
          >
            Pattern hints?
          </button>
          <button
            onClick={() => handleAsk("What edge cases should I consider?")}
            className="px-2 py-1 rounded bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] text-[11px] text-gray-300 text-left transition-colors"
          >
            Edge cases?
          </button>
          <button
            onClick={() => handleAsk("Can you review my current code logic?")}
            className="px-2 py-1 rounded bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] text-[11px] text-gray-300 text-left transition-colors"
          >
            Review my code
          </button>
        </div>
      </div>

      {/* Input Field */}
      <div className="p-3 border-t border-[#30363d] bg-[#1e222d] flex items-center gap-2">
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
          placeholder="Ask mentor a question..."
          className="flex-1 px-3 py-1.5 bg-[#0d1117] border border-[#30363d] rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
        />
        <button
          onClick={() => handleAsk()}
          disabled={loading || !inputQuery.trim()}
          className="p-2 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

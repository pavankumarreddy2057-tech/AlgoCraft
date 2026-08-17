import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { 
  Play, 
  Send, 
  RotateCcw, 
  Timer, 
  Pause, 
  Loader2,
  Check,
  Bot,
  FileText,
  Activity,
  Copy,
  Sparkles,
  AlignLeft,
  PanelLeftClose,
  PanelLeftOpen,
  Maximize2,
  Minimize2
} from 'lucide-react';

interface CodeEditorProps {
  language: 'python' | 'javascript' | 'sql';
  onChangeLanguage: (lang: 'python' | 'javascript' | 'sql') => void;
  code: string;
  onChangeCode: (code: string) => void;
  onResetCode: () => void;
  onRun: () => void;
  onSubmit: () => void;
  onOpenNotes?: () => void;
  onOpenMentor?: () => void;
  onOpenBenchmark?: () => void;
  onToggleLeftPanel?: () => void;
  isLeftPanelCollapsed?: boolean;
  isRunning: boolean;
  isSubmitting: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  language,
  onChangeLanguage,
  code,
  onChangeCode,
  onResetCode,
  onRun,
  onSubmit,
  onOpenNotes,
  onOpenMentor,
  onOpenBenchmark,
  onToggleLeftPanel,
  isLeftPanelCollapsed,
  isRunning,
  isSubmitting
}) => {
  const [fontSize, setFontSize] = useState<number>(14);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [timerRunning, setTimerRunning] = useState<boolean>(true);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const editorRef = useRef<any>(null);

  // Timer interval
  useEffect(() => {
    let interval: any = null;
    if (timerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1800);
    } catch (e) {
      console.error('Failed to copy code:', e);
    }
  };

  const handleFormatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument')?.run();
    }
  };

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;

    // Custom dark theme configuration
    monaco.editor.defineTheme('algocraft-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '64748b', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'f43f5e', fontStyle: 'bold' },
        { token: 'identifier', foreground: 'c084fc' },
        { token: 'string', foreground: '60a5fa' },
        { token: 'number', foreground: '38bdf8' }
      ],
      colors: {
        'editor.background': '#0f141c',
        'editor.foreground': '#f1f5f9',
        'editor.lineHighlightBackground': '#18202c',
        'editorCursor.foreground': '#10b981',
        'editorLineNumber.foreground': '#475569',
        'editorLineNumber.activeForeground': '#f8fafc',
        'editor.selectionBackground': '#3b82f633',
        'editor.inactiveSelectionBackground': '#3b82f61a'
      }
    });
    monaco.editor.setTheme('algocraft-dark');

    // Keybindings: Ctrl+Enter (Run), Ctrl+Shift+Enter (Submit)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onRun();
    });
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.Enter, () => {
      onSubmit();
    });
  };

  return (
    <div className="h-full flex flex-col bg-[#0f141c] select-none">
      
      {/* Top Toolbar */}
      <div className="h-11 border-b border-[#262d3d] px-3 flex items-center justify-between bg-[#12161f] text-xs">
        {/* Left: Collapse Button & Language selector & Tools */}
        <div className="flex items-center gap-2">
          
          {/* Panel Collapse / Expand Button (Desktop) */}
          {onToggleLeftPanel && (
            <button
              onClick={onToggleLeftPanel}
              className="hidden md:flex p-1.5 text-gray-400 hover:text-white hover:bg-[#1a202c] rounded-lg border border-[#262d3d] transition"
              title={isLeftPanelCollapsed ? "Expand Problem Statement Panel" : "Collapse Problem Statement (Full Editor Width)"}
              aria-label="Toggle panel width"
            >
              {isLeftPanelCollapsed ? <PanelLeftOpen className="w-3.5 h-3.5 text-blue-400" /> : <PanelLeftClose className="w-3.5 h-3.5" />}
            </button>
          )}

          <div className="relative">
            <select
              value={language}
              onChange={(e) => onChangeLanguage(e.target.value as any)}
              className="bg-[#1a202c] border border-[#262d3d] text-gray-200 rounded-lg px-2.5 py-1 pr-6 text-xs font-semibold focus:outline-none focus:border-blue-500 cursor-pointer appearance-none"
            >
              <option value="python">Python 3</option>
              <option value="javascript">JavaScript (Node.js)</option>
              <option value="sql">SQL (SQLite)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 text-gray-400">
              ▼
            </div>
          </div>

          {/* Socratic AI Mentor Button */}
          {onOpenMentor && (
            <button
              onClick={onOpenMentor}
              className="px-2.5 py-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-lg flex items-center gap-1.5 font-semibold transition-colors"
              title="Open Socratic AI Mentor"
            >
              <Bot className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">AI Mentor</span>
            </button>
          )}

          {/* Notes Scratchpad */}
          {onOpenNotes && (
            <button
              onClick={onOpenNotes}
              className="px-2.5 py-1 bg-[#1a202c] hover:bg-[#262d3d] text-gray-300 border border-[#262d3d] rounded-lg flex items-center gap-1.5 font-semibold transition-colors"
              title="Open Problem Notes"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Notes</span>
            </button>
          )}

          {/* Big-O Profiler */}
          {onOpenBenchmark && (
            <button
              onClick={onOpenBenchmark}
              className="hidden lg:flex px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg items-center gap-1.5 font-semibold transition-colors"
              title="Empirical Big-O Benchmarker"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Big-O</span>
            </button>
          )}
        </div>

        {/* Right: High-Prominence Digital Timer, Copy, Format, Font Sizing, Reset */}
        <div className="flex items-center gap-2">
          
          {/* Prominent High-Contrast Elapsed Timer */}
          <div className="flex items-center gap-1.5 font-mono text-emerald-400 bg-[#0a0d12] px-2.5 py-1 rounded-xl border border-emerald-500/30 shadow-sm shadow-emerald-500/10">
            <Timer className={`w-3.5 h-3.5 ${timerRunning ? 'animate-pulse text-emerald-400' : 'text-gray-500'}`} />
            <span className="text-xs font-bold text-gray-100">{formatTimer(timerSeconds)}</span>
            <button
              onClick={() => setTimerRunning(!timerRunning)}
              className="text-gray-400 hover:text-white ml-0.5 p-0.5"
              title={timerRunning ? "Pause timer" : "Resume timer"}
              aria-label={timerRunning ? "Pause timer" : "Resume timer"}
            >
              <Pause className="w-3 h-3" />
            </button>
          </div>

          {/* Copy Code */}
          <button
            onClick={handleCopyCode}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-[#1a202c] rounded-lg border border-transparent hover:border-[#262d3d] transition"
            title="Copy code to clipboard"
            aria-label="Copy code"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* Format Code */}
          <button
            onClick={handleFormatCode}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-[#1a202c] rounded-lg border border-transparent hover:border-[#262d3d] transition hidden sm:flex"
            title="Format Code"
            aria-label="Format Code"
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </button>

          {/* Font size control */}
          <div className="hidden sm:flex items-center gap-1 text-gray-400 bg-[#1a202c] px-1.5 py-0.5 rounded-lg border border-[#262d3d]">
            <button
              onClick={() => setFontSize(s => Math.max(11, s - 1))}
              className="px-1 hover:text-white rounded"
              title="Decrease Font Size"
            >
              A-
            </button>
            <span className="text-[10px] font-mono text-gray-300">{fontSize}px</span>
            <button
              onClick={() => setFontSize(s => Math.min(22, s + 1))}
              className="px-1 hover:text-white rounded"
              title="Increase Font Size"
            >
              A+
            </button>
          </div>

          {/* Reset Code */}
          <button
            onClick={onResetCode}
            className="p-1.5 text-gray-400 hover:text-rose-400 hover:bg-[#1a202c] rounded-lg border border-transparent hover:border-[#262d3d] transition-colors"
            title="Reset code template"
            aria-label="Reset code template"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Monaco Editor Container */}
      <div className="flex-1 w-full relative">
        <Editor
          height="100%"
          language={language === 'sql' ? 'sql' : language === 'javascript' ? 'javascript' : 'python'}
          value={code}
          onChange={(val) => onChangeCode(val || '')}
          onMount={handleEditorDidMount}
          theme="algocraft-dark"
          options={{
            fontSize,
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: language === 'python' ? 4 : 2,
            lineNumbers: 'on',
            lineNumbersMinChars: 3,
            renderWhitespace: 'selection',
            bracketPairColorization: { enabled: true },
            wordWrap: 'on',
            padding: { top: 12, bottom: 12 }
          }}
        />
      </div>

      {/* Bottom Action Footer Bar */}
      <div className="h-11 border-t border-[#262d3d] px-3 bg-[#12161f] flex items-center justify-between shrink-0">
        <div className="hidden sm:flex items-center gap-2 text-[11px] text-gray-500 font-mono">
          <span>Run: <kbd className="px-1.5 py-0.5 bg-[#1a202c] rounded border border-[#262d3d] text-gray-300">Ctrl+Enter</kbd></span>
          <span>Submit: <kbd className="px-1.5 py-0.5 bg-[#1a202c] rounded border border-[#262d3d] text-gray-300">Ctrl+Shift+Enter</kbd></span>
        </div>

        <div className="flex items-center gap-2 ml-auto sm:ml-0">
          <button
            onClick={onRun}
            disabled={isRunning || isSubmitting}
            className="px-3.5 py-1.5 bg-[#1a202c] hover:bg-[#262d3d] disabled:opacity-50 text-gray-200 border border-[#262d3d] rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm active:scale-95"
          >
            {isRunning ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
            ) : (
              <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
            )}
            <span>Run Code</span>
          </button>

          <button
            onClick={onSubmit}
            disabled={isRunning || isSubmitting}
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md shadow-emerald-600/20 active:scale-95"
          >
            {isSubmitting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            <span>Submit Solution</span>
          </button>
        </div>
      </div>
    </div>
  );
};

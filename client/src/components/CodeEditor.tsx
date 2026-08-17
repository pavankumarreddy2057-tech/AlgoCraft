import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { 
  Play, 
  Send, 
  RotateCcw, 
  Timer, 
  Pause, 
  Code2, 
  Type, 
  Loader2,
  Check,
  Bot,
  FileText,
  Activity,
  Terminal
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
  isRunning,
  isSubmitting
}) => {
  const [fontSize, setFontSize] = useState<number>(14);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [timerRunning, setTimerRunning] = useState<boolean>(true);
  const [vimMode, setVimMode] = useState<boolean>(false);
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

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;

    // Custom dark theme configuration
    monaco.editor.defineTheme('algocraft-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '7d8799', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'ff7b72', fontStyle: 'bold' },
        { token: 'identifier', foreground: 'd2a8ff' },
        { token: 'string', foreground: 'a5d6ff' },
        { token: 'number', foreground: '79c0ff' }
      ],
      colors: {
        'editor.background': '#161b22',
        'editor.foreground': '#e6edf3',
        'editor.lineHighlightBackground': '#21262d55',
        'editorCursor.foreground': '#2ea043',
        'editorLineNumber.foreground': '#484f58',
        'editorLineNumber.activeForeground': '#e6edf3',
        'editor.selectionBackground': '#1f6feb44',
        'editor.inactiveSelectionBackground': '#1f6feb22'
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
    <div className="h-full flex flex-col bg-[#161b22] select-none">
      {/* Top Toolbar */}
      <div className="h-10 border-b border-[#30363d] px-3 flex items-center justify-between bg-[#161b22] text-xs">
        {/* Left: Language selector & tools */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={language}
              onChange={(e) => onChangeLanguage(e.target.value as any)}
              className="bg-[#21262d] border border-[#30363d] text-gray-200 rounded-md px-2 py-1 pr-6 text-xs font-semibold focus:outline-none focus:border-emerald-500 cursor-pointer appearance-none"
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
              className="px-2 py-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-md flex items-center gap-1 font-semibold transition-colors"
              title="Open Socratic AI Mentor"
            >
              <Bot className="w-3.5 h-3.5" />
              AI Mentor
            </button>
          )}

          {/* Notes Scratchpad */}
          {onOpenNotes && (
            <button
              onClick={onOpenNotes}
              className="px-2 py-1 bg-[#21262d] hover:bg-[#30363d] text-gray-300 border border-[#30363d] rounded-md flex items-center gap-1 font-semibold transition-colors"
              title="Open Problem Notes"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              Notes
            </button>
          )}

          {/* Big-O Profiler */}
          {onOpenBenchmark && (
            <button
              onClick={onOpenBenchmark}
              className="px-2 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-md flex items-center gap-1 font-semibold transition-colors"
              title="Empirical Big-O Benchmarker"
            >
              <Activity className="w-3.5 h-3.5" />
              Big-O
            </button>
          )}
        </div>

        {/* Right: Stopwatch, Font Sizing, Reset */}
        <div className="flex items-center gap-3">
          {/* Stopwatch */}
          <div className="flex items-center gap-1.5 font-mono text-gray-300 bg-[#21262d] px-2 py-0.5 rounded border border-[#30363d]">
            <Timer className="w-3.5 h-3.5 text-emerald-400" />
            <span>{formatTimer(timerSeconds)}</span>
            <button
              onClick={() => setTimerRunning(!timerRunning)}
              className="text-gray-400 hover:text-white ml-0.5"
              title={timerRunning ? "Pause timer" : "Resume timer"}
            >
              <Pause className="w-3 h-3" />
            </button>
          </div>

          {/* Font size control */}
          <div className="flex items-center gap-1 text-gray-400">
            <button
              onClick={() => setFontSize(s => Math.max(11, s - 1))}
              className="p-1 hover:text-white rounded"
              title="Decrease Font Size"
            >
              A-
            </button>
            <span className="text-[11px] font-mono text-gray-300">{fontSize}px</span>
            <button
              onClick={() => setFontSize(s => Math.min(22, s + 1))}
              className="p-1 hover:text-white rounded"
              title="Increase Font Size"
            >
              A+
            </button>
          </div>

          {/* Reset Code */}
          <button
            onClick={onResetCode}
            className="p-1 text-gray-400 hover:text-rose-400 transition-colors"
            title="Reset code to original template"
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
      <div className="h-11 border-t border-[#30363d] px-3 bg-[#161b22] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 text-[11px] text-gray-500 font-mono">
          <span>Run: <kbd className="px-1 py-0.5 bg-[#21262d] rounded border border-[#30363d] text-gray-300">Ctrl+Enter</kbd></span>
          <span>Submit: <kbd className="px-1 py-0.5 bg-[#21262d] rounded border border-[#30363d] text-gray-300">Ctrl+Shift+Enter</kbd></span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRun}
            disabled={isRunning || isSubmitting}
            className="px-3.5 py-1.5 bg-[#21262d] hover:bg-[#30363d] disabled:opacity-50 text-gray-200 border border-[#30363d] rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            {isRunning ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
            ) : (
              <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
            )}
            Run Code
          </button>

          <button
            onClick={onSubmit}
            disabled={isRunning || isSubmitting}
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md"
          >
            {isSubmitting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

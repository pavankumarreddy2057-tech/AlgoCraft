import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Bookmark, 
  BookOpen, 
  History, 
  Code2, 
  FileText, 
  CheckCircle2, 
  XCircle,
  Loader2,
  Bot,
  Layers,
  Terminal
} from 'lucide-react';
import { ProblemDetail, ExecutionResult, SubmissionHistoryItem } from '../types/index.js';
import { 
  fetchProblemDetail, 
  runCode, 
  submitCode, 
  fetchSubmissionHistory, 
  toggleBookmark 
} from '../lib/api.js';
import { CodeEditor } from './CodeEditor.js';
import { TestRunnerPanel } from './TestRunnerPanel.js';
import { HintsAndSolution } from './HintsAndSolution.js';
import { ProblemNotesDrawer } from './ProblemNotesDrawer.js';
import { AIMentorDrawer } from './AIMentorDrawer.js';
import { BigOBenchmarkModal } from './BigOBenchmarkModal.js';

interface WorkspaceProps {
  slug: string;
  onBack: () => void;
  onNavigateProblem: (slug: string) => void;
  onRefreshStats: () => void;
}

export const Workspace: React.FC<WorkspaceProps> = ({
  slug,
  onBack,
  onNavigateProblem,
  onRefreshStats
}) => {
  const [problemData, setProblemData] = useState<ProblemDetail | null>(null);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Desktop tab states
  const [activeLeftTab, setActiveLeftTab] = useState<'description' | 'editorial' | 'submissions'>('description');
  
  // Mobile active tab state
  const [mobileTab, setMobileTab] = useState<'description' | 'editor' | 'results' | 'mentor'>('description');

  const [language, setLanguage] = useState<'python' | 'javascript' | 'sql'>('python');
  const [code, setCode] = useState<string>('');

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [history, setHistory] = useState<SubmissionHistoryItem[]>([]);

  // V2 Drawer & Modal States
  const [isNotesOpen, setIsNotesOpen] = useState<boolean>(false);
  const [isMentorOpen, setIsMentorOpen] = useState<boolean>(false);
  const [isBenchmarkOpen, setIsBenchmarkOpen] = useState<boolean>(false);

  // Split pane height state for desktop
  const [editorHeightPercent, setEditorHeightPercent] = useState<number>(60);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  useEffect(() => {
    async function loadProblem() {
      try {
        setLoading(true);
        setExecutionResult(null);
        const data = await fetchProblemDetail(slug);
        setProblemData(data.problem);
        setIsBookmarked(!!data.spaced_repetition?.flagged_review);

        // Check if SQL problem
        if (data.problem.starter_code.sql) {
          setLanguage('sql');
          setCode(data.problem.starter_code.sql || '');
        } else {
          const currentLang = (language === 'sql' ? 'python' : language);
          setLanguage(currentLang);
          const initialCode = data.problem.starter_code[currentLang] || data.problem.starter_code.python || '';
          setCode(initialCode);
        }

        // Load past submissions
        const hist = await fetchSubmissionHistory(slug);
        setHistory(hist);
      } catch (err: any) {
        console.error('Failed to load problem:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProblem();
  }, [slug]);

  const handleChangeLanguage = (newLang: 'python' | 'javascript' | 'sql') => {
    setLanguage(newLang);
    if (problemData && problemData.starter_code) {
      const template = problemData.starter_code[newLang] || problemData.starter_code.python || '';
      setCode(template);
    }
  };

  const handleResetCode = () => {
    if (problemData && problemData.starter_code) {
      setCode(problemData.starter_code[language] || problemData.starter_code.python || '');
    }
  };

  const handleToggleBookmark = async () => {
    try {
      const res = await toggleBookmark(slug);
      setIsBookmarked(res.isBookmarked);
      onRefreshStats();
    } catch (e) {
      console.error('Bookmark error:', e);
    }
  };

  const handleRun = async (customTestCases?: any[]) => {
    try {
      setIsRunning(true);
      const res = await runCode(slug, code, language, customTestCases);
      setExecutionResult(res);
      // Auto-switch to results tab on mobile
      setMobileTab('results');
    } catch (err: any) {
      setExecutionResult({
        success: false,
        status: 'Runtime Error',
        test_cases_passed: 0,
        total_test_cases: 0,
        runtime_ms: 0,
        memory_kb: 0,
        error_message: err.message,
        results: []
      });
      setMobileTab('results');
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const res = await submitCode(slug, code, language);
      setExecutionResult(res.execution);
      onRefreshStats();
      const updatedHist = await fetchSubmissionHistory(slug);
      setHistory(updatedHist);
      // Auto-switch to results tab on mobile
      setMobileTab('results');
    } catch (err: any) {
      setExecutionResult({
        success: false,
        status: 'Runtime Error',
        test_cases_passed: 0,
        total_test_cases: 0,
        runtime_ms: 0,
        memory_kb: 0,
        error_message: err.message,
        results: []
      });
      setMobileTab('results');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mobile quick symbol insert helper
  const insertSymbol = (sym: string) => {
    setCode(prev => prev + sym);
  };

  const handleMouseDown = () => setIsDragging(true);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const rightPane = document.getElementById('right-workspace-pane');
      if (!rightPane) return;
      const rect = rightPane.getBoundingClientRect();
      const relativeY = e.clientY - rect.top;
      const percentage = Math.min(Math.max((relativeY / rect.height) * 100, 20), 80);
      setEditorHeightPercent(percentage);
    };

    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  if (loading || !problemData) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
        Loading workspace...
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] overflow-hidden bg-[#0d1117] relative">
      
      {/* Sub-header Bar */}
      <div className="h-10 border-b border-[#30363d] bg-[#161b22] px-3 md:px-4 flex items-center justify-between select-none shrink-0">
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          <button
            onClick={onBack}
            className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-[#21262d] transition-colors flex items-center gap-1 text-xs font-semibold shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Problem Bank</span>
          </button>
          <span className="text-gray-600 hidden sm:inline">|</span>
          <span className="text-xs font-bold text-white truncate max-w-[180px] sm:max-w-xs">
            {problemData.id}. {problemData.title}
          </span>
          <span
            className={`text-[10px] font-semibold px-2 py-0.2 rounded shrink-0 ${
              problemData.difficulty === 'Easy'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : problemData.difficulty === 'Medium'
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}
          >
            {problemData.difficulty}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleToggleBookmark}
            className={`p-1.5 rounded-lg border border-[#30363d] ${
              isBookmarked ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'text-gray-400 hover:text-white bg-[#21262d]'
            } transition-colors`}
            title="Bookmark Problem"
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile Tab Switcher (< md screens) */}
      <div className="md:hidden flex items-center justify-around h-10 border-b border-[#30363d] bg-[#161b22] px-1 select-none shrink-0">
        <button
          onClick={() => setMobileTab('description')}
          className={`flex-1 py-1.5 text-xs font-semibold flex items-center justify-center gap-1 border-b-2 transition ${
            mobileTab === 'description' ? 'border-emerald-400 text-emerald-400' : 'border-transparent text-gray-400'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Statement</span>
        </button>
        <button
          onClick={() => setMobileTab('editor')}
          className={`flex-1 py-1.5 text-xs font-semibold flex items-center justify-center gap-1 border-b-2 transition ${
            mobileTab === 'editor' ? 'border-blue-400 text-blue-400' : 'border-transparent text-gray-400'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Code</span>
        </button>
        <button
          onClick={() => setMobileTab('results')}
          className={`flex-1 py-1.5 text-xs font-semibold flex items-center justify-center gap-1 border-b-2 transition relative ${
            mobileTab === 'results' ? 'border-purple-400 text-purple-400' : 'border-transparent text-gray-400'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Results</span>
          {executionResult && (
            <span className={`w-1.5 h-1.5 rounded-full ${executionResult.status === 'Accepted' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
          )}
        </button>
        <button
          onClick={() => setIsMentorOpen(true)}
          className="flex-1 py-1.5 text-xs font-semibold flex items-center justify-center gap-1 text-purple-300"
        >
          <Bot className="w-3.5 h-3.5" />
          <span>AI</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. Desktop Side-by-Side Split View (md:flex) */}
      {/* ========================================================================= */}
      <div className="hidden md:flex flex-1 overflow-hidden">
        {/* Left Side: Description, Hints & Editorial, Submissions */}
        <div className="w-1/2 flex flex-col border-r border-[#30363d] bg-[#0d1117] overflow-hidden">
          <div className="h-10 border-b border-[#30363d] bg-[#161b22] px-3 flex items-center gap-1 select-none shrink-0">
            <button
              onClick={() => setActiveLeftTab('description')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors ${
                activeLeftTab === 'description'
                  ? 'bg-[#21262d] text-white border border-[#30363d]'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              Description
            </button>

            <button
              onClick={() => setActiveLeftTab('editorial')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors ${
                activeLeftTab === 'editorial'
                  ? 'bg-[#21262d] text-white border border-[#30363d]'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-sky-400" />
              Hints & Editorial
            </button>

            <button
              onClick={() => setActiveLeftTab('submissions')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors ${
                activeLeftTab === 'submissions'
                  ? 'bg-[#21262d] text-white border border-[#30363d]'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <History className="w-3.5 h-3.5 text-purple-400" />
              Submissions ({history.length})
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {activeLeftTab === 'description' && (
              <DescriptionContent problemData={problemData} />
            )}
            {activeLeftTab === 'editorial' && (
              <HintsAndSolution
                hints={problemData.hints}
                referenceSolution={problemData.reference_solution}
                editorialMd={problemData.editorial_md}
              />
            )}
            {activeLeftTab === 'submissions' && (
              <SubmissionsContent history={history} />
            )}
          </div>
        </div>

        {/* Right Side: Monaco Code Editor + Resizable Test Runner */}
        <div id="right-workspace-pane" className="w-1/2 flex flex-col bg-[#161b22] overflow-hidden relative">
          <div style={{ height: `${editorHeightPercent}%` }} className="w-full">
            <CodeEditor
              language={language}
              onChangeLanguage={handleChangeLanguage}
              code={code}
              onChangeCode={setCode}
              onResetCode={handleResetCode}
              onRun={handleRun}
              onSubmit={handleSubmit}
              onOpenNotes={() => setIsNotesOpen(true)}
              onOpenMentor={() => setIsMentorOpen(true)}
              onOpenBenchmark={() => setIsBenchmarkOpen(true)}
              isRunning={isRunning}
              isSubmitting={isSubmitting}
            />
          </div>

          {/* Resizable Divider Handle */}
          <div
            onMouseDown={handleMouseDown}
            className="h-2 bg-[#0d1117] hover:bg-emerald-500/50 cursor-row-resize border-y border-[#30363d] flex items-center justify-center transition-colors z-20 shrink-0 select-none"
          >
            <div className="w-8 h-1 rounded-full bg-gray-600" />
          </div>

          {/* Bottom: Test Runner Panel */}
          <div style={{ height: `${100 - editorHeightPercent}%` }} className="w-full">
            <TestRunnerPanel
              slug={slug}
              sampleTestCases={problemData.sample_test_cases}
              executionResult={executionResult}
              isRunning={isRunning}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. Mobile Single-Tab View (md:hidden) */}
      {/* ========================================================================= */}
      <div className="md:hidden flex-1 flex flex-col overflow-hidden bg-[#0d1117]">
        {mobileTab === 'description' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            <DescriptionContent problemData={problemData} />
          </div>
        )}

        {mobileTab === 'editor' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Quick Touch Symbol Toolbar */}
            <div className="h-8 bg-[#1c2128] border-b border-[#30363d] px-2 flex items-center gap-1.5 overflow-x-auto select-none shrink-0">
              {['Tab', 'def ', 'return ', ':', '()', '[]', '{}', '""', "''", '==', '!=', '<=', '>='].map((sym) => (
                <button
                  key={sym}
                  onClick={() => insertSymbol(sym === 'Tab' ? '    ' : sym)}
                  className="px-2 py-0.5 bg-[#0d1117] hover:bg-[#21262d] text-gray-200 text-[11px] font-mono rounded border border-[#30363d] shrink-0"
                >
                  {sym}
                </button>
              ))}
            </div>

            <div className="flex-1">
              <CodeEditor
                language={language}
                onChangeLanguage={handleChangeLanguage}
                code={code}
                onChangeCode={setCode}
                onResetCode={handleResetCode}
                onRun={handleRun}
                onSubmit={handleSubmit}
                onOpenNotes={() => setIsNotesOpen(true)}
                onOpenMentor={() => setIsMentorOpen(true)}
                onOpenBenchmark={() => setIsBenchmarkOpen(true)}
                isRunning={isRunning}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>
        )}

        {mobileTab === 'results' && (
          <div className="flex-1 overflow-y-auto">
            <TestRunnerPanel
              slug={slug}
              sampleTestCases={problemData.sample_test_cases}
              executionResult={executionResult}
              isRunning={isRunning}
              isSubmitting={isSubmitting}
            />
          </div>
        )}
      </div>

      {/* V2 Drawers & Modals */}
      <ProblemNotesDrawer
        slug={slug}
        isOpen={isNotesOpen}
        onClose={() => setIsNotesOpen(false)}
      />

      <AIMentorDrawer
        slug={slug}
        problemTitle={problemData.title}
        statementMd={problemData.statement_md}
        userCode={code}
        language={language}
        isOpen={isMentorOpen}
        onClose={() => setIsMentorOpen(false)}
      />

      <BigOBenchmarkModal
        slug={slug}
        code={code}
        language={language}
        isOpen={isBenchmarkOpen}
        onClose={() => setIsBenchmarkOpen(false)}
      />
    </div>
  );
};

// Reusable Description Component
function DescriptionContent({ problemData }: { problemData: ProblemDetail }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white mb-2.5">
          {problemData.id}. {problemData.title}
        </h1>
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded ${
              problemData.difficulty === 'Easy'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : problemData.difficulty === 'Medium'
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}
          >
            {problemData.difficulty}
          </span>
          {problemData.tags.map(tag => (
            <span key={tag} className="text-xs px-2 py-0.5 rounded bg-[#161b22] text-gray-300 border border-[#30363d]">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="markdown-body text-sm leading-relaxed text-gray-300">
        {problemData.statement_md.split('\n').map((p, idx) => (
          <p key={idx}>{p}</p>
        ))}
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white">Examples</h3>
        {problemData.examples.map((ex, idx) => (
          <div key={idx} className="p-3.5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-2 text-xs">
            <div className="font-semibold text-gray-300">Example {idx + 1}:</div>
            <div className="space-y-1 font-mono text-gray-300">
              <div>
                <strong className="text-gray-400 font-sans">Input: </strong>
                <span className="text-emerald-300">{typeof ex.input === 'string' ? ex.input : JSON.stringify(ex.input)}</span>
              </div>
              <div>
                <strong className="text-gray-400 font-sans">Output: </strong>
                <span className="text-sky-300">{typeof ex.output === 'string' ? ex.output : JSON.stringify(ex.output)}</span>
              </div>
              {ex.explanation && (
                <div className="text-gray-400 font-sans mt-1">
                  <strong>Explanation: </strong> {ex.explanation}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {problemData.constraints && problemData.constraints.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-white">Constraints</h3>
          <ul className="list-disc list-inside text-xs text-gray-300 space-y-1 bg-[#161b22] p-3.5 rounded-xl border border-[#30363d] font-mono">
            {problemData.constraints.map((c, idx) => (
              <li key={idx}>{c}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// Reusable Submissions History Component
function SubmissionsContent({ history }: { history: SubmissionHistoryItem[] }) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-white">Submission History</h3>
      {history.length === 0 ? (
        <div className="py-12 text-center text-gray-400 text-xs">
          No submissions recorded yet for this problem.
        </div>
      ) : (
        <div className="space-y-2">
          {history.map((sub) => (
            <div
              key={sub.id}
              className="p-3 rounded-xl bg-[#161b22] border border-[#30363d] flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2.5">
                {sub.status === 'Accepted' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <div>
                  <div className={`font-bold ${sub.status === 'Accepted' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {sub.status}
                  </div>
                  <div className="text-[11px] text-gray-400 mt-0.5">
                    {new Date(sub.created_at).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="text-right font-mono text-[11px] text-gray-300 space-y-0.5">
                <div>{sub.runtime_ms} ms</div>
                <div className="text-gray-500 uppercase">{sub.language}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

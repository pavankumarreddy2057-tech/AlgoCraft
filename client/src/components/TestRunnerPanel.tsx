import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Cpu, 
  Terminal, 
  Plus, 
  Sparkles, 
  Brain,
  AlertTriangle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { ExecutionResult, SampleTestCase, TestCaseResult } from '../types/index.js';
import { recordReviewGrade } from '../lib/api.js';
import { SQLTableViewer } from './SQLTableViewer.js';

interface TestRunnerPanelProps {
  slug: string;
  sampleTestCases: SampleTestCase[];
  executionResult: ExecutionResult | null;
  isRunning: boolean;
  isSubmitting: boolean;
}

export const TestRunnerPanel: React.FC<TestRunnerPanelProps> = ({
  slug,
  sampleTestCases,
  executionResult,
  isRunning,
  isSubmitting
}) => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [customInputJson, setCustomInputJson] = useState<string>('{\n  "nums": [2, 7, 11, 15],\n  "target": 9\n}');
  const [customExpectedJson, setCustomExpectedJson] = useState<string>('[0, 1]');
  const [ratedSuccess, setRatedSuccess] = useState<string | null>(null);

  // Trigger confetti on accepted submission
  React.useEffect(() => {
    if (executionResult && executionResult.status === 'Accepted' && isSubmitting === false) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [executionResult, isSubmitting]);

  const handleRateSM2 = async (grade: number) => {
    try {
      const res = await recordReviewGrade(slug, grade);
      setRatedSuccess(`Scheduled next review in ${res.updated.interval} day(s)!`);
    } catch (err: any) {
      alert(`Error recording review grade: ${err.message}`);
    }
  };

  const results = executionResult?.results || [];

  return (
    <div className="h-full bg-[#161b22] border-t border-[#30363d] flex flex-col overflow-hidden select-none">
      {/* Header Tabs */}
      <div className="h-10 border-b border-[#30363d] bg-[#1e222d] px-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1 overflow-x-auto">
          {/* Sample Case Tabs */}
          {sampleTestCases.map((tc, idx) => {
            const res = results[idx];
            return (
              <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={`px-3 py-1 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors ${
                  activeTab === idx
                    ? 'bg-[#21262d] text-white border border-[#30363d]'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {res && (
                  res.passed ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-rose-400" />
                  )
                )}
                Case {idx + 1}
              </button>
            );
          })}
        </div>

        {/* Status indicator on right */}
        {executionResult && (
          <div className="flex items-center gap-3 text-xs font-semibold">
            <span
              className={`px-2.5 py-0.5 rounded-full flex items-center gap-1.5 ${
                executionResult.status === 'Accepted'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}
            >
              {executionResult.status === 'Accepted' ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <XCircle className="w-3.5 h-3.5" />
              )}
              {executionResult.status} ({executionResult.test_cases_passed}/{executionResult.total_test_cases})
            </span>
            <span className="text-gray-400 font-mono text-[11px]">
              {executionResult.runtime_ms} ms
            </span>
          </div>
        )}
      </div>

      {/* Tab Panel Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Post-Solve SM-2 Spaced Repetition Rating Card */}
        {executionResult?.status === 'Accepted' && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/40 via-[#1e222d] to-indigo-950/30 border border-purple-500/30 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
                <Brain className="w-4 h-4 text-purple-400" />
                Problem Solved! Rate recall difficulty for Spaced Repetition:
              </div>
              {ratedSuccess && (
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {ratedSuccess}
                </span>
              )}
            </div>

            {!ratedSuccess && (
              <div className="grid grid-cols-4 gap-2 mt-2">
                <button
                  onClick={() => handleRateSM2(0)}
                  className="py-1.5 px-2 rounded-lg bg-[#0d1117] hover:bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs font-semibold transition-colors"
                >
                  Again (+1d)
                </button>
                <button
                  onClick={() => handleRateSM2(3)}
                  className="py-1.5 px-2 rounded-lg bg-[#0d1117] hover:bg-amber-950/50 border border-amber-500/30 text-amber-300 text-xs font-semibold transition-colors"
                >
                  Hard (+3d)
                </button>
                <button
                  onClick={() => handleRateSM2(4)}
                  className="py-1.5 px-2 rounded-lg bg-[#0d1117] hover:bg-sky-950/50 border border-sky-500/30 text-sky-300 text-xs font-semibold transition-colors"
                >
                  Good (+6d)
                </button>
                <button
                  onClick={() => handleRateSM2(5)}
                  className="py-1.5 px-2 rounded-lg bg-[#0d1117] hover:bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition-colors"
                >
                  Easy (+12d)
                </button>
              </div>
            )}
          </div>
        )}

        {/* Active Test Case Details */}
        {sampleTestCases[activeTab] && (
          <div className="space-y-3">
            {/* Input View */}
            <div>
              <div className="text-xs font-semibold text-gray-400 mb-1">Input:</div>
              <pre className="p-2.5 rounded-lg bg-[#0d1117] border border-[#30363d] font-mono text-xs text-gray-200 overflow-x-auto">
                {JSON.stringify(sampleTestCases[activeTab].input, null, 2)}
              </pre>
            </div>

            {/* SQL Table Output or Standard Output */}
            {sampleTestCases[activeTab]?.expected_output?.columns ? (
              <SQLTableViewer
                tableData={results[activeTab]?.actual_output}
                expectedData={sampleTestCases[activeTab].expected_output}
                passed={results[activeTab]?.passed}
              />
            ) : (
              <>
                {/* Expected Output */}
                <div>
                  <div className="text-xs font-semibold text-gray-400 mb-1">Expected Output:</div>
                  <pre className="p-2.5 rounded-lg bg-[#0d1117] border border-[#30363d] font-mono text-xs text-emerald-400 overflow-x-auto">
                    {JSON.stringify(sampleTestCases[activeTab].expected_output, null, 2)}
                  </pre>
                </div>

                {/* Actual Output & Diff */}
                {results[activeTab] && (
                  <div>
                    <div className="text-xs font-semibold text-gray-400 mb-1">Actual Output:</div>
                    <pre className={`p-2.5 rounded-lg border font-mono text-xs overflow-x-auto ${
                      results[activeTab].passed
                        ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400'
                        : 'bg-rose-950/20 border-rose-500/30 text-rose-400'
                    }`}>
                      {results[activeTab].error
                        ? results[activeTab].error
                        : JSON.stringify(results[activeTab].actual_output, null, 2)}
                    </pre>
                  </div>
                )}
              </>
            )}

            {/* Stdout Logs */}
            {results[activeTab]?.stdout && (
              <div>
                <div className="text-xs font-semibold text-gray-400 mb-1 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-gray-400" />
                  Stdout Logs (print statements):
                </div>
                <pre className="p-2.5 rounded-lg bg-[#0d1117] border border-[#30363d] font-mono text-xs text-gray-300 overflow-x-auto">
                  {results[activeTab].stdout}
                </pre>
              </div>
            )}

            {/* Stderr Traceback */}
            {results[activeTab]?.traceback && (
              <div>
                <div className="text-xs font-semibold text-rose-400 mb-1">Error Traceback:</div>
                <pre className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-500/30 font-mono text-xs text-rose-300 overflow-x-auto">
                  {results[activeTab].traceback}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

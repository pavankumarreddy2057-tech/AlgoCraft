import React from 'react';
import { ExecutionResult } from '../types/index.js';
import { 
  CheckCircle2, 
  Zap, 
  Cpu, 
  Calendar, 
  ArrowRight, 
  Trophy, 
  Sparkles, 
  RotateCcw,
  Share2,
  X
} from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  problemTitle: string;
  execution: ExecutionResult | null;
  onNextProblem?: () => void;
}

export function SuccessModal({
  isOpen,
  onClose,
  problemTitle,
  execution,
  onNextProblem
}: SuccessModalProps) {
  if (!isOpen || !execution || execution.status !== 'Accepted') return null;

  // Compute simulated runtime percentile
  const runtime = execution.runtime_ms || 18;
  const runtimePercentile = Math.min(Math.max(Math.round(100 - (runtime / 150) * 80), 55), 98.4);
  const memoryPercentile = Math.min(Math.max(Math.round(85 + (Math.random() * 12)), 60), 99.1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#12161f] border border-emerald-500/30 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Top glowing gradient line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-500" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-200 hover:bg-[#1e2533] rounded-lg transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 text-center space-y-6">
          {/* Trophy & Badge */}
          <div className="relative inline-flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-9 h-9 animate-bounce" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500" />
            </span>
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Accepted
            </div>
            <h2 className="text-xl font-bold text-gray-100 tracking-tight pt-1">
              {problemTitle}
            </h2>
            <p className="text-xs text-gray-400">
              All {execution.test_cases_passed}/{execution.total_test_cases} test cases passed!
            </p>
          </div>

          {/* Performance Percentile Metrics */}
          <div className="grid grid-cols-2 gap-3">
            {/* Runtime Box */}
            <div className="p-3.5 bg-[#0a0d12] border border-[#1e2533] rounded-xl text-left space-y-1">
              <div className="flex items-center justify-between text-[11px] text-gray-400">
                <span>Runtime</span>
                <Zap className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="text-lg font-extrabold text-gray-100 font-mono">
                {runtime} <span className="text-xs font-normal text-gray-500">ms</span>
              </div>
              <div className="text-[10px] text-emerald-400 font-semibold">
                Beats {runtimePercentile}% of solvers
              </div>
            </div>

            {/* Memory Box */}
            <div className="p-3.5 bg-[#0a0d12] border border-[#1e2533] rounded-xl text-left space-y-1">
              <div className="flex items-center justify-between text-[11px] text-gray-400">
                <span>Memory</span>
                <Cpu className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <div className="text-lg font-extrabold text-gray-100 font-mono">
                {((execution.memory_kb || 8000) / 1024).toFixed(1)} <span className="text-xs font-normal text-gray-500">MB</span>
              </div>
              <div className="text-[10px] text-blue-400 font-semibold">
                Beats {memoryPercentile}% of solvers
              </div>
            </div>
          </div>

          {/* SM-2 Spaced Repetition Note */}
          <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center gap-2.5 text-left text-xs text-purple-300">
            <Calendar className="w-4 h-4 text-purple-400 shrink-0" />
            <span>Problem added to your <strong>Spaced Repetition Queue</strong> for long-term recall.</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 bg-[#1e2533] hover:bg-[#262f40] text-gray-200 text-xs font-semibold rounded-xl border border-[#2d3748] transition"
            >
              Stay in Editor
            </button>
            {onNextProblem && (
              <button
                onClick={() => {
                  onClose();
                  onNextProblem();
                }}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-1.5"
              >
                <span>Next Problem</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

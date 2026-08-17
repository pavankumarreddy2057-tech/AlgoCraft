import React, { useState } from 'react';
import { Activity, X, Loader2, Play, Sparkles, TrendingUp } from 'lucide-react';

interface BigOBenchmarkModalProps {
  slug: string;
  code: string;
  language: string;
  isOpen: boolean;
  onClose: () => void;
}

export const BigOBenchmarkModal: React.FC<BigOBenchmarkModalProps> = ({
  slug,
  code,
  language,
  isOpen,
  onClose
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [benchmarkData, setBenchmarkData] = useState<{
    points: Array<{ n: number; runtimeMs: number }>;
    estimatedComplexity: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleRunBenchmark = async () => {
    try {
      setLoading(true);
      setBenchmarkData(null);
      const res = await fetch(`/api/benchmark/${slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language })
      });
      const data = await res.json();
      if (data.success) {
        setBenchmarkData(data.data);
      }
    } catch (e: any) {
      alert(`Benchmark error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const points = benchmarkData?.points || [];
  const maxRuntime = Math.max(...points.map(p => p.runtimeMs), 1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl bg-[#161b22] border border-[#30363d] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#30363d] bg-[#1e222d]">
          <div className="flex items-center gap-2.5">
            <Activity className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">Empirical Big-O Benchmarker</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          <p className="text-xs text-gray-300 leading-relaxed">
            Tests your algorithm against progressively scaled input sizes $N \in [10, 3000]$ and plots the empirical runtime curve to verify asymptotic complexity.
          </p>

          <button
            onClick={handleRunBenchmark}
            disabled={loading || !code.trim()}
            className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-colors"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
            Run Profiler on Current Code
          </button>

          {benchmarkData && (
            <div className="space-y-4 pt-2">
              {/* Verdict Badge */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/30 to-emerald-950/20 border border-amber-500/30 flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-400">Estimated Asymptotic Complexity:</div>
                  <div className="text-lg font-black text-amber-400">{benchmarkData.estimatedComplexity}</div>
                </div>
                <TrendingUp className="w-6 h-6 text-amber-400" />
              </div>

              {/* Bar / Point Chart */}
              <div className="p-4 rounded-xl bg-[#0d1117] border border-[#30363d] space-y-2">
                <div className="text-xs font-semibold text-gray-400 mb-3">Input Size (N) vs Execution Time:</div>
                <div className="space-y-2">
                  {points.map(pt => {
                    const barWidth = Math.max(5, Math.min(100, (pt.runtimeMs / maxRuntime) * 100));
                    return (
                      <div key={pt.n} className="flex items-center gap-3 text-xs font-mono">
                        <span className="w-14 text-gray-400 text-right">N={pt.n}</span>
                        <div className="flex-1 bg-[#21262d] h-4 rounded overflow-hidden flex items-center">
                          <div
                            className="bg-amber-500 h-full rounded transition-all"
                            style={{ width: `${barWidth}%` }}
                          />
                        </div>
                        <span className="w-20 text-gray-300">{pt.runtimeMs} ms</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

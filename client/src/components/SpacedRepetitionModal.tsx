import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Clock, 
  RotateCcw, 
  Flame, 
  CheckCircle2, 
  ArrowRight, 
  Calendar, 
  Bookmark, 
  Sparkles, 
  ExternalLink,
  Layers,
  Zap,
  Star,
  Compass
} from 'lucide-react';
import { ReviewQueueItem } from '../types/index.js';
import { fetchReviewQueue, recordReviewGrade, toggleReviewFlag } from '../lib/api.js';

interface SpacedRepetitionModalProps {
  onOpenProblem: (slug: string) => void;
}

export const SpacedRepetitionModal: React.FC<SpacedRepetitionModalProps> = ({
  onOpenProblem
}) => {
  const [queue, setQueue] = useState<ReviewQueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const loadQueue = async () => {
    try {
      setLoading(true);
      const res = await fetchReviewQueue();
      setQueue(res.queue);
    } catch (err: any) {
      console.error('Failed to load review queue:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQueue();
  }, []);

  const handleGrade = async (slug: string, grade: number) => {
    try {
      const res = await recordReviewGrade(slug, grade);
      setActionSuccess(`Recorded! Next review scheduled in ${res.updated.interval} day(s).`);
      setTimeout(() => setActionSuccess(null), 3000);
      
      // Advance or refresh queue
      if (currentIndex >= queue.length - 1) {
        loadQueue();
        setCurrentIndex(0);
      } else {
        setCurrentIndex(prev => prev + 1);
      }
    } catch (err: any) {
      alert(`Error recording review: ${err.message}`);
    }
  };

  const currentItem = queue[currentIndex];

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-purple-950/60 via-[#12161f] to-indigo-950/40 border border-purple-500/25 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              Spaced Repetition Review
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30">
                SM-2 Engine
              </span>
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              SuperMemo-2 calculates optimal recall intervals so you retain algorithmic patterns long-term without cramming.
            </p>
          </div>
        </div>

        <div className="text-left sm:text-right shrink-0 bg-[#0a0d12] px-4 py-2 rounded-xl border border-[#262d3d]">
          <div className="text-2xl font-black text-purple-400 font-mono">{queue.length}</div>
          <div className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Due Today</div>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4" />
          {actionSuccess}
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center text-xs text-gray-400 space-y-2">
          <div className="w-7 h-7 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <span>Loading daily review queue...</span>
        </div>
      ) : queue.length === 0 ? (
        /* Empty State with CTA and Forecast */
        <div className="space-y-6">
          <div className="text-center bg-[#12161f] border border-[#262d3d] rounded-2xl p-8 sm:p-12 space-y-4 shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
              <Sparkles className="w-8 h-8" />
            </div>
            
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white">All Caught Up for Today!</h2>
              <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
                You have completed all pending reviews. Star problems in the problem library or solve new ones to schedule them into your SM-2 retention queue.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onOpenProblem('two-sum')}
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-purple-600/20 inline-flex items-center gap-2"
              >
                <Bookmark className="w-4 h-4 text-amber-400" />
                <span>Browse Problem Library & Star Topics</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Spaced Repetition Retention Forecast */}
          <div className="bg-[#12161f] border border-[#262d3d] rounded-2xl p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-400" />
              <span>SM-2 Memory Forecast & Retention Timeline</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-4 rounded-xl bg-[#0a0d12] border border-[#262d3d] space-y-1.5">
                <div className="text-gray-400 font-semibold flex items-center justify-between">
                  <span>Day 1 Review</span>
                  <Zap className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="text-lg font-bold text-white font-mono">Immediate Recall</div>
                <p className="text-[11px] text-gray-500">Locks the problem intuition and constraints into short-term memory.</p>
              </div>

              <div className="p-4 rounded-xl bg-[#0a0d12] border border-[#262d3d] space-y-1.5">
                <div className="text-gray-400 font-semibold flex items-center justify-between">
                  <span>Day 6 Interval</span>
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <div className="text-lg font-bold text-white font-mono">Pattern Recognition</div>
                <p className="text-[11px] text-gray-500">Reinforces data structure selection (e.g. Hash Map vs Two Pointers).</p>
              </div>

              <div className="p-4 rounded-xl bg-[#0a0d12] border border-[#262d3d] space-y-1.5">
                <div className="text-gray-400 font-semibold flex items-center justify-between">
                  <span>Day 16+ Interval</span>
                  <Flame className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <div className="text-lg font-bold text-white font-mono">Permanent Fluency</div>
                <p className="text-[11px] text-gray-500">Allows instant coding during live high-pressure technical interviews.</p>
              </div>
            </div>
          </div>
        </div>
      ) : currentItem ? (
        /* Active Review Card */
        <div className="bg-[#12161f] border border-[#262d3d] rounded-2xl p-6 shadow-xl flex flex-col gap-6">
          {/* Card Header & Progress */}
          <div className="flex items-center justify-between border-b border-[#262d3d] pb-4">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="font-semibold text-white">Card {currentIndex + 1}</span> of {queue.length}
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  currentItem.difficulty === 'Easy'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : currentItem.difficulty === 'Medium'
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                }`}
              >
                {currentItem.difficulty}
              </span>
            </div>
          </div>

          {/* Problem Overview */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">{currentItem.title}</h2>
              <div className="flex flex-wrap items-center gap-1.5">
                {currentItem.tags.map(tag => (
                  <span key={tag} className="text-xs px-2.5 py-0.5 rounded-lg bg-[#0a0d12] text-gray-300 border border-[#262d3d]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => onOpenProblem(currentItem.slug)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-colors shrink-0"
            >
              <span>Solve in Code Editor</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* SM-2 Current Metrics */}
          <div className="grid grid-cols-3 gap-3 bg-[#0a0d12] p-4 rounded-xl border border-[#262d3d]">
            <div>
              <div className="text-[11px] text-gray-400 mb-1">Current Interval</div>
              <div className="text-base font-bold text-white flex items-center gap-1.5 font-mono">
                <Clock className="w-4 h-4 text-sky-400" />
                {currentItem.interval_days} Day(s)
              </div>
            </div>

            <div>
              <div className="text-[11px] text-gray-400 mb-1">Repetitions</div>
              <div className="text-base font-bold text-white flex items-center gap-1.5 font-mono">
                <RotateCcw className="w-4 h-4 text-purple-400" />
                {currentItem.repetition_count} Times
              </div>
            </div>

            <div>
              <div className="text-[11px] text-gray-400 mb-1">Ease Factor</div>
              <div className="text-base font-bold text-white flex items-center gap-1.5 font-mono">
                <Flame className="w-4 h-4 text-amber-400" />
                {currentItem.ease_factor}x
              </div>
            </div>
          </div>

          {/* Grade Confidence Scoring */}
          <div>
            <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-3">
              Rate your recall difficulty for this problem:
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => handleGrade(currentItem.slug, 0)}
                className="p-3.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 hover:text-white transition-all text-center group active:scale-95"
              >
                <div className="font-bold text-xs">Again</div>
                <div className="text-[10px] text-gray-400 mt-1">Forgot concept (1d)</div>
              </button>

              <button
                onClick={() => handleGrade(currentItem.slug, 3)}
                className="p-3.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:text-white transition-all text-center group active:scale-95"
              >
                <div className="font-bold text-xs">Hard</div>
                <div className="text-[10px] text-gray-400 mt-1">Struggled a bit (~3-4d)</div>
              </button>

              <button
                onClick={() => handleGrade(currentItem.slug, 4)}
                className="p-3.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-300 hover:text-white transition-all text-center group active:scale-95"
              >
                <div className="font-bold text-xs">Good</div>
                <div className="text-[10px] text-gray-400 mt-1">Recalled solution (~6-8d)</div>
              </button>

              <button
                onClick={() => handleGrade(currentItem.slug, 5)}
                className="p-3.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 hover:text-white transition-all text-center group active:scale-95"
              >
                <div className="font-bold text-xs">Easy</div>
                <div className="text-[10px] text-gray-400 mt-1">Instant mastery (~14-20d)</div>
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

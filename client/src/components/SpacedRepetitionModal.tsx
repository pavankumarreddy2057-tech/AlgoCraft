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
  ExternalLink
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
    <div className="flex-1 overflow-y-auto p-6 max-w-5xl mx-auto w-full">
      {/* Header Banner */}
      <div className="flex items-center justify-between mb-8 p-6 rounded-2xl bg-gradient-to-r from-purple-900/30 via-[#1e222d] to-indigo-900/20 border border-purple-500/20 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              Spaced Repetition Review Queue
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30">
                SM-2 Engine
              </span>
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              SuperMemo-2 automatically optimizes recall intervals so you retain algorithmic patterns long-term without cramming.
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-2xl font-black text-purple-400">{queue.length}</div>
          <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Due Today</div>
        </div>
      </div>

      {actionSuccess && (
        <div className="mb-6 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4" />
          {actionSuccess}
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center text-gray-400">Loading daily review queue...</div>
      ) : queue.length === 0 ? (
        <div className="py-20 text-center bg-[#161b22] border border-[#30363d] rounded-2xl p-8">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-4">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-white mb-2">All Caught Up for Today!</h2>
          <p className="text-sm text-gray-400 max-w-md mx-auto mb-6">
            You have no problems due for spaced repetition right now. Solve new problems or manually flag tricky ones for review.
          </p>
        </div>
      ) : currentItem ? (
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 shadow-xl flex flex-col gap-6">
          {/* Card Header & Progress */}
          <div className="flex items-center justify-between border-b border-[#30363d] pb-4">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="font-semibold text-white">Card {currentIndex + 1}</span> of {queue.length}
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                  currentItem.difficulty === 'Easy'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : currentItem.difficulty === 'Medium'
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}
              >
                {currentItem.difficulty}
              </span>
            </div>
          </div>

          {/* Problem Overview */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">{currentItem.title}</h2>
              <div className="flex flex-wrap items-center gap-2">
                {currentItem.tags.map(tag => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded bg-[#21262d] text-gray-300 border border-[#30363d]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => onOpenProblem(currentItem.slug)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-semibold flex items-center gap-2 shadow-md transition-colors shrink-0"
            >
              Open in Code IDE
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>

          {/* SM-2 Current Metrics */}
          <div className="grid grid-cols-3 gap-4 bg-[#0d1117] p-4 rounded-xl border border-[#30363d]">
            <div>
              <div className="text-xs text-gray-400 mb-1">Current Interval</div>
              <div className="text-base font-bold text-white flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-sky-400" />
                {currentItem.interval_days} Day(s)
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-400 mb-1">Repetitions</div>
              <div className="text-base font-bold text-white flex items-center gap-1.5">
                <RotateCcw className="w-4 h-4 text-purple-400" />
                {currentItem.repetition_count} Times
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-400 mb-1">Ease Factor</div>
              <div className="text-base font-bold text-white flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-400" />
                {currentItem.ease_factor}x
              </div>
            </div>
          </div>

          {/* Grade Confidence Scoring */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-3">Rate your recall difficulty for this problem:</h3>
            <div className="grid grid-cols-4 gap-3">
              <button
                onClick={() => handleGrade(currentItem.slug, 0)}
                className="p-3.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 hover:text-white transition-all text-center group"
              >
                <div className="font-bold text-sm">Again</div>
                <div className="text-[11px] text-gray-400 mt-1">Forgot concept (1d)</div>
              </button>

              <button
                onClick={() => handleGrade(currentItem.slug, 3)}
                className="p-3.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:text-white transition-all text-center group"
              >
                <div className="font-bold text-sm">Hard</div>
                <div className="text-[11px] text-gray-400 mt-1">Struggled a bit (~3-4d)</div>
              </button>

              <button
                onClick={() => handleGrade(currentItem.slug, 4)}
                className="p-3.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-300 hover:text-white transition-all text-center group"
              >
                <div className="font-bold text-sm">Good</div>
                <div className="text-[11px] text-gray-400 mt-1">Normal recall (~6-8d)</div>
              </button>

              <button
                onClick={() => handleGrade(currentItem.slug, 5)}
                className="p-3.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 hover:text-white transition-all text-center group"
              >
                <div className="font-bold text-sm">Easy</div>
                <div className="text-[11px] text-gray-400 mt-1">Instant mastery (~12-15d)</div>
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

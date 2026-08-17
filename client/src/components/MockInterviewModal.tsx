import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Timer, 
  X, 
  ChevronRight, 
  Award, 
  CheckCircle2, 
  XCircle, 
  Play, 
  ExternalLink,
  Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface MockInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenProblem: (slug: string) => void;
}

export const MockInterviewModal: React.FC<MockInterviewModalProps> = ({
  isOpen,
  onClose,
  onOpenProblem
}) => {
  const [stage, setStage] = useState<'intro' | 'in_progress' | 'completed'>('intro');
  const [session, setSession] = useState<any | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(45 * 60);
  const [scorecard, setScorecard] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let timer: any = null;
    if (stage === 'in_progress' && secondsRemaining > 0) {
      timer = setInterval(() => {
        setSecondsRemaining(prev => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [stage, secondsRemaining]);

  if (!isOpen) return null;

  const handleStartInterview = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/interview/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ difficulty: 'Mixed' })
      });
      const data = await res.json();
      if (data.success) {
        setSession(data.session);
        setSecondsRemaining(45 * 60);
        setStage('in_progress');
      }
    } catch (e: any) {
      alert(`Failed to start interview: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFinishInterview = async () => {
    const timeSpent = (45 * 60) - secondsRemaining;
    try {
      setLoading(true);
      // Fetch latest submission status for both problems
      const results = [];
      for (const p of session?.problems || []) {
        const probRes = await fetch(`/api/problems/${p.slug}`).then(r => r.json());
        const isSolved = probRes?.latest_submission?.status === 'Accepted';
        results.push({
          slug: p.slug,
          solved: isSolved
        });
      }

      const evalRes = await fetch('/api/interview/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timeSpentSeconds: timeSpent, results })
      });
      const data = await evalRes.json();
      if (data.success) {
        setScorecard(data.scorecard);
        setStage('completed');
        if (data.scorecard.overallScore >= 70) {
          confetti({ particleCount: 100, spread: 80 });
        }
      }
    } catch (e: any) {
      alert(`Evaluation error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-3xl bg-[#161b22] border border-[#30363d] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#30363d] bg-[#1e222d]">
          <div className="flex items-center gap-2.5">
            <Briefcase className="w-5 h-5 text-purple-400" />
            <h2 className="text-base font-bold text-white">45-Minute Mock Interview Simulator</h2>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {stage === 'intro' && (
            <div className="space-y-6 text-center py-6">
              <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mx-auto">
                <Briefcase className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Simulate a Real Technical Coding Interview</h3>
                <p className="text-sm text-gray-400 max-w-lg mx-auto leading-relaxed">
                  You will be presented with 2 randomized coding problems (1 Medium + 1 Hard) under a strict 45-minute countdown timer. Test your time management, pattern recognition, and code correctness under realistic pressure.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto text-left text-xs bg-[#0d1117] p-4 rounded-xl border border-[#30363d]">
                <div>
                  <div className="text-gray-500 font-semibold uppercase">Duration</div>
                  <div className="text-white font-bold text-sm mt-0.5">45 Minutes</div>
                </div>
                <div>
                  <div className="text-gray-500 font-semibold uppercase">Problems</div>
                  <div className="text-white font-bold text-sm mt-0.5">2 Questions</div>
                </div>
                <div>
                  <div className="text-gray-500 font-semibold uppercase">Feedback</div>
                  <div className="text-purple-400 font-bold text-sm mt-0.5">Scorecard</div>
                </div>
              </div>

              <button
                onClick={handleStartInterview}
                disabled={loading}
                className="px-8 py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl font-bold text-sm shadow-xl transition-all flex items-center gap-2 mx-auto"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
                Start Timed Interview
              </button>
            </div>
          )}

          {stage === 'in_progress' && session && (
            <div className="space-y-6">
              {/* Countdown Bar */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-[#0d1117] border border-[#30363d]">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Briefcase className="w-4 h-4 text-purple-400" />
                  Interview in Progress
                </div>
                <div className={`flex items-center gap-2 text-lg font-mono font-bold ${
                  secondsRemaining < 300 ? 'text-rose-400 animate-pulse' : 'text-purple-400'
                }`}>
                  <Timer className="w-5 h-5" />
                  {formatTime(secondsRemaining)}
                </div>
              </div>

              {/* Problems List to Solve */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider">Interview Problems</h4>
                {session.problems.map((prob: any, idx: number) => (
                  <div
                    key={prob.slug}
                    className="p-4 rounded-xl bg-[#0d1117] border border-[#30363d] flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-purple-400">Problem {idx + 1}:</span>
                        <span className="text-sm font-bold text-white">{prob.title}</span>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.2 rounded ${
                        prob.difficulty === 'Easy'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : prob.difficulty === 'Medium'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {prob.difficulty}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        onClose();
                        onOpenProblem(prob.slug);
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors"
                    >
                      Solve in Editor
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Finish Button */}
              <button
                onClick={handleFinishInterview}
                disabled={loading}
                className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-colors"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Award className="w-4 h-4" />}
                Submit & Grade Interview Session
              </button>
            </div>
          )}

          {stage === 'completed' && scorecard && (
            <div className="space-y-6 py-4">
              <div className="text-center space-y-2">
                <div className="text-3xl font-black text-white">{scorecard.overallScore}/100</div>
                <div className={`text-sm font-bold uppercase tracking-wider ${
                  scorecard.verdict === 'Strong Hire' ? 'text-emerald-400' :
                  scorecard.verdict === 'Hire' ? 'text-sky-400' :
                  scorecard.verdict === 'Leaning Hire' ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  Verdict: {scorecard.verdict}
                </div>
                <p className="text-xs text-gray-400 max-w-md mx-auto">{scorecard.summary}</p>
              </div>

              <div className="grid grid-cols-3 gap-3 bg-[#0d1117] p-4 rounded-xl border border-[#30363d] text-center text-xs">
                <div>
                  <div className="text-gray-400">Solved</div>
                  <div className="text-base font-bold text-white mt-0.5">{scorecard.solvedCount} / {scorecard.totalProblems}</div>
                </div>
                <div>
                  <div className="text-gray-400">Speed Score</div>
                  <div className="text-base font-bold text-amber-400 mt-0.5">{scorecard.speedScore}%</div>
                </div>
                <div>
                  <div className="text-gray-400">Time Taken</div>
                  <div className="text-base font-bold text-sky-400 mt-0.5">{scorecard.timeSpentFormatted}</div>
                </div>
              </div>

              <button
                onClick={() => setStage('intro')}
                className="w-full py-2.5 bg-[#21262d] hover:bg-[#30363d] text-white rounded-xl text-xs font-bold transition-colors"
              >
                Start Another Session
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

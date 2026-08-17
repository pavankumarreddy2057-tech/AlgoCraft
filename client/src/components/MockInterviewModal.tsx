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
  Pause,
  ExternalLink,
  Loader2,
  AlertTriangle,
  Flame,
  Zap,
  RotateCcw,
  Flag
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
  const [difficultyMode, setDifficultyMode] = useState<string>('Standard');
  const [session, setSession] = useState<any | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(45 * 60);
  const [isTimerPaused, setIsTimerPaused] = useState<boolean>(false);
  const [problemStatuses, setProblemStatuses] = useState<Record<string, 'Solved' | 'Attempted' | 'Todo'>>({});
  const [scorecard, setScorecard] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);

  // Timer countdown
  useEffect(() => {
    let timer: any = null;
    if (stage === 'in_progress' && !isTimerPaused && secondsRemaining > 0) {
      timer = setInterval(() => {
        setSecondsRemaining(prev => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [stage, isTimerPaused, secondsRemaining]);

  // Periodic poll of problem solve status during interview
  useEffect(() => {
    if (stage !== 'in_progress' || !session) return;

    const checkStatuses = async () => {
      const updated: Record<string, 'Solved' | 'Attempted' | 'Todo'> = {};
      for (const p of session.problems || []) {
        try {
          const res = await fetch(`/api/problems/${p.slug}`).then(r => r.json());
          if (res?.stats?.is_solved || res?.latest_submission?.status === 'Accepted') {
            updated[p.slug] = 'Solved';
          } else if (res?.stats?.total_submissions > 0) {
            updated[p.slug] = 'Attempted';
          } else {
            updated[p.slug] = 'Todo';
          }
        } catch (e) {}
      }
      setProblemStatuses(updated);
    };

    checkStatuses();
    const interval = setInterval(checkStatuses, 5000);
    return () => clearInterval(interval);
  }, [stage, session]);

  if (!isOpen) return null;

  const handleStartInterview = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/interview/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ difficulty: difficultyMode })
      });
      const data = await res.json();
      if (data.success) {
        setSession(data.session);
        setSecondsRemaining(45 * 60);
        setIsTimerPaused(false);
        setStage('in_progress');
        setShowExitConfirm(false);
      }
    } catch (e: any) {
      alert(`Failed to start interview: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFinishInterview = async (earlyExit: boolean = false) => {
    const timeSpent = (45 * 60) - secondsRemaining;
    try {
      setLoading(true);
      const results = [];
      for (const p of session?.problems || []) {
        const isSolved = problemStatuses[p.slug] === 'Solved';
        results.push({
          slug: p.slug,
          solved: isSolved
        });
      }

      const evalRes = await fetch('/api/interview/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timeSpentSeconds: timeSpent, results, earlyExit })
      });
      const data = await evalRes.json();
      if (data.success) {
        setScorecard(data.scorecard);
        setStage('completed');
        setShowExitConfirm(false);
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

  const solvedCount = Object.values(problemStatuses).filter(s => s === 'Solved').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-3xl bg-[#12161f] border border-[#262d3d] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#262d3d] bg-[#161b22]">
          <div className="flex items-center gap-2.5">
            <Briefcase className="w-5 h-5 text-purple-400" />
            <h2 className="text-base font-bold text-white">45-Minute Technical Mock Interview</h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 text-gray-400 hover:text-white hover:bg-[#1a202c] rounded-lg transition"
            aria-label="Close interview modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* 1. Intro Stage */}
          {stage === 'intro' && (
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mx-auto">
                <Briefcase className="w-8 h-8" />
              </div>
              
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white">Simulate a Real Technical Coding Interview</h3>
                <p className="text-xs text-gray-400 max-w-lg mx-auto leading-relaxed">
                  Solve 2 algorithmic questions under a timed 45-minute countdown. Test your speed, accuracy, and problem-solving composure under realistic pressure.
                </p>
              </div>

              {/* Difficulty Mode Selector */}
              <div className="space-y-2 max-w-lg mx-auto text-left">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Select Difficulty Configuration:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'Standard', label: 'Standard', desc: '1 Med + 1 Hard' },
                    { id: 'Sprint', label: 'Sprint', desc: '2 Medium' },
                    { id: 'Championship', label: 'Championship', desc: '2 Hard' },
                    { id: 'Warmup', label: 'Warmup', desc: '1 Easy + 1 Med' }
                  ].map(mode => (
                    <button
                      key={mode.id}
                      onClick={() => setDifficultyMode(mode.id)}
                      className={`p-3 rounded-xl border text-left transition ${
                        difficultyMode === mode.id
                          ? 'bg-purple-600/20 border-purple-500 text-white shadow-sm'
                          : 'bg-[#0a0d12] border-[#262d3d] text-gray-400 hover:text-gray-200 hover:border-gray-500'
                      }`}
                    >
                      <div className="text-xs font-bold text-gray-100">{mode.label}</div>
                      <div className="text-[10px] text-purple-300 font-mono mt-0.5">{mode.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto text-left text-xs bg-[#0a0d12] p-4 rounded-xl border border-[#262d3d]">
                <div>
                  <div className="text-gray-500 font-semibold uppercase text-[10px]">Time Limit</div>
                  <div className="text-white font-bold text-sm mt-0.5">45 Minutes</div>
                </div>
                <div>
                  <div className="text-gray-500 font-semibold uppercase text-[10px]">Format</div>
                  <div className="text-white font-bold text-sm mt-0.5">
                    {difficultyMode === 'Standard' ? '1 Med + 1 Hard' :
                     difficultyMode === 'Sprint' ? '2 Medium' :
                     difficultyMode === 'Championship' ? '2 Hard' : '1 Easy + 1 Med'}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 font-semibold uppercase text-[10px]">Evaluation</div>
                  <div className="text-purple-400 font-bold text-sm mt-0.5">Automated Score</div>
                </div>
              </div>

              <button
                onClick={handleStartInterview}
                disabled={loading}
                className="px-8 py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl font-bold text-xs shadow-xl shadow-purple-600/20 transition-all flex items-center gap-2 mx-auto"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
                <span>Start Timed Interview Session</span>
              </button>
            </div>
          )}

          {/* 2. In Progress Stage */}
          {stage === 'in_progress' && session && (
            <div className="space-y-6">
              
              {/* Countdown & Live Controls Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#0a0d12] border border-[#262d3d]">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
                  <div className="text-xs text-gray-300 font-semibold">
                    Live Technical Session ({session.difficultyMode})
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Timer */}
                  <div className={`flex items-center gap-2 text-lg font-mono font-bold px-3 py-1 rounded-xl bg-[#12161f] border border-[#262d3d] ${
                    secondsRemaining < 300 ? 'text-rose-400 animate-pulse' : 'text-purple-400'
                  }`}>
                    <Timer className="w-4 h-4" />
                    <span>{formatTime(secondsRemaining)}</span>
                  </div>

                  {/* Pause / Resume Button */}
                  <button
                    onClick={() => setIsTimerPaused(!isTimerPaused)}
                    className="p-2 rounded-xl bg-[#1a202c] hover:bg-[#262d3d] text-gray-300 hover:text-white border border-[#262d3d] transition"
                    title={isTimerPaused ? "Resume Interview Timer" : "Pause Interview Timer"}
                  >
                    {isTimerPaused ? <Play className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" /> : <Pause className="w-3.5 h-3.5 text-amber-400" />}
                  </button>

                  {/* End Early Trigger */}
                  <button
                    onClick={() => setShowExitConfirm(true)}
                    className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-semibold transition"
                  >
                    End Early
                  </button>
                </div>
              </div>

              {/* Early Exit Confirmation Banner */}
              {showExitConfirm && (
                <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 flex items-center justify-between gap-3 text-xs text-rose-200">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>End interview session now? Completed submissions will be scored.</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setShowExitConfirm(false)}
                      className="px-2.5 py-1 bg-[#1a202c] text-gray-300 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleFinishInterview(true)}
                      className="px-2.5 py-1 bg-rose-600 text-white font-bold rounded-lg"
                    >
                      Confirm Exit
                    </button>
                  </div>
                </div>
              )}

              {/* Progress Summary Tracker */}
              <div className="flex items-center justify-between px-2 text-xs">
                <span className="font-bold text-gray-300">
                  Problems Progress ({solvedCount}/{session.problems.length} Solved)
                </span>
                <span className="text-gray-500 text-[11px]">
                  Submit accepted code in IDE to pass problem
                </span>
              </div>

              {/* Problem Cards to Solve */}
              <div className="space-y-3">
                {session.problems.map((prob: any, idx: number) => {
                  const status = problemStatuses[prob.slug] || 'Todo';
                  return (
                    <div
                      key={prob.slug}
                      className="p-4 rounded-2xl bg-[#0a0d12] border border-[#262d3d] flex items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3">
                        {/* Status Icon */}
                        <div className="mt-1">
                          {status === 'Solved' ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/10" />
                          ) : status === 'Attempted' ? (
                            <div className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500 flex items-center justify-center text-amber-400">
                              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full border border-gray-600 flex items-center justify-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-gray-600" />
                            </div>
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-purple-400">Problem {idx + 1}:</span>
                            <span className="text-sm font-bold text-white">{prob.title}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              prob.difficulty === 'Easy'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                : prob.difficulty === 'Medium'
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                            }`}>
                              {prob.difficulty}
                            </span>
                            
                            <span className="text-[11px] text-gray-500">
                              Status: <strong className={status === 'Solved' ? 'text-emerald-400' : status === 'Attempted' ? 'text-amber-400' : 'text-gray-400'}>{status}</strong>
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          onClose();
                          onOpenProblem(prob.slug);
                        }}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors shrink-0"
                      >
                        <span>Solve in IDE</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Submit Final Button */}
              <button
                onClick={() => handleFinishInterview(false)}
                disabled={loading}
                className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 transition-colors"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Award className="w-4 h-4" />}
                <span>Submit & Calculate Performance Scorecard</span>
              </button>
            </div>
          )}

          {/* 3. Completed Scorecard Stage */}
          {stage === 'completed' && scorecard && (
            <div className="space-y-6 py-4">
              <div className="text-center space-y-2">
                <div className="text-4xl font-black text-white font-mono">{scorecard.overallScore}/100</div>
                <div className={`text-sm font-bold uppercase tracking-wider ${
                  scorecard.verdict === 'Strong Hire' ? 'text-emerald-400' :
                  scorecard.verdict === 'Hire' ? 'text-sky-400' :
                  scorecard.verdict === 'Leaning Hire' ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  Verdict: {scorecard.verdict}
                </div>
                <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">{scorecard.summary}</p>
              </div>

              <div className="grid grid-cols-3 gap-3 bg-[#0a0d12] p-4 rounded-xl border border-[#262d3d] text-center text-xs">
                <div>
                  <div className="text-gray-400">Solved</div>
                  <div className="text-base font-bold text-white mt-0.5 font-mono">{scorecard.solvedCount} / {scorecard.totalProblems}</div>
                </div>
                <div>
                  <div className="text-gray-400">Speed Score</div>
                  <div className="text-base font-bold text-amber-400 mt-0.5 font-mono">{scorecard.speedScore}%</div>
                </div>
                <div>
                  <div className="text-gray-400">Time Taken</div>
                  <div className="text-base font-bold text-sky-400 mt-0.5 font-mono">{scorecard.timeSpentFormatted}</div>
                </div>
              </div>

              <button
                onClick={() => setStage('intro')}
                className="w-full py-2.5 bg-[#1a202c] hover:bg-[#262d3d] text-white rounded-xl text-xs font-bold transition-colors"
              >
                <span>Start Another Session</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

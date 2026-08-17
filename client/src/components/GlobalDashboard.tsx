import React, { useState, useEffect } from 'react';
import { fetchLeaderboard } from '../lib/api.js';
import { LeaderboardData } from '../types/index.js';
import {
  Trophy,
  Flame,
  Globe,
  Radio,
  BarChart3,
  Medal,
  Crown,
  Sparkles,
  RefreshCw,
  Code2,
  CheckCircle2,
  AlertTriangle,
  Target,
  ArrowRight,
  ShieldAlert,
  Zap,
  Award
} from 'lucide-react';

interface GlobalDashboardProps {
  onOpenProblem: (slug: string) => void;
}

export function GlobalDashboard({ onOpenProblem }: GlobalDashboardProps) {
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'pulse' | 'analytics'>('leaderboard');

  const loadData = async () => {
    try {
      setIsLoading(true);
      const res = await fetchLeaderboard();
      setData(res);
    } catch (e) {
      console.error('Failed to load leaderboard:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#0a0d12]">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <RefreshCw className="w-8 h-8 animate-spin text-amber-500" />
          <span className="text-sm font-medium">Loading global rankings...</span>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { rankings, pulse, champions, stats } = data;

  // Filter solvers with positive solved count
  const activeSolvers = rankings.filter(u => u.solved_count > 0);
  const isLowActivity = activeSolvers.length < 2;

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-amber-400 text-gray-950 font-extrabold text-xs shadow-md shadow-amber-400/20">
          <Crown className="w-4 h-4 fill-current" />
        </span>
      );
    }
    if (rank === 2) {
      return (
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-slate-300 text-gray-950 font-extrabold text-xs shadow-md">
          <Medal className="w-4 h-4 fill-current" />
        </span>
      );
    }
    if (rank === 3) {
      return (
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-amber-700 text-amber-100 font-extrabold text-xs shadow-md">
          <Medal className="w-4 h-4 fill-current" />
        </span>
      );
    }
    return (
      <span className="font-mono font-bold text-gray-400 text-xs">
        #{rank}
      </span>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#0a0d12] text-gray-100 p-4 md:p-8 space-y-6">
      
      {/* Header Banner */}
      <div className="relative bg-gradient-to-r from-[#1c1828] via-[#12161f] to-[#121d28] border border-[#262d3d] rounded-2xl p-6 md:p-8 shadow-xl overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-amber-400" />
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-100 tracking-tight">
                Global Arena & Leaderboard
              </h1>
            </div>
            <p className="text-xs md:text-sm text-gray-400">
              Live algorithmic rankings, verified solutions stream, and global category champions.
            </p>
          </div>

          {/* Tab buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-[#0a0d12] border border-[#262d3d] rounded-xl self-start md:self-auto">
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'leaderboard'
                  ? 'bg-amber-500 text-gray-950 shadow-sm'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Rankings</span>
            </button>
            <button
              onClick={() => setActiveTab('pulse')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'pulse'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              <span>Live Pulse</span>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'analytics'
                  ? 'bg-purple-500 text-white shadow-sm'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Platform Stats</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. Category Champions Podium & Leaderboard */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-6">
          
          {/* Low Activity / Season 1 Starter State */}
          {isLowActivity && (
            <div className="bg-gradient-to-br from-[#181d28] via-[#12161f] to-[#1a1828] border border-amber-500/30 rounded-2xl p-6 md:p-8 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                    <Crown className="w-6 h-6 animate-bounce" />
                  </div>
                  <div>
                    <h2 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
                      <span>Season 1 Arena Is Open</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Live Challenge
                      </span>
                    </h2>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Be the first to claim the #1 spot on the AlgoCraft Leaderboard! Solve questions to climb ranks.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onOpenProblem('two-sum')}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-gray-950 text-xs font-extrabold rounded-xl transition shadow-lg shadow-amber-500/20 flex items-center gap-2 shrink-0 self-end sm:self-auto active:scale-95"
                >
                  <span>Solve Problem & Rank Up</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Scoring System Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                <div className="p-3 bg-[#0a0d12] border border-[#262d3d] rounded-xl text-xs space-y-1">
                  <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Easy Solve</span>
                  </div>
                  <div className="text-gray-300 font-mono text-base font-bold">+10 pts</div>
                  <p className="text-[10px] text-gray-500">Core foundational syntax</p>
                </div>

                <div className="p-3 bg-[#0a0d12] border border-[#262d3d] rounded-xl text-xs space-y-1">
                  <div className="text-amber-400 font-bold flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Medium Solve</span>
                  </div>
                  <div className="text-gray-300 font-mono text-base font-bold">+25 pts</div>
                  <p className="text-[10px] text-gray-500">Standard interview patterns</p>
                </div>

                <div className="p-3 bg-[#0a0d12] border border-[#262d3d] rounded-xl text-xs space-y-1">
                  <div className="text-rose-400 font-bold flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Hard Solve</span>
                  </div>
                  <div className="text-gray-300 font-mono text-base font-bold">+50 pts</div>
                  <p className="text-[10px] text-gray-500">Advanced algorithmic proofs</p>
                </div>

                <div className="p-3 bg-[#0a0d12] border border-[#262d3d] rounded-xl text-xs space-y-1">
                  <div className="text-purple-400 font-bold flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5" />
                    <span>Accuracy Bonus</span>
                  </div>
                  <div className="text-gray-300 font-mono text-base font-bold">+10 pts</div>
                  <p className="text-[10px] text-gray-500">Passed on first attempt</p>
                </div>
              </div>
            </div>
          )}

          {/* Category Champions Podium */}
          {champions && Object.keys(champions).length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {Object.entries(champions).map(([category, champ]: [string, any], idx) => (
                <div
                  key={idx}
                  className="bg-[#12161f] border border-[#262d3d] rounded-2xl p-4 shadow-sm flex flex-col items-center text-center space-y-2 relative overflow-hidden"
                >
                  <div className="absolute top-2 right-2 text-amber-400/30">
                    <Crown className="w-4 h-4" />
                  </div>
                  <img
                    src={champ.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${champ.username}`}
                    alt={champ.username}
                    className="w-12 h-12 rounded-xl border border-amber-500/30 bg-[#0a0d12] object-cover"
                  />
                  <div className="space-y-0.5 w-full">
                    <div className="text-xs font-bold text-gray-200 truncate">{champ.username}</div>
                    <div className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider">{category}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    {champ.solved_in_category} solved
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Leaderboard Table */}
          <div className="bg-[#12161f] border border-[#262d3d] rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-gray-200 uppercase tracking-wider flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Current Solvers Standings</span>
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#1e2533] text-gray-500 font-semibold">
                    <th className="pb-3 w-12 text-center">Rank</th>
                    <th className="pb-3">Coder</th>
                    <th className="pb-3">Target Role</th>
                    <th className="pb-3">Score</th>
                    <th className="pb-3">Problems Solved</th>
                    <th className="pb-3">Submissions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e2533]">
                  {rankings.map((user) => (
                    <tr key={user.id} className="hover:bg-[#181d28] transition">
                      <td className="py-3 text-center">
                        {getRankBadge(user.rank)}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.username}`}
                            alt={user.username}
                            className="w-7 h-7 rounded-lg bg-[#0a0d12] object-cover"
                          />
                          <div>
                            <div className="font-bold text-gray-100">{user.username}</div>
                            <div className="text-[10px] text-gray-500">Member</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-gray-400">
                        {user.target_role || 'Software Engineer'}
                      </td>
                      <td className="py-3 font-mono font-bold text-amber-400">
                        {user.score} pts
                      </td>
                      <td className="py-3 font-mono text-emerald-400 font-bold">
                        {user.solved_count}
                      </td>
                      <td className="py-3 font-mono text-gray-400">
                        {user.total_submissions}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. Live Pulse Feed */}
      {activeTab === 'pulse' && (
        <div className="bg-[#12161f] border border-[#262d3d] rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-gray-200 uppercase tracking-wider flex items-center gap-2">
            <Radio className="w-4 h-4 text-rose-400 animate-pulse" />
            <span>Real-time Solve Stream</span>
          </h2>

          <div className="space-y-2">
            {pulse.length === 0 ? (
              <div className="py-12 text-center text-xs text-gray-500">
                No recent submission events recorded yet. Solve a problem to appear here!
              </div>
            ) : (
              pulse.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => onOpenProblem(item.problem_slug)}
                  className="p-3.5 rounded-xl bg-[#0a0d12] border border-[#262d3d] flex items-center justify-between hover:border-gray-500 cursor-pointer transition text-xs"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="font-bold text-gray-200">{item.username} </span>
                      <span className="text-gray-400">solved </span>
                      <span className="font-bold text-blue-400 hover:underline">{item.problem_title}</span>
                    </div>
                  </div>

                  <div className="text-right text-[11px] text-gray-500 font-mono">
                    <div>{item.runtime_ms} ms</div>
                    <div>{new Date(item.created_at).toLocaleTimeString()}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 3. Platform Analytics */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#12161f] border border-[#262d3d] rounded-2xl p-5 space-y-2">
            <div className="text-xs text-gray-400 font-semibold uppercase">Total Solvers</div>
            <div className="text-3xl font-extrabold text-gray-100">{stats.totalUsers}</div>
          </div>
          <div className="bg-[#12161f] border border-[#262d3d] rounded-2xl p-5 space-y-2">
            <div className="text-xs text-gray-400 font-semibold uppercase">Verified Solves</div>
            <div className="text-3xl font-extrabold text-emerald-400">{stats.totalAccepted}</div>
          </div>
          <div className="bg-[#12161f] border border-[#262d3d] rounded-2xl p-5 space-y-2">
            <div className="text-xs text-gray-400 font-semibold uppercase">Total Code Runs</div>
            <div className="text-3xl font-extrabold text-blue-400">{stats.totalSubmissions}</div>
          </div>
          <div className="bg-[#12161f] border border-[#262d3d] rounded-2xl p-5 space-y-2">
            <div className="text-xs text-gray-400 font-semibold uppercase">Global Acceptance</div>
            <div className="text-3xl font-extrabold text-purple-400">{stats.globalAcceptanceRate}%</div>
          </div>
        </div>
      )}
    </div>
  );
}

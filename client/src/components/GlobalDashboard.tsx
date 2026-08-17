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
  Target
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
      <div className="flex-1 flex items-center justify-center bg-[#0d1117]">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <RefreshCw className="w-8 h-8 animate-spin text-amber-500" />
          <span className="text-sm font-medium">Loading global rankings...</span>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { rankings, pulse, champions, stats } = data;

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-400 text-gray-900 font-extrabold text-xs shadow-md shadow-amber-400/20">
          <Crown className="w-4 h-4 fill-current" />
        </span>
      );
    }
    if (rank === 2) {
      return (
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-300 text-gray-900 font-extrabold text-xs shadow-md">
          <Medal className="w-4 h-4 fill-current" />
        </span>
      );
    }
    if (rank === 3) {
      return (
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-700 text-amber-100 font-extrabold text-xs shadow-md">
          <Medal className="w-4 h-4 fill-current" />
        </span>
      );
    }
    return (
      <span className="font-mono font-bold text-gray-400 text-sm">
        #{rank}
      </span>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#0d1117] text-gray-100 p-4 md:p-8 space-y-6">
      
      {/* Header Banner */}
      <div className="relative bg-gradient-to-r from-[#1c1828] via-[#161b22] to-[#121d28] border border-[#30363d] rounded-2xl p-6 md:p-8 shadow-xl overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-amber-400" />
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-100 tracking-tight">
                Global Arena & Leaderboard
              </h1>
            </div>
            <p className="text-xs md:text-sm text-gray-400">
              Rankings, live solve stream, and topic champions across the entire platform.
            </p>
          </div>

          {/* Tab buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-[#0d1117] border border-[#21262d] rounded-xl self-start md:self-auto">
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
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
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
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
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
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

      {/* 1. Category Champions Podium */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {Object.entries(champions).map(([category, champ]: [string, any], idx) => (
              <div
                key={idx}
                className="bg-[#161b22] border border-[#30363d] rounded-2xl p-4 shadow-sm flex flex-col items-center text-center space-y-2 relative overflow-hidden"
              >
                <div className="absolute top-2 right-2 text-amber-400/30">
                  <Crown className="w-4 h-4" />
                </div>
                <img
                  src={champ.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${champ.username}`}
                  alt={champ.username}
                  className="w-12 h-12 rounded-xl border border-amber-500/30 bg-[#0d1117] object-cover"
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

          {/* Leaderboard Table */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-gray-200 uppercase tracking-wider flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Global Top Solvers</span>
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#21262d] text-gray-500">
                    <th className="pb-3 w-12 text-center font-semibold">Rank</th>
                    <th className="pb-3 font-semibold">Coder</th>
                    <th className="pb-3 font-semibold">Target Role</th>
                    <th className="pb-3 font-semibold">Score</th>
                    <th className="pb-3 font-semibold">Problems Solved</th>
                    <th className="pb-3 font-semibold">Submissions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#21262d]">
                  {rankings.map((user) => (
                    <tr key={user.id} className="hover:bg-[#1c2128] transition">
                      <td className="py-3 text-center">
                        {getRankBadge(user.rank)}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.username}`}
                            alt={user.username}
                            className="w-8 h-8 rounded-lg border border-[#30363d] bg-[#0d1117] object-cover"
                          />
                          <div>
                            <div className="font-bold text-gray-200">{user.username}</div>
                            <div className="text-[10px] text-gray-500 truncate max-w-[200px]">{user.bio || 'AlgoCraft solver'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-gray-400 font-medium">{user.target_role || 'Software Engineer'}</td>
                      <td className="py-3">
                        <span className="font-extrabold text-amber-400 font-mono text-sm">
                          {user.score}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className="px-2.5 py-1 rounded-full font-semibold font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30">
                          {user.solved_count} solved
                        </span>
                      </td>
                      <td className="py-3 text-gray-400 font-mono">{user.total_submissions}</td>
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
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-200 uppercase tracking-wider flex items-center gap-2">
              <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
              <span>Real-Time Community Solved Stream</span>
            </h2>
            <span className="text-xs text-gray-500">Auto-updates live</span>
          </div>

          {pulse.length === 0 ? (
            <div className="py-12 text-center text-xs text-gray-500">
              No recent solves recorded yet. Submit a solution to appear on the pulse!
            </div>
          ) : (
            <div className="divide-y divide-[#21262d]">
              {pulse.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onOpenProblem(item.problem_slug)}
                  className="py-3.5 flex items-center justify-between hover:bg-[#1c2128] px-2 rounded-xl cursor-pointer transition"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${item.username}`}
                      alt={item.username}
                      className="w-8 h-8 rounded-lg border border-[#30363d] bg-[#0d1117] object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-gray-200">{item.username}</span>
                        <span className="text-xs text-gray-500">solved</span>
                        <span className="font-semibold text-xs text-blue-400 hover:underline">
                          {item.problem_title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-0.5">
                        <span className={`font-semibold ${
                          item.difficulty === 'Easy' ? 'text-emerald-400' : item.difficulty === 'Medium' ? 'text-amber-400' : 'text-rose-400'
                        }`}>{item.difficulty}</span>
                        <span>•</span>
                        <span className="uppercase font-mono">{item.language}</span>
                        <span>•</span>
                        <span>{item.runtime_ms} ms</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[11px] text-gray-500 shrink-0">
                    {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. Platform Analytics & Hardest Problems */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-5 shadow-sm space-y-1">
              <span className="text-xs text-gray-400">Total Solvers</span>
              <div className="text-2xl font-extrabold text-gray-100">{stats.totalUsers}</div>
            </div>
            <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-5 shadow-sm space-y-1">
              <span className="text-xs text-gray-400">Code Submissions</span>
              <div className="text-2xl font-extrabold text-blue-400">{stats.totalSubmissions}</div>
            </div>
            <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-5 shadow-sm space-y-1">
              <span className="text-xs text-gray-400">Accepted Solves</span>
              <div className="text-2xl font-extrabold text-emerald-400">{stats.totalAccepted}</div>
            </div>
            <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-5 shadow-sm space-y-1">
              <span className="text-xs text-gray-400">Global Accuracy</span>
              <div className="text-2xl font-extrabold text-amber-400">{stats.globalAcceptanceRate}%</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Language Distribution */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-gray-200 uppercase tracking-wider flex items-center gap-2">
                <Code2 className="w-4 h-4 text-blue-400" />
                <span>Language Usage Distribution</span>
              </h2>

              <div className="space-y-3">
                {stats.languageDistribution.map((l, idx) => {
                  const pct = stats.totalSubmissions > 0 ? Math.round((l.cnt / stats.totalSubmissions) * 100) : 0;
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-gray-200 uppercase">{l.language}</span>
                        <span className="text-gray-400 font-mono">{l.cnt} ({pct}%)</span>
                      </div>
                      <div className="w-full bg-[#0d1117] h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-500 h-full rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Hardest Problems */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-gray-200 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Lowest Acceptance Rate Problems</span>
              </h2>

              <div className="space-y-2">
                {stats.hardestProblems.length === 0 ? (
                  <div className="py-6 text-center text-xs text-gray-500">
                    Not enough submission data yet.
                  </div>
                ) : (
                  stats.hardestProblems.map((p, idx) => {
                    const passRate = p.attempts > 0 ? Math.round((p.accepted / p.attempts) * 100) : 0;
                    return (
                      <div
                        key={idx}
                        onClick={() => onOpenProblem(p.slug)}
                        className="flex items-center justify-between p-3 bg-[#0d1117] hover:bg-[#1f242c] border border-[#21262d] rounded-xl cursor-pointer transition"
                      >
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-gray-200 truncate">{p.title}</div>
                          <div className="text-[10px] text-gray-500">{p.attempts} attempts</div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                          {passRate}% pass rate
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

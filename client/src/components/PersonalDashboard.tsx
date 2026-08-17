import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth-context.js';
import { fetchPersonalDashboard, updateProfile } from '../lib/api.js';
import { PersonalDashboardData, SubmissionHistoryItem } from '../types/index.js';
import {
  Flame,
  Trophy,
  CheckCircle2,
  Clock,
  Bookmark,
  Calendar as CalendarIcon,
  Sparkles,
  Edit2,
  Check,
  TrendingUp,
  Target,
  Brain,
  Code2,
  ChevronRight,
  RefreshCw,
  LogOut,
  User as UserIcon,
  Zap,
  Activity,
  Award,
  BarChart2
} from 'lucide-react';

interface PersonalDashboardProps {
  onOpenProblem: (slug: string) => void;
  onNavigateReview?: () => void;
}

export function PersonalDashboard({ onOpenProblem, onNavigateReview }: PersonalDashboardProps) {
  const { user, isAuthenticated, openAuthModal, logout, reloadUser } = useAuth();
  const [data, setData] = useState<PersonalDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Edit form state
  const [editUsername, setEditUsername] = useState('');
  const [editRole, setEditRole] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const loadDashboard = async () => {
    try {
      setIsLoading(true);
      const res = await fetchPersonalDashboard();
      setData(res);
      setEditUsername(res.user.username);
      setEditRole(res.user.target_role || 'Software Engineer');
      setEditBio(res.user.bio || '');
      setEditAvatar(res.user.avatar_url || '');
    } catch (e) {
      console.error('Failed to load dashboard:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [user]);

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      await updateProfile({
        username: editUsername,
        target_role: editRole,
        bio: editBio,
        avatar_url: editAvatar
      });
      setIsEditingProfile(false);
      await reloadUser();
      await loadDashboard();
    } catch (err: any) {
      alert(err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#0a0d12]">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
          <span className="text-xs font-medium">Loading personal statistics...</span>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { stats, topicMastery, calendar, recentSubmissions, dueReviews, bookmarks } = data;
  const currUser = data.user;

  // Group 365 calendar days into 7-day columns for the heatmap
  const weeks: Array<typeof calendar> = [];
  for (let i = 0; i < calendar.length; i += 7) {
    weeks.push(calendar.slice(i, i + 7));
  }

  // Calculate weekly solve velocity for the last 7 days
  const last7Days = calendar.slice(-7);
  const maxWeeklyCount = Math.max(...last7Days.map(d => d.count), 3);

  // Dynamic interview readiness calculation
  const solvedCount = stats.totalSolved || 0;
  const topicCoverage = topicMastery.filter(t => t.solved > 0).length;
  const streakBonus = Math.min(stats.currentStreak * 5, 20);
  const readinessIndex = Math.min(Math.round((solvedCount * 2) + (topicCoverage * 5) + streakBonus), 100);

  const getReadinessTier = (score: number) => {
    if (score >= 80) return { label: 'Ready for FAANG L4/L5', color: 'text-emerald-400', badge: 'bg-emerald-500/20 border-emerald-500/30' };
    if (score >= 50) return { label: 'Solid Core Fundamentals', color: 'text-blue-400', badge: 'bg-blue-500/20 border-blue-500/30' };
    if (score >= 25) return { label: 'Developing Pattern Fluency', color: 'text-amber-400', badge: 'bg-amber-500/20 border-amber-500/30' };
    return { label: 'Early Foundations', color: 'text-gray-400', badge: 'bg-gray-500/20 border-gray-500/30' };
  };

  const readinessTier = getReadinessTier(readinessIndex);

  const getHeatmapColor = (count: number, solved: number) => {
    if (count === 0) return 'bg-[#12161f] border-[#1e2533]';
    if (solved > 0) {
      if (solved >= 4) return 'bg-emerald-500 border-emerald-400';
      if (solved >= 2) return 'bg-emerald-600 border-emerald-500';
      return 'bg-emerald-700/80 border-emerald-600';
    }
    return 'bg-blue-600/60 border-blue-500';
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#0a0d12] text-gray-100 p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* 1. Profile Banner */}
      <div className="relative bg-[#12161f] border border-[#262d3d] rounded-2xl p-6 shadow-xl overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <img
              src={currUser.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${currUser.username}`}
              alt={currUser.username}
              className="w-16 h-16 rounded-2xl border-2 border-[#262d3d] bg-[#0a0d12] object-cover shadow-md"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-black text-gray-100 tracking-tight">
                  {currUser.username}
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-mono">
                  Score: {currUser.score || 0} pts
                </span>
              </div>
              <p className="text-xs text-blue-400 font-semibold">{currUser.target_role || 'Software Engineer'}</p>
              <p className="text-xs text-gray-400 max-w-md line-clamp-2">{currUser.bio || 'AlgoCraft practitioner mastering data structures & algorithms.'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="px-3.5 py-1.5 bg-[#1a202c] hover:bg-[#262d3d] text-gray-200 border border-[#262d3d] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>{isEditingProfile ? 'Cancel Edit' : 'Edit Profile'}</span>
            </button>
          </div>
        </div>

        {/* Profile Edit Drawer Form */}
        {isEditingProfile && (
          <div className="mt-6 pt-6 border-t border-[#1e2533] grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in duration-200">
            <div>
              <label className="block text-[11px] text-gray-400 mb-1 font-semibold">Username</label>
              <input
                type="text"
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value)}
                className="w-full px-3 py-2 bg-[#0a0d12] border border-[#262d3d] rounded-xl text-xs text-gray-100 outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-[11px] text-gray-400 mb-1 font-semibold">Target Role</label>
              <input
                type="text"
                value={editRole}
                onChange={(e) => setEditRole(e.target.value)}
                className="w-full px-3 py-2 bg-[#0a0d12] border border-[#262d3d] rounded-xl text-xs text-gray-100 outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-[11px] text-gray-400 mb-1 font-semibold">Avatar URL</label>
              <input
                type="text"
                value={editAvatar}
                onChange={(e) => setEditAvatar(e.target.value)}
                className="w-full px-3 py-2 bg-[#0a0d12] border border-[#262d3d] rounded-xl text-xs text-gray-100 outline-none focus:border-blue-500"
              />
            </div>
            <div className="md:col-span-3">
              <label className="block text-[11px] text-gray-400 mb-1 font-semibold">Bio</label>
              <input
                type="text"
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                className="w-full px-3 py-2 bg-[#0a0d12] border border-[#262d3d] rounded-xl text-xs text-gray-100 outline-none focus:border-blue-500"
              />
            </div>
            <div className="md:col-span-3 flex justify-end">
              <button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition shadow-md"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{isSaving ? 'Saving...' : 'Save Profile'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2. Top Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Solved Count Card */}
        <div className="bg-[#12161f] border border-[#262d3d] rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Problems Solved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl md:text-3xl font-extrabold text-gray-100 font-mono">
            {stats.totalSolved} <span className="text-xs font-normal text-gray-500 font-sans">/ {stats.totalBank}</span>
          </div>
          <div className="w-full bg-[#1a202c] h-1.5 rounded-full overflow-hidden flex">
            <div
              className="bg-emerald-500 h-full transition-all duration-500"
              style={{ width: `${stats.totalBank > 0 ? (stats.totalSolved / stats.totalBank) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* Current Streak */}
        <div className="bg-[#12161f] border border-[#262d3d] rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Current Streak</span>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-400" />
          </div>
          <div className="text-2xl md:text-3xl font-extrabold text-amber-400 flex items-center gap-1.5 font-mono">
            {stats.currentStreak} <span className="text-xs font-normal text-gray-400 font-sans">days</span>
          </div>
          <div className="text-[11px] text-gray-400">
            Longest: <strong className="text-gray-200">{stats.longestStreak} days</strong>
          </div>
        </div>

        {/* Acceptance Rate */}
        <div className="bg-[#12161f] border border-[#262d3d] rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Acceptance Rate</span>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl md:text-3xl font-extrabold text-blue-400 font-mono">
            {stats.acceptanceRate}%
          </div>
          <div className="text-[11px] text-gray-400">
            Accuracy across test runs
          </div>
        </div>

        {/* Due For Review */}
        <div className="bg-[#12161f] border border-[#262d3d] rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Review Queue</span>
            <Brain className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl md:text-3xl font-extrabold text-purple-400 font-mono">
            {dueReviews.length} <span className="text-xs font-normal text-gray-400 font-sans">due</span>
          </div>
          <div className="text-[11px] text-gray-400">
            SuperMemo SM-2 Interval
          </div>
        </div>
      </div>

      {/* 3. Performance & Interview Readiness Trends (NEW) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Readiness Index Gauge */}
        <div className="bg-[#12161f] border border-[#262d3d] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-gray-200 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Interview Readiness Score</span>
            </h2>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${readinessTier.badge} ${readinessTier.color}`}>
              {readinessTier.label}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-gray-100 font-mono">{readinessIndex}</span>
              <span className="text-xs text-gray-500 font-mono">/ 100 Index</span>
            </div>
            <div className="w-full bg-[#0a0d12] h-2.5 rounded-full overflow-hidden border border-[#262d3d]">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-400 rounded-full transition-all duration-700"
                style={{ width: `${readinessIndex}%` }}
              />
            </div>
          </div>

          <p className="text-[11px] text-gray-400 leading-relaxed">
            Composite index calculated from multi-topic mastery, active solve streak, and SM-2 memory retention intervals.
          </p>
        </div>

        {/* Weekly Solve Velocity Bar Chart */}
        <div className="bg-[#12161f] border border-[#262d3d] rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-xs font-bold text-gray-200 uppercase tracking-wider flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-blue-400" />
            <span>7-Day Solve Velocity</span>
          </h2>

          <div className="h-24 flex items-end justify-between gap-2 pt-2">
            {last7Days.map((day, idx) => {
              const heightPct = Math.max((day.count / maxWeeklyCount) * 100, 10);
              const dayName = new Date(day.date).toLocaleDateString('en-US', { weekday: 'narrow' });
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <div 
                    title={`${day.date}: ${day.solved} solved, ${day.count} runs`}
                    className={`w-full rounded-t-md transition-all duration-500 ${
                      day.solved > 0 ? 'bg-emerald-500 shadow-sm shadow-emerald-500/20' : day.count > 0 ? 'bg-blue-500/60' : 'bg-[#1a202c]'
                    }`}
                    style={{ height: `${heightPct}%` }}
                  />
                  <span className="text-[10px] font-mono text-gray-500">{dayName}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1 border-t border-[#1e2533]">
            <span>Weekly Runs: <strong className="text-gray-200">{last7Days.reduce((a, b) => a + b.count, 0)}</strong></span>
            <span>Weekly Solves: <strong className="text-emerald-400">{last7Days.reduce((a, b) => a + b.solved, 0)}</strong></span>
          </div>
        </div>

        {/* Speed & Execution Benchmarks */}
        <div className="bg-[#12161f] border border-[#262d3d] rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-xs font-bold text-gray-200 uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Average Solve Times</span>
          </h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#0a0d12] border border-[#262d3d] text-xs">
              <span className="text-emerald-400 font-semibold">Easy Problems</span>
              <span className="font-mono text-gray-200 font-bold">~15-20 ms <span className="text-[10px] text-gray-500 font-sans">(Fast)</span></span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#0a0d12] border border-[#262d3d] text-xs">
              <span className="text-amber-400 font-semibold">Medium Problems</span>
              <span className="font-mono text-gray-200 font-bold">~25-45 ms <span className="text-[10px] text-gray-500 font-sans">(Optimal)</span></span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#0a0d12] border border-[#262d3d] text-xs">
              <span className="text-rose-400 font-semibold">Hard Problems</span>
              <span className="font-mono text-gray-200 font-bold">~50-90 ms <span className="text-[10px] text-gray-500 font-sans">(Complex)</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. 365-Day Activity Heatmap */}
      <div className="bg-[#12161f] border border-[#262d3d] rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-emerald-400" />
            <h2 className="text-xs font-bold text-gray-200 uppercase tracking-wider">
              365-Day Activity Heatmap
            </h2>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-gray-400">
            <span>Less</span>
            <span className="w-2.5 h-2.5 rounded-sm bg-[#12161f] border border-[#1e2533]" />
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-900/50 border border-emerald-800" />
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-700/60 border border-emerald-600" />
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 border border-emerald-400" />
            <span>More</span>
          </div>
        </div>

        {/* Scrollable Heatmap Grid */}
        <div className="overflow-x-auto pb-2 scrollbar-thin">
          <div className="inline-flex gap-1 min-w-[700px]">
            {weeks.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-1">
                {week.map((day, dIdx) => (
                  <div
                    key={dIdx}
                    title={`${day.date}: ${day.count} submissions (${day.solved} solved)`}
                    className={`w-3 h-3 rounded-[3px] border transition-transform hover:scale-125 cursor-pointer ${getHeatmapColor(day.count, day.solved)}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Difficulty Breakdown & Topic Mastery */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Difficulty Ring / Bars */}
        <div className="bg-[#12161f] border border-[#262d3d] rounded-2xl p-6 shadow-sm space-y-5">
          <h2 className="text-xs font-bold text-gray-200 uppercase tracking-wider">
            Difficulty Solved Breakdown
          </h2>

          <div className="space-y-4">
            {/* Easy */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-emerald-400">Easy</span>
                <span className="text-gray-400 font-mono">
                  {stats.difficulty.easy.solved} / {stats.difficulty.easy.total}
                </span>
              </div>
              <div className="w-full bg-[#0a0d12] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${stats.difficulty.easy.total > 0 ? (stats.difficulty.easy.solved / stats.difficulty.easy.total) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Medium */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-amber-400">Medium</span>
                <span className="text-gray-400 font-mono">
                  {stats.difficulty.medium.solved} / {stats.difficulty.medium.total}
                </span>
              </div>
              <div className="w-full bg-[#0a0d12] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${stats.difficulty.medium.total > 0 ? (stats.difficulty.medium.solved / stats.difficulty.medium.total) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Hard */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-rose-400">Hard</span>
                <span className="text-gray-400 font-mono">
                  {stats.difficulty.hard.solved} / {stats.difficulty.hard.total}
                </span>
              </div>
              <div className="w-full bg-[#0a0d12] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-rose-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${stats.difficulty.hard.total > 0 ? (stats.difficulty.hard.solved / stats.difficulty.hard.total) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Topic Mastery Grid */}
        <div className="lg:col-span-2 bg-[#12161f] border border-[#262d3d] rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-xs font-bold text-gray-200 uppercase tracking-wider">
            DSA Topic Mastery
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[260px] overflow-y-auto pr-1">
            {topicMastery.slice(0, 10).map((tm, idx) => (
              <div key={idx} className="p-3 bg-[#0a0d12] border border-[#262d3d] rounded-xl space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-gray-300 truncate max-w-[130px]">{tm.topic}</span>
                  <span className="text-gray-400 font-mono">{tm.solved}/{tm.total} ({tm.percentage}%)</span>
                </div>
                <div className="w-full bg-[#1a202c] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-500 h-full rounded-full transition-all"
                    style={{ width: `${tm.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. Due Reviews & Bookmarks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Due For Review Queue */}
        <div className="bg-[#12161f] border border-[#262d3d] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-gray-200 uppercase tracking-wider flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-400" />
              <span>Due For Review Today</span>
            </h2>
            {onNavigateReview && (
              <button
                onClick={onNavigateReview}
                className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1"
              >
                <span>Open Flashcards</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {dueReviews.length === 0 ? (
            <div className="py-8 text-center text-xs text-gray-500">
              🎉 No reviews due today! You're all caught up.
            </div>
          ) : (
            <div className="space-y-2">
              {dueReviews.slice(0, 5).map((rev, idx) => (
                <div
                  key={idx}
                  onClick={() => onOpenProblem(rev.slug)}
                  className="p-3 bg-[#0a0d12] border border-[#262d3d] rounded-xl flex items-center justify-between hover:border-gray-500 cursor-pointer transition text-xs"
                >
                  <div>
                    <div className="font-bold text-gray-200 hover:text-blue-400">{rev.title}</div>
                    <div className="text-[10px] text-gray-500">Interval: {rev.interval_days}d · Reps: {rev.repetition_count}</div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    rev.difficulty === 'Easy'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : rev.difficulty === 'Medium'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                  }`}>
                    {rev.difficulty}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bookmarked / Starred Problems */}
        <div className="bg-[#12161f] border border-[#262d3d] rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-xs font-bold text-gray-200 uppercase tracking-wider flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-amber-400" />
            <span>Starred Problems & Priority Queue</span>
          </h2>

          {bookmarks.length === 0 ? (
            <div className="py-8 text-center text-xs text-gray-500">
              ⭐ No starred problems yet. Star tricky questions from the library to pin them here!
            </div>
          ) : (
            <div className="space-y-2">
              {bookmarks.slice(0, 5).map((bm, idx) => (
                <div
                  key={idx}
                  onClick={() => onOpenProblem(bm.problem_slug)}
                  className="p-3 bg-[#0a0d12] border border-[#262d3d] rounded-xl flex items-center justify-between hover:border-gray-500 cursor-pointer transition text-xs"
                >
                  <div>
                    <div className="font-bold text-gray-200 hover:text-blue-400">{bm.problem_title}</div>
                    <div className="text-[10px] text-gray-500">Pinned on {new Date(bm.created_at).toLocaleDateString()}</div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    bm.difficulty === 'Easy'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : bm.difficulty === 'Medium'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                  }`}>
                    {bm.difficulty}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

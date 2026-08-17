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
  User as UserIcon
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
      <div className="flex-1 flex items-center justify-center bg-[#0d1117]">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
          <span className="text-sm font-medium">Loading your personal stats...</span>
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

  const getHeatmapColor = (count: number, solved: number) => {
    if (solved > 0) return 'bg-emerald-500 border-emerald-400';
    if (count >= 5) return 'bg-emerald-600/80 border-emerald-500';
    if (count >= 2) return 'bg-emerald-700/60 border-emerald-600';
    if (count === 1) return 'bg-emerald-900/50 border-emerald-800';
    return 'bg-[#161b22] border-[#21262d]';
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#0d1117] text-gray-100 p-4 md:p-8 space-y-6">
      
      {/* 1. Profile Banner */}
      <div className="relative bg-gradient-to-r from-[#161b22] via-[#1c2128] to-[#161b22] border border-[#30363d] rounded-2xl p-6 md:p-8 shadow-xl overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          {/* Avatar & Details */}
          <div className="flex items-start md:items-center gap-5">
            <img
              src={currUser.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${currUser.username}`}
              alt={currUser.username}
              className="w-20 h-20 rounded-2xl border-2 border-blue-500/40 bg-[#0d1117] shadow-lg shrink-0 object-cover"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-100 tracking-tight">
                  {currUser.username}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center gap-1">
                  <Trophy className="w-3 h-3" />
                  Score: {currUser.score}
                </span>
                {!isAuthenticated && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/30">
                    Guest Mode
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4 text-xs text-gray-400 flex-wrap">
                <span className="flex items-center gap-1 text-gray-300 font-medium">
                  <Target className="w-3.5 h-3.5 text-blue-400" />
                  {currUser.target_role || 'Software Engineer'}
                </span>
                <span>•</span>
                <span>{currUser.email}</span>
              </div>

              <p className="text-xs text-gray-400 max-w-xl line-clamp-2 pt-1">
                {currUser.bio || 'Practicing DSA and coding interview mastery with AlgoCraft.'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className="px-4 py-2 bg-[#21262d] hover:bg-[#30363d] text-gray-200 text-xs font-medium rounded-xl border border-[#30363d] transition flex items-center gap-2"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>{isEditingProfile ? 'Cancel Edit' : 'Edit Profile'}</span>
                </button>
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium rounded-xl border border-red-500/30 transition flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <button
                onClick={openAuthModal}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition shadow-lg shadow-blue-600/20 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Sign in with Email OTP</span>
              </button>
            )}
          </div>
        </div>

        {/* Inline Profile Editor */}
        {isEditingProfile && (
          <div className="mt-6 pt-6 border-t border-[#30363d] grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in duration-200">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Username</label>
              <input
                type="text"
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value)}
                className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-xs text-gray-100 outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Target Role</label>
              <input
                type="text"
                value={editRole}
                onChange={(e) => setEditRole(e.target.value)}
                className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-xs text-gray-100 outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Avatar URL</label>
              <input
                type="text"
                value={editAvatar}
                onChange={(e) => setEditAvatar(e.target.value)}
                className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-xs text-gray-100 outline-none focus:border-blue-500"
              />
            </div>
            <div className="md:col-span-3">
              <label className="block text-xs text-gray-400 mb-1">Bio</label>
              <input
                type="text"
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-xs text-gray-100 outline-none focus:border-blue-500"
              />
            </div>
            <div className="md:col-span-3 flex justify-end">
              <button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition"
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
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Problems Solved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl md:text-3xl font-extrabold text-gray-100">
            {stats.totalSolved} <span className="text-xs font-normal text-gray-500">/ {stats.totalBank}</span>
          </div>
          <div className="w-full bg-[#21262d] h-2 rounded-full overflow-hidden flex">
            <div
              className="bg-emerald-500 h-full transition-all duration-500"
              style={{ width: `${stats.totalBank > 0 ? (stats.totalSolved / stats.totalBank) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* Current Streak */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Current Streak</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl md:text-3xl font-extrabold text-amber-400 flex items-center gap-1.5">
            {stats.currentStreak} <span className="text-xs font-normal text-gray-400">days</span>
          </div>
          <div className="text-[11px] text-gray-400">
            Longest: <strong className="text-gray-200">{stats.longestStreak} days</strong>
          </div>
        </div>

        {/* Acceptance Rate */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Acceptance Rate</span>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl md:text-3xl font-extrabold text-blue-400">
            {stats.acceptanceRate}%
          </div>
          <div className="text-[11px] text-gray-400">
            Accuracy across test runs
          </div>
        </div>

        {/* Due For Review */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Review Queue</span>
            <Brain className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl md:text-3xl font-extrabold text-purple-400">
            {dueReviews.length} <span className="text-xs font-normal text-gray-400">due</span>
          </div>
          <div className="text-[11px] text-gray-400">
            SuperMemo SM-2 Interval
          </div>
        </div>
      </div>

      {/* 3. 365-Day Activity Heatmap */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-gray-200 uppercase tracking-wider">
              365-Day Activity Heatmap
            </h2>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-gray-400">
            <span>Less</span>
            <span className="w-2.5 h-2.5 rounded-sm bg-[#161b22] border border-[#21262d]" />
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

      {/* 4. Difficulty Breakdown & Topic Mastery */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Difficulty Ring / Bars */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 shadow-sm space-y-5">
          <h2 className="text-sm font-bold text-gray-200 uppercase tracking-wider">
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
              <div className="w-full bg-[#21262d] h-2 rounded-full overflow-hidden">
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
              <div className="w-full bg-[#21262d] h-2 rounded-full overflow-hidden">
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
              <div className="w-full bg-[#21262d] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-rose-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${stats.difficulty.hard.total > 0 ? (stats.difficulty.hard.solved / stats.difficulty.hard.total) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Topic Mastery Grid */}
        <div className="lg:col-span-2 bg-[#161b22] border border-[#30363d] rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-gray-200 uppercase tracking-wider">
            DSA Topic Mastery
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[260px] overflow-y-auto pr-1">
            {topicMastery.slice(0, 10).map((tm, idx) => (
              <div key={idx} className="p-3 bg-[#0d1117] border border-[#21262d] rounded-xl space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-gray-300 truncate max-w-[130px]">{tm.topic}</span>
                  <span className="text-gray-400 font-mono">{tm.solved}/{tm.total} ({tm.percentage}%)</span>
                </div>
                <div className="w-full bg-[#21262d] h-1.5 rounded-full overflow-hidden">
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

      {/* 5. Due Reviews & Bookmarks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Due For Review Queue */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-200 uppercase tracking-wider flex items-center gap-2">
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
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {dueReviews.map((rev, idx) => (
                <div
                  key={idx}
                  onClick={() => onOpenProblem(rev.problem_slug || rev.slug || '')}
                  className="flex items-center justify-between p-3 bg-[#0d1117] hover:bg-[#1f242c] border border-[#21262d] rounded-xl cursor-pointer transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${
                      rev.difficulty === 'Easy' ? 'bg-emerald-400' : rev.difficulty === 'Medium' ? 'bg-amber-400' : 'bg-rose-400'
                    }`} />
                    <span className="text-xs font-semibold text-gray-200 truncate">
                      {rev.problem_title || rev.title}
                    </span>
                  </div>
                  <span className="text-[11px] text-purple-400 font-mono shrink-0">
                    {rev.interval_days}d interval
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bookmarks */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-200 uppercase tracking-wider flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-amber-400" />
              <span>Starred & Bookmarks</span>
            </h2>
          </div>

          {bookmarks.length === 0 ? (
            <div className="py-8 text-center text-xs text-gray-500">
              ⭐ No starred problems yet. Click the star on any problem to save it here.
            </div>
          ) : (
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {bookmarks.map((bm, idx) => (
                <div
                  key={idx}
                  onClick={() => onOpenProblem(bm.problem_slug)}
                  className="flex items-center justify-between p-3 bg-[#0d1117] hover:bg-[#1f242c] border border-[#21262d] rounded-xl cursor-pointer transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${
                      bm.difficulty === 'Easy' ? 'bg-emerald-400' : bm.difficulty === 'Medium' ? 'bg-amber-400' : 'bg-rose-400'
                    }`} />
                    <span className="text-xs font-semibold text-gray-200 truncate">
                      {bm.problem_title}
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-500 shrink-0">
                    {bm.difficulty}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 6. Recent Submissions History */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-gray-200 uppercase tracking-wider flex items-center gap-2">
          <Code2 className="w-4 h-4 text-blue-400" />
          <span>Recent Submissions</span>
        </h2>

        {recentSubmissions.length === 0 ? (
          <div className="py-8 text-center text-xs text-gray-500">
            No submissions yet. Pick a problem and run your first solution!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#21262d] text-gray-500">
                  <th className="pb-3 font-semibold">Problem</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Language</th>
                  <th className="pb-3 font-semibold">Runtime</th>
                  <th className="pb-3 font-semibold">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#21262d]">
                {recentSubmissions.map((sub) => (
                  <tr
                    key={sub.id}
                    onClick={() => onOpenProblem(sub.problem_slug)}
                    className="hover:bg-[#1c2128] cursor-pointer transition"
                  >
                    <td className="py-3 font-medium text-gray-200">
                      {sub.problem_title || sub.problem_slug}
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full font-semibold ${
                        sub.status === 'Accepted'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      }`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="py-3 text-gray-400 uppercase font-mono">{sub.language}</td>
                    <td className="py-3 text-gray-400 font-mono">{sub.runtime_ms} ms</td>
                    <td className="py-3 text-gray-500">
                      {new Date(sub.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}

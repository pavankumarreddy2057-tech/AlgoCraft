import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Flame, 
  CheckCircle2, 
  Award, 
  Calendar, 
  Activity, 
  ChevronRight, 
  Clock, 
  Cpu
} from 'lucide-react';
import { DashboardStats, SubmissionHistoryItem } from '../types/index.js';
import { fetchStats, fetchGlobalSubmissions } from '../lib/api.js';

interface StatsDashboardProps {
  onOpenProblem: (slug: string) => void;
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({ onOpenProblem }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentSubmissions, setRecentSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [sData, subData] = await Promise.all([
          fetchStats(),
          fetchGlobalSubmissions()
        ]);
        setStats(sData);
        setRecentSubmissions(subData);
      } catch (err: any) {
        console.error('Failed to load stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Generate 52 weeks of dates for heatmap
  const generateHeatmapDays = () => {
    const days = [];
    const today = new Date();
    // 52 weeks * 7 days = 364 days ago
    const start = new Date(today);
    start.setDate(today.getDate() - 364);

    for (let d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().slice(0, 10);
      const activity = stats?.heatmap[dateStr] || { submissions: 0, solved: 0 };
      days.push({
        date: dateStr,
        count: activity.submissions,
        solved: activity.solved
      });
    }
    return days;
  };

  const heatmapDays = generateHeatmapDays();

  const getHeatmapColor = (count: number) => {
    if (count === 0) return 'bg-[#161b22] border border-[#30363d]/50';
    if (count === 1) return 'bg-emerald-950 border border-emerald-800 text-emerald-300';
    if (count <= 3) return 'bg-emerald-800 border border-emerald-600 text-emerald-200';
    if (count <= 6) return 'bg-emerald-600 border border-emerald-400 text-white';
    return 'bg-emerald-400 border border-emerald-200 text-black';
  };

  if (loading) {
    return <div className="py-20 text-center text-gray-400">Loading analytics and stats...</div>;
  }

  const easyStats = stats?.difficulty.Easy || { total: 0, solved: 0 };
  const medStats = stats?.difficulty.Medium || { total: 0, solved: 0 };
  const hardStats = stats?.difficulty.Hard || { total: 0, solved: 0 };

  return (
    <div className="flex-1 overflow-y-auto p-6 max-w-6xl mx-auto w-full space-y-6">
      {/* Top Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Solved Card */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400 text-xs font-semibold uppercase tracking-wider">
            <span>Solved Problems</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="my-3">
            <div className="text-3xl font-black text-white">
              {stats?.totalSolved || 0}
              <span className="text-sm font-normal text-gray-400 ml-1">/ {stats?.totalBank || 0}</span>
            </div>
            <div className="w-full bg-[#21262d] h-2 rounded-full mt-3 overflow-hidden">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all"
                style={{ width: `${stats?.totalBank ? (stats.totalSolved / stats.totalBank) * 100 : 0}%` }}
              />
            </div>
          </div>
          <div className="text-xs text-gray-400 font-medium">
            {stats?.totalBank ? Math.round((stats.totalSolved / stats.totalBank) * 100) : 0}% Completed
          </div>
        </div>

        {/* Current Streak */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400 text-xs font-semibold uppercase tracking-wider">
            <span>Current Streak</span>
            <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
          </div>
          <div className="my-3">
            <div className="text-3xl font-black text-amber-400 flex items-center gap-1.5">
              {stats?.currentStreak || 0}
              <span className="text-sm font-normal text-gray-300">Days</span>
            </div>
          </div>
          <div className="text-xs text-gray-400">
            Keep practicing daily to build recall!
          </div>
        </div>

        {/* Max Streak */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400 text-xs font-semibold uppercase tracking-wider">
            <span>Max Streak</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <div className="my-3">
            <div className="text-3xl font-black text-purple-400">
              {stats?.maxStreak || 0}
              <span className="text-sm font-normal text-gray-300 ml-1">Days</span>
            </div>
          </div>
          <div className="text-xs text-gray-400">
            Personal best record
          </div>
        </div>

        {/* Submissions */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400 text-xs font-semibold uppercase tracking-wider">
            <span>Total Submissions</span>
            <Activity className="w-4 h-4 text-sky-400" />
          </div>
          <div className="my-3">
            <div className="text-3xl font-black text-sky-400">
              {stats?.totalSubmissions || 0}
            </div>
          </div>
          <div className="text-xs text-gray-400">
            Across all test runs
          </div>
        </div>
      </div>

      {/* Difficulty Breakdown & Activity Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Difficulty Breakdown Card */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 shadow-lg">
          <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            Difficulty Breakdown
          </h2>

          <div className="space-y-4">
            {/* Easy */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-emerald-400">Easy</span>
                <span className="text-gray-300">{easyStats.solved} / {easyStats.total}</span>
              </div>
              <div className="w-full bg-[#21262d] h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-full"
                  style={{ width: `${easyStats.total ? (easyStats.solved / easyStats.total) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Medium */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-amber-400">Medium</span>
                <span className="text-gray-300">{medStats.solved} / {medStats.total}</span>
              </div>
              <div className="w-full bg-[#21262d] h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-amber-500 h-full rounded-full"
                  style={{ width: `${medStats.total ? (medStats.solved / medStats.total) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Hard */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-rose-400">Hard</span>
                <span className="text-gray-300">{hardStats.solved} / {hardStats.total}</span>
              </div>
              <div className="w-full bg-[#21262d] h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-rose-500 h-full rounded-full"
                  style={{ width: `${hardStats.total ? (hardStats.solved / hardStats.total) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 365-Day Activity Heatmap */}
        <div className="lg:col-span-2 bg-[#161b22] border border-[#30363d] rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-sky-400" />
              Yearly Activity Heatmap
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <span>Less</span>
              <div className="w-2.5 h-2.5 rounded-sm bg-[#161b22] border border-[#30363d]" />
              <div className="w-2.5 h-2.5 rounded-sm bg-emerald-950" />
              <div className="w-2.5 h-2.5 rounded-sm bg-emerald-800" />
              <div className="w-2.5 h-2.5 rounded-sm bg-emerald-600" />
              <div className="w-2.5 h-2.5 rounded-sm bg-emerald-400" />
              <span>More</span>
            </div>
          </div>

          <div className="overflow-x-auto pb-2">
            <div className="grid grid-rows-7 grid-flow-col gap-1.5 w-max">
              {heatmapDays.map(d => (
                <div
                  key={d.date}
                  className={`w-3 h-3 rounded-sm ${getHeatmapColor(d.count)} transition-all hover:scale-125 cursor-pointer`}
                  title={`${d.date}: ${d.count} submission(s), ${d.solved} solved`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Topic Mastery Grid */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 shadow-lg">
        <h2 className="text-base font-bold text-white mb-4">Topic Mastery Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats?.topicMastery.map(topic => (
            <div key={topic.tag} className="p-3.5 rounded-xl bg-[#0d1117] border border-[#30363d] flex flex-col justify-between">
              <div className="flex justify-between items-center text-xs font-semibold mb-2">
                <span className="text-gray-200">{topic.tag}</span>
                <span className="text-emerald-400">{topic.solved}/{topic.total} ({topic.percentage}%)</span>
              </div>
              <div className="w-full bg-[#21262d] h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all"
                  style={{ width: `${topic.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Submissions Table */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 shadow-lg">
        <h2 className="text-base font-bold text-white mb-4">Recent Submissions</h2>
        {recentSubmissions.length === 0 ? (
          <div className="py-8 text-center text-gray-400 text-sm">No submissions recorded yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-gray-400 bg-[#0d1117] border-b border-[#30363d]">
                <tr>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Problem</th>
                  <th className="px-4 py-3">Language</th>
                  <th className="px-4 py-3">Runtime</th>
                  <th className="px-4 py-3">Passed</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#30363d]/50 text-gray-300">
                {recentSubmissions.slice(0, 10).map((sub: any) => (
                  <tr 
                    key={sub.id} 
                    onClick={() => onOpenProblem(sub.problem_slug)}
                    className="hover:bg-[#21262d]/50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        sub.status === 'Accepted'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-white">{sub.problem_title || sub.problem_slug}</td>
                    <td className="px-4 py-3 uppercase text-xs font-mono">{sub.language}</td>
                    <td className="px-4 py-3 text-xs">{sub.runtime_ms} ms</td>
                    <td className="px-4 py-3 text-xs">{sub.test_cases_passed} / {sub.total_test_cases}</td>
                    <td className="px-4 py-3 text-xs text-gray-400">{new Date(sub.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

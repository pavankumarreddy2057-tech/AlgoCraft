import React, { useState, useEffect } from 'react';
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  Brain, 
  Tag, 
  ChevronRight, 
  RotateCcw, 
  ArrowUpDown, 
  Filter,
  Sparkles,
  Bookmark
} from 'lucide-react';
import { ProblemListItem, Difficulty, ProblemStatus } from '../types/index.js';
import { fetchProblems, fetchTags, toggleReviewFlag } from '../lib/api.js';

interface ProblemBrowserProps {
  onSelectProblem: (slug: string) => void;
  onNavigateReview: () => void;
}

export const ProblemBrowser: React.FC<ProblemBrowserProps> = ({
  onSelectProblem,
  onNavigateReview
}) => {
  const [problems, setProblems] = useState<ProblemListItem[]>([]);
  const [tags, setTags] = useState<Array<{ name: string; count: number }>>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [probRes, tagRes] = await Promise.all([
        fetchProblems({
          difficulty: selectedDifficulty,
          tag: selectedTag,
          status: selectedStatus,
          search: searchQuery
        }),
        fetchTags()
      ]);
      setProblems(probRes.problems);
      setTags(tagRes);
    } catch (err: any) {
      console.error('Failed to load problems:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedDifficulty, selectedTag, selectedStatus, searchQuery]);

  const handleToggleBookmark = async (e: React.MouseEvent, slug: string) => {
    e.stopPropagation();
    try {
      const isFlagged = await toggleReviewFlag(slug);
      setProblems(prev => prev.map(p => p.slug === slug ? { ...p, flagged_review: isFlagged ? 1 : 0 } : p));
    } catch (err: any) {
      console.error('Error toggling flag:', err);
    }
  };

  const dueProblemsCount = problems.filter(p => {
    if (p.flagged_review === 1) return true;
    if (p.next_review_at && new Date(p.next_review_at) <= new Date()) return true;
    return false;
  }).length;

  return (
    <div className="flex-1 overflow-y-auto p-6 max-w-7xl mx-auto w-full space-y-6">
      {/* Daily Review Reminder Banner */}
      {dueProblemsCount > 0 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900/40 via-[#1e222d] to-indigo-900/30 border border-purple-500/30 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                {dueProblemsCount} Problem(s) Due for Spaced Repetition Today!
              </h3>
              <p className="text-xs text-gray-400">
                Reinforce algorithmic patterns before you forget them with SM-2 intervals.
              </p>
            </div>
          </div>

          <button
            onClick={onNavigateReview}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold shadow-md transition-colors flex items-center gap-1.5 shrink-0"
          >
            Start Daily Review
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search problems by title, tags, keywords..."
              className="w-full pl-10 pr-4 py-2 bg-[#0d1117] border border-[#30363d] rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Difficulty Pills */}
          <div className="flex items-center bg-[#0d1117] border border-[#30363d] rounded-xl p-1 shrink-0">
            {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  selectedDifficulty === diff
                    ? diff === 'Easy'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : diff === 'Medium'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : diff === 'Hard'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'bg-[#21262d] text-white'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>

          {/* Status Dropdown */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-xl text-xs font-semibold text-gray-300 focus:outline-none focus:border-emerald-500 shrink-0"
          >
            <option value="All">All Statuses</option>
            <option value="Solved">Solved</option>
            <option value="Attempted">Attempted</option>
            <option value="Todo">Todo / Unsolved</option>
          </select>
        </div>

        {/* Tag Filters Scrollable Row */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1">
          <button
            onClick={() => setSelectedTag('All')}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg shrink-0 transition-colors ${
              selectedTag === 'All'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-[#0d1117] border border-[#30363d] text-gray-400 hover:text-gray-200'
            }`}
          >
            All Topics
          </button>
          {tags.map((t) => (
            <button
              key={t.name}
              onClick={() => setSelectedTag(t.name === selectedTag ? 'All' : t.name)}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg shrink-0 flex items-center gap-1.5 transition-colors ${
                selectedTag === t.name
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-[#0d1117] border border-[#30363d] text-gray-400 hover:text-gray-200'
              }`}
            >
              <span>{t.name}</span>
              <span className="text-[10px] text-gray-500 font-mono">({t.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Problems Data Table */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl shadow-xl overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-gray-400">Loading problem bank...</div>
        ) : problems.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            No problems match your current filters.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#30363d] bg-[#1e222d] text-[11px] font-bold uppercase tracking-wider text-gray-400 select-none">
                <th className="w-12 px-4 py-3.5 text-center">Status</th>
                <th className="px-4 py-3.5">Title</th>
                <th className="w-28 px-4 py-3.5">Difficulty</th>
                <th className="px-4 py-3.5 hidden md:table-cell">Tags</th>
                <th className="w-36 px-4 py-3.5 hidden lg:table-cell text-center">Spaced Repetition</th>
                <th className="w-24 px-4 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#30363d]/50 text-sm">
              {problems.map((prob) => {
                const isDue = prob.flagged_review === 1 || (prob.next_review_at && new Date(prob.next_review_at) <= new Date());
                return (
                  <tr
                    key={prob.slug}
                    onClick={() => onSelectProblem(prob.slug)}
                    className="hover:bg-[#21262d]/60 cursor-pointer transition-colors group"
                  >
                    {/* Status Column */}
                    <td className="px-4 py-3.5 text-center">
                      {prob.status === 'Solved' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
                      ) : prob.status === 'Attempted' ? (
                        <div className="w-3.5 h-3.5 rounded-full border-2 border-amber-400 mx-auto" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border border-gray-600 mx-auto group-hover:border-gray-400" />
                      )}
                    </td>

                    {/* Title & Bookmark Flag */}
                    <td className="px-4 py-3.5 font-medium text-white group-hover:text-emerald-400 transition-colors">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => handleToggleBookmark(e, prob.slug)}
                          className={`p-1 rounded hover:bg-[#30363d] ${
                            prob.flagged_review ? 'text-amber-400' : 'text-gray-600 hover:text-gray-400'
                          }`}
                          title={prob.flagged_review ? 'Flagged for Review' : 'Bookmark for Review'}
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${prob.flagged_review ? 'fill-amber-400' : ''}`} />
                        </button>
                        <span>{prob.id}. {prob.title}</span>
                      </div>
                    </td>

                    {/* Difficulty */}
                    <td className="px-4 py-3.5">
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded ${
                          prob.difficulty === 'Easy'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : prob.difficulty === 'Medium'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {prob.difficulty}
                      </span>
                    </td>

                    {/* Tags */}
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {prob.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-[11px] px-2 py-0.5 rounded-md bg-[#0d1117] text-gray-400 border border-[#30363d]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Spaced Repetition Indicator */}
                    <td className="px-4 py-3.5 hidden lg:table-cell text-center text-xs">
                      {isDue ? (
                        <span className="inline-flex items-center gap-1 text-purple-400 font-semibold px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 animate-pulse">
                          <Brain className="w-3 h-3" />
                          Due Today
                        </span>
                      ) : prob.interval_days > 1 ? (
                        <span className="text-gray-400 text-xs font-mono">
                          {prob.interval_days}d interval
                        </span>
                      ) : (
                        <span className="text-gray-600 text-xs">—</span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="px-4 py-3.5 text-right">
                      <span className="text-xs font-bold text-gray-400 group-hover:text-white flex items-center justify-end gap-1">
                        Solve
                        <ChevronRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-emerald-400" />
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

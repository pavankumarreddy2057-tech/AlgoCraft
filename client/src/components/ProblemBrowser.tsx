import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  CheckCircle2, 
  Brain, 
  Tag, 
  ChevronRight, 
  Filter,
  Sparkles,
  Bookmark,
  Building2,
  ListFilter,
  Flame,
  Award,
  Layers,
  Code2
} from 'lucide-react';
import { ProblemListItem } from '../types/index.js';
import { fetchProblems, fetchTags, toggleBookmark } from '../lib/api.js';

interface ProblemBrowserProps {
  onSelectProblem: (slug: string) => void;
  onNavigateReview: () => void;
}

const CURATED_TRACKS = [
  { id: 'all', label: 'All Problems', icon: Layers },
  { id: 'blind75', label: 'Blind 75', icon: Flame },
  { id: 'neetcode150', label: 'NeetCode 150', icon: Award },
  { id: 'faang', label: 'Top FAANG', icon: Building2 },
  { id: 'sql', label: 'SQL 50 Mastery', icon: Code2 },
];

const POPULAR_COMPANIES = [
  'Google', 'Meta', 'Amazon', 'Microsoft', 'Apple', 'Uber', 'Netflix', 'Bloomberg'
];

export const ProblemBrowser: React.FC<ProblemBrowserProps> = ({
  onSelectProblem,
  onNavigateReview
}) => {
  const [problems, setProblems] = useState<ProblemListItem[]>([]);
  const [tags, setTags] = useState<Array<{ name: string; count: number }>>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [activeTrack, setActiveTrack] = useState<string>('all');
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
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
      const res = await toggleBookmark(slug);
      setProblems(prev => prev.map(p => p.slug === slug ? { ...p, flagged_review: res.isBookmarked ? 1 : 0 } : p));
    } catch (err: any) {
      console.error('Error toggling bookmark:', err);
    }
  };

  // Filter problems client-side for curated tracks & company tags
  const filteredProblems = useMemo(() => {
    return problems.filter(p => {
      // 1. Curated Track Filter
      if (activeTrack === 'blind75') {
        const isBlind75 = p.tags.some(t => t.toLowerCase().includes('blind 75'));
        if (!isBlind75) return false;
      } else if (activeTrack === 'neetcode150') {
        const isNeet = p.tags.some(t => t.toLowerCase().includes('neetcode') || t.toLowerCase().includes('blind 75'));
        if (!isNeet) return false;
      } else if (activeTrack === 'faang') {
        const isFaang = p.tags.some(t => ['google', 'meta', 'amazon', 'microsoft', 'apple'].includes(t.toLowerCase()));
        if (!isFaang) return false;
      } else if (activeTrack === 'sql') {
        const isSql = p.tags.some(t => t.toLowerCase().includes('sql'));
        if (!isSql) return false;
      }

      // 2. Company Tag Filter
      if (selectedCompany) {
        const hasCompany = p.tags.some(t => t.toLowerCase() === selectedCompany.toLowerCase());
        if (!hasCompany) return false;
      }

      return true;
    });
  }, [problems, activeTrack, selectedCompany]);

  const dueProblemsCount = problems.filter(p => {
    if (p.flagged_review === 1) return true;
    if (p.next_review_at && new Date(p.next_review_at) <= new Date()) return true;
    return false;
  }).length;

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 max-w-7xl mx-auto w-full space-y-6">
      
      {/* 1. Daily Review Reminder Banner */}
      {dueProblemsCount > 0 && (
        <div className="p-4 md:p-5 rounded-2xl bg-gradient-to-r from-purple-950/60 via-[#181d28] to-indigo-950/40 border border-purple-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30 shrink-0">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-100 flex items-center gap-2">
                <span>{dueProblemsCount} Problem(s) Due for Review</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  SM-2 Algorithm
                </span>
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Practice today to lock algorithmic patterns into your long-term memory.
              </p>
            </div>
          </div>

          <button
            onClick={onNavigateReview}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/20 transition-colors flex items-center gap-1.5 shrink-0 self-end sm:self-auto"
          >
            <span>Start Review</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. Curated Tracks Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none select-none">
        {CURATED_TRACKS.map(track => {
          const Icon = track.icon;
          const isActive = activeTrack === track.id;
          return (
            <button
              key={track.id}
              onClick={() => setActiveTrack(track.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all shrink-0 ${
                isActive
                  ? 'bg-blue-600/15 border-blue-500/40 text-blue-400 shadow-sm shadow-blue-500/10'
                  : 'bg-[#12161f] border-[#262d3d] text-gray-400 hover:text-gray-200 hover:border-gray-600'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{track.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Company Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 select-none text-xs">
        <span className="text-[11px] font-semibold text-gray-500 mr-1 shrink-0 flex items-center gap-1">
          <Building2 className="w-3.5 h-3.5" />
          Companies:
        </span>
        <button
          onClick={() => setSelectedCompany(null)}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition shrink-0 ${
            selectedCompany === null
              ? 'bg-[#262d3d] text-white font-semibold'
              : 'text-gray-400 hover:text-gray-200 hover:bg-[#1a202c]'
          }`}
        >
          All
        </button>
        {POPULAR_COMPANIES.map(company => {
          const isSel = selectedCompany === company;
          return (
            <button
              key={company}
              onClick={() => setSelectedCompany(isSel ? null : company)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition shrink-0 border ${
                isSel
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 font-semibold'
                  : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-[#1a202c]'
              }`}
            >
              {company}
            </button>
          );
        })}
      </div>

      {/* 4. Search and Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#12161f] p-3 rounded-2xl border border-[#262d3d]">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions by title, keyword, or concept..."
            className="w-full pl-10 pr-4 py-2 bg-[#0a0d12] border border-[#262d3d] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-xs text-gray-100 placeholder-gray-500 outline-none transition"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex items-center gap-2 overflow-x-auto">
          {/* Difficulty Filter */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-3 py-2 bg-[#0a0d12] border border-[#262d3d] rounded-xl text-xs text-gray-300 outline-none focus:border-blue-500 shrink-0 font-medium"
          >
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          {/* Tag Filter */}
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="px-3 py-2 bg-[#0a0d12] border border-[#262d3d] rounded-xl text-xs text-gray-300 outline-none focus:border-blue-500 shrink-0 max-w-[140px] font-medium"
          >
            <option value="All">All Categories</option>
            {tags.map(t => (
              <option key={t.name} value={t.name}>
                {t.name} ({t.count})
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-[#0a0d12] border border-[#262d3d] rounded-xl text-xs text-gray-300 outline-none focus:border-blue-500 shrink-0 font-medium"
          >
            <option value="All">All Statuses</option>
            <option value="Solved">Solved</option>
            <option value="Attempted">Attempted</option>
            <option value="Todo">Todo</option>
          </select>
        </div>
      </div>

      {/* 5. Problem List Table */}
      <div className="bg-[#12161f] border border-[#262d3d] rounded-2xl shadow-xl overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-gray-400 space-y-3">
            <div className="w-7 h-7 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <span>Filtering problem library...</span>
          </div>
        ) : filteredProblems.length === 0 ? (
          <div className="py-20 text-center space-y-2">
            <div className="text-sm font-bold text-gray-300">No problems found matching criteria</div>
            <p className="text-xs text-gray-500">Try clearing filters or searching with a different term.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#262d3d] bg-[#0a0d12]/50 text-gray-400 font-semibold select-none">
                  <th className="py-3.5 pl-4 w-12 text-center">Status</th>
                  <th className="py-3.5 px-3">Title & Concept</th>
                  <th className="py-3.5 px-3 w-28">Difficulty</th>
                  <th className="py-3.5 px-3 hidden sm:table-cell">Categories & Tags</th>
                  <th className="py-3.5 px-3 w-24 text-center hidden md:table-cell">SM-2 Review</th>
                  <th className="py-3.5 pr-4 w-12 text-center">Star</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2533]">
                {filteredProblems.map((p) => {
                  const isSolved = p.status === 'Solved';
                  const isBookmarked = p.flagged_review === 1;

                  return (
                    <tr
                      key={p.slug}
                      onClick={() => onSelectProblem(p.slug)}
                      className="hover:bg-[#181d28] cursor-pointer transition-colors group"
                    >
                      {/* Solved Status Checkmark */}
                      <td className="py-3.5 pl-4 text-center">
                        {isSolved ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto fill-emerald-500/10" />
                        ) : p.status === 'Attempted' ? (
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 mx-auto block" />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-gray-700 mx-auto block group-hover:bg-gray-500 transition-colors" />
                        )}
                      </td>

                      {/* Problem Title */}
                      <td className="py-3.5 px-3">
                        <div className="font-semibold text-gray-100 group-hover:text-blue-400 transition-colors">
                          {p.id}. {p.title}
                        </div>
                      </td>

                      {/* Difficulty Badge */}
                      <td className="py-3.5 px-3">
                        <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                          p.difficulty === 'Easy'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : p.difficulty === 'Medium'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        }`}>
                          {p.difficulty}
                        </span>
                      </td>

                      {/* Tags Chips */}
                      <td className="py-3.5 px-3 hidden sm:table-cell">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {p.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#0a0d12] text-gray-400 border border-[#262d3d]"
                            >
                              {tag}
                            </span>
                          ))}
                          {p.tags.length > 3 && (
                            <span className="text-[10px] text-gray-500">
                              +{p.tags.length - 3}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Spaced Repetition Metric */}
                      <td className="py-3.5 px-3 text-center hidden md:table-cell font-mono text-[11px] text-purple-400">
                        {p.interval_days > 1 ? `${p.interval_days}d` : '1d'}
                      </td>

                      {/* Bookmark / Star Toggle */}
                      <td className="py-3.5 pr-4 text-center">
                        <button
                          onClick={(e) => handleToggleBookmark(e, p.slug)}
                          className="p-1 text-gray-500 hover:text-amber-400 transition-colors"
                          title="Star / Bookmark problem"
                        >
                          <Bookmark className={`w-4 h-4 ${isBookmarked ? 'text-amber-400 fill-amber-400' : ''}`} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

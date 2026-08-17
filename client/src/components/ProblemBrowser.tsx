import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, 
  CheckCircle2, 
  Brain, 
  Tag, 
  ChevronRight, 
  ChevronDown,
  ChevronUp,
  Filter,
  Sparkles,
  Bookmark,
  Building2,
  ListFilter,
  Flame,
  Award,
  Layers,
  Code2,
  Clock,
  History,
  X,
  Star
} from 'lucide-react';
import { ProblemListItem } from '../types/index.js';
import { fetchProblems, fetchTags, toggleReviewFlag } from '../lib/api.js';

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

const SUGGESTED_SEARCHES = [
  'Dynamic Programming', 'Binary Tree', 'Two Pointers', 'Graph', 'Sliding Window', 'LRU Cache', 'SQL'
];

// Helper to assign semantic tag colors
function getTagColorClass(tag: string): string {
  const t = tag.toLowerCase();
  
  // Data Structures (Blue / Cyan)
  if (['array', 'matrix', 'string', 'linked list', 'stack', 'queue', 'tree', 'trees', 'binary tree', 'heap', 'hash table', 'graph', 'graphs', 'trie'].includes(t)) {
    return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
  }
  
  // Techniques & Algorithms (Purple / Violet)
  if (['dynamic programming', 'dp', 'backtracking', 'two pointers', 'sliding window', 'binary search', 'greedy', 'bfs', 'dfs', 'divide and conquer', 'recursion', 'bit manipulation', 'math'].includes(t)) {
    return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
  }
  
  // Curated Lists & Database (Emerald / Teal)
  if (['blind 75', 'neetcode 150', 'sql', 'database', 'sql 50'].some(c => t.includes(c))) {
    return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  }
  
  // Companies (Amber / Orange)
  if (['google', 'meta', 'amazon', 'microsoft', 'apple', 'uber', 'netflix', 'bloomberg', 'adobe', 'doordash', 'linkedin'].includes(t)) {
    return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
  }
  
  return 'bg-[#1a202c] text-gray-300 border-[#262d3d]';
}

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

  // Search suggestions dropdown & recent searches state
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('algocraft_recent_searches');
      return saved ? JSON.parse(saved) : ['Two Sum', 'Blind 75', 'Dynamic Programming'];
    } catch {
      return ['Two Sum', 'Blind 75', 'Dynamic Programming'];
    }
  });

  // Track expanded tags per problem slug
  const [expandedTags, setExpandedTags] = useState<Record<string, boolean>>({});

  const searchContainerRef = useRef<HTMLDivElement>(null);

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

  // Click outside search suggestion box
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectSearchSuggestion = (term: string) => {
    setSearchQuery(term);
    setIsSearchFocused(false);
    saveRecentSearch(term);
  };

  const saveRecentSearch = (term: string) => {
    if (!term.trim()) return;
    setRecentSearches(prev => {
      const updated = [term.trim(), ...prev.filter(s => s.toLowerCase() !== term.trim().toLowerCase())].slice(0, 5);
      try {
        localStorage.setItem('algocraft_recent_searches', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleToggleBookmark = async (e: React.MouseEvent, slug: string) => {
    e.stopPropagation();
    try {
      // Connect star directly to SM-2 review queue
      const isFlagged = await toggleReviewFlag(slug);
      setProblems(prev => prev.map(p => p.slug === slug ? { ...p, flagged_review: isFlagged ? 1 : 0 } : p));
    } catch (err: any) {
      console.error('Error toggling bookmark / SM-2 review:', err);
    }
  };

  const toggleTagExpand = (e: React.MouseEvent, slug: string) => {
    e.stopPropagation();
    setExpandedTags(prev => ({ ...prev, [slug]: !prev[slug] }));
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

  // Helper to format SM-2 interval column
  const formatSM2Interval = (p: ProblemListItem) => {
    if (p.flagged_review === 1) {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
          Due
        </span>
      );
    }
    if (p.interval_days !== null && p.interval_days !== undefined && p.repetition_count && p.repetition_count > 0) {
      return (
        <span className="font-mono text-purple-300 font-semibold">
          {p.interval_days}d
        </span>
      );
    }
    if (p.status === 'Solved') {
      return <span className="text-gray-400 font-mono text-[11px]">1d</span>;
    }
    return <span className="text-gray-600 font-mono text-xs">—</span>;
  };

  // Helper to render clear 3-state status indicator
  const renderStatusIndicator = (status: string) => {
    if (status === 'Solved') {
      return (
        <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-sm shadow-emerald-500/20 mx-auto" title="Solved">
          <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-500/20" />
        </div>
      );
    }
    if (status === 'Attempted') {
      return (
        <div className="w-5 h-5 rounded-full bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto" title="Attempted">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        </div>
      );
    }
    return (
      <div className="w-5 h-5 rounded-full border border-gray-700 hover:border-gray-500 flex items-center justify-center mx-auto transition" title="Not Started">
        <div className="w-1 h-1 rounded-full bg-gray-600" />
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto p-3 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-5">
      
      {/* 1. Daily Review Reminder Banner */}
      {dueProblemsCount > 0 && (
        <div className="p-4 md:p-5 rounded-2xl bg-gradient-to-r from-purple-950/60 via-[#181d28] to-indigo-950/40 border border-purple-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30 shrink-0">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-100 flex items-center gap-2">
                <span>{dueProblemsCount} Problem(s) Ready for Spaced Review</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  SM-2
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

      {/* 4. Search and Filter Bar with Autocomplete Suggestions */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#12161f] p-3 rounded-2xl border border-[#262d3d] relative">
        
        {/* Search Input Container */}
        <div ref={searchContainerRef} className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onFocus={() => setIsSearchFocused(true)}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                saveRecentSearch(searchQuery);
                setIsSearchFocused(false);
              }
            }}
            placeholder="Search problems by title, keyword, data structure, or concept..."
            className="w-full pl-10 pr-8 py-2 bg-[#0a0d12] border border-[#262d3d] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-xs text-gray-100 placeholder-gray-500 outline-none transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Autocomplete / Recent Search Dropdown */}
          {isSearchFocused && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-[#12161f] border border-[#262d3d] rounded-2xl shadow-2xl z-40 p-3 space-y-3 animate-in fade-in zoom-in-95 duration-150">
              {/* Suggested Topics */}
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-blue-400" />
                  <span>Popular Algorithmic Topics</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_SEARCHES.map(topic => (
                    <button
                      key={topic}
                      onMouseDown={() => handleSelectSearchSuggestion(topic)}
                      className="px-2.5 py-1 rounded-lg text-xs bg-[#0a0d12] hover:bg-[#1a202c] text-gray-300 hover:text-blue-400 border border-[#262d3d] transition"
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5 flex items-center gap-1">
                    <History className="w-3 h-3 text-amber-400" />
                    <span>Recent Searches</span>
                  </div>
                  <div className="space-y-1">
                    {recentSearches.map(term => (
                      <div
                        key={term}
                        onMouseDown={() => handleSelectSearchSuggestion(term)}
                        className="flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-[#1a202c] text-xs text-gray-300 cursor-pointer transition"
                      >
                        <span className="flex items-center gap-2">
                          <Search className="w-3 h-3 text-gray-500" />
                          <span>{term}</span>
                        </span>
                        <span className="text-[10px] text-gray-500">Search</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
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

      {/* ========================================================================= */}
      {/* 5A. Mobile Stacked Cards View (Screens < md) */}
      {/* ========================================================================= */}
      <div className="md:hidden space-y-3">
        {loading ? (
          <div className="py-20 text-center text-xs text-gray-400 space-y-3">
            <div className="w-7 h-7 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <span>Loading problems...</span>
          </div>
        ) : filteredProblems.length === 0 ? (
          <div className="py-16 text-center space-y-2 bg-[#12161f] border border-[#262d3d] rounded-2xl p-6">
            <div className="text-sm font-bold text-gray-300">No problems found</div>
            <p className="text-xs text-gray-500">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          filteredProblems.map((p) => {
            const isExpanded = !!expandedTags[p.slug];
            const isBookmarked = p.flagged_review === 1;

            return (
              <div
                key={p.slug}
                onClick={() => onSelectProblem(p.slug)}
                className="p-4 bg-[#12161f] border border-[#262d3d] rounded-2xl space-y-3 hover:border-gray-500 transition active:scale-[0.99] cursor-pointer"
              >
                {/* Header: Status + Title + Star */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5 shrink-0">
                      {renderStatusIndicator(p.status)}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-100">
                        {p.id}. {p.title}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleToggleBookmark(e, p.slug)}
                    className="p-1 text-gray-500 hover:text-amber-400 transition-colors shrink-0"
                    title="Add / Remove from Spaced Repetition Review"
                  >
                    <Bookmark className={`w-4 h-4 ${isBookmarked ? 'text-amber-400 fill-amber-400' : ''}`} />
                  </button>
                </div>

                {/* Sub-row: Difficulty Badge + Category Tags */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                    p.difficulty === 'Easy'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : p.difficulty === 'Medium'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                  }`}>
                    {p.difficulty}
                  </span>

                  {(isExpanded ? p.tags : p.tags.slice(0, 2)).map((tag) => (
                    <span
                      key={tag}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-medium border ${getTagColorClass(tag)}`}
                    >
                      {tag}
                    </span>
                  ))}

                  {p.tags.length > 2 && (
                    <button
                      onClick={(e) => toggleTagExpand(e, p.slug)}
                      className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#1a202c] text-blue-400 hover:bg-[#262d3d] border border-[#262d3d] transition"
                    >
                      {isExpanded ? 'Hide' : `+${p.tags.length - 2}`}
                    </button>
                  )}
                </div>

                {/* Footer Info: Review State */}
                <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1 border-t border-[#1e2533]">
                  <div className="flex items-center gap-1.5">
                    <Brain className="w-3 h-3 text-purple-400" />
                    <span>SM-2 Interval:</span>
                    {formatSM2Interval(p)}
                  </div>
                  <span className="text-blue-400 font-semibold flex items-center gap-0.5">
                    Solve <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ========================================================================= */}
      {/* 5B. Desktop High-Density Table View (Screens >= md) */}
      {/* ========================================================================= */}
      <div className="hidden md:block bg-[#12161f] border border-[#262d3d] rounded-2xl shadow-xl overflow-hidden">
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
                  <th className="py-3.5 px-3">Categories & Tags</th>
                  <th className="py-3.5 px-3 w-28 text-center">SM-2 Review</th>
                  <th className="py-3.5 pr-4 w-12 text-center">Review</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2533]">
                {filteredProblems.map((p) => {
                  const isBookmarked = p.flagged_review === 1;
                  const isExpanded = !!expandedTags[p.slug];

                  return (
                    <tr
                      key={p.slug}
                      onClick={() => onSelectProblem(p.slug)}
                      className="hover:bg-[#181d28] cursor-pointer transition-colors group"
                    >
                      {/* 3-State Status Indicator */}
                      <td className="py-3.5 pl-4 text-center">
                        {renderStatusIndicator(p.status)}
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

                      {/* Color-Coded & Expandable Tags Chips */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {(isExpanded ? p.tags : p.tags.slice(0, 3)).map((tag) => (
                            <span
                              key={tag}
                              className={`px-2 py-0.5 rounded-md text-[10px] font-medium border ${getTagColorClass(tag)}`}
                            >
                              {tag}
                            </span>
                          ))}
                          
                          {p.tags.length > 3 && (
                            <button
                              onClick={(e) => toggleTagExpand(e, p.slug)}
                              className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#1a202c] text-blue-400 hover:bg-[#262d3d] border border-[#262d3d] transition cursor-pointer"
                              title={isExpanded ? "Collapse tags" : "Expand all tags"}
                            >
                              {isExpanded ? 'Hide' : `+${p.tags.length - 3}`}
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Corrected SM-2 Spaced Repetition Metric */}
                      <td className="py-3.5 px-3 text-center">
                        {formatSM2Interval(p)}
                      </td>

                      {/* Star / Bookmark Review Toggle */}
                      <td className="py-3.5 pr-4 text-center">
                        <button
                          onClick={(e) => handleToggleBookmark(e, p.slug)}
                          className="p-1 text-gray-500 hover:text-amber-400 transition-colors"
                          title={isBookmarked ? "Remove from Spaced Repetition queue" : "Add to Spaced Repetition queue"}
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

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
  Star,
  RefreshCw
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

// Canonical Blind 75 Slugs Set
const BLIND_75_SLUGS = new Set([
  'two-sum', 'valid-anagram', 'group-anagrams', 'top-k-frequent-elements', 'product-of-array-except-self', 
  'longest-consecutive-sequence', 'valid-palindrome', '3sum', 'container-with-most-water', 
  'best-time-to-buy-and-sell-stock', 'longest-substring-without-repeating-characters', 
  'longest-repeating-character-replacement', 'minimum-window-substring', 'valid-parentheses', 
  'find-minimum-in-rotated-sorted-array', 'search-in-rotated-sorted-array', 'reverse-linked-list', 
  'merge-two-sorted-lists', 'linked-list-cycle', 'merge-k-sorted-lists', 'remove-nth-node-from-end-of-list', 
  'reorder-list', 'invert-binary-tree', 'maximum-depth-of-binary-tree', 'same-tree', 'subtree-of-another-tree', 
  'lowest-common-ancestor-of-a-binary-search-tree', 'binary-tree-level-order-traversal', 
  'validate-binary-search-tree', 'kth-smallest-element-in-a-bst', 
  'construct-binary-tree-from-preorder-and-inorder-traversal', 'binary-tree-maximum-path-sum', 
  'serialize-and-deserialize-binary-tree', 'find-median-from-data-stream', 'combination-sum', 
  'word-search', 'number-of-islands', 'clone-graph', 'pacific-atlantic-water-flow', 'course-schedule', 
  'number-of-connected-components-in-an-undirected-graph', 'graph-valid-tree', 'climbing-stairs', 
  'coin-change', 'longest-increasing-subsequence', 'word-break', 'combination-sum-iv', 'house-robber', 
  'house-robber-ii', 'decode-ways', 'unique-paths', 'jump-game', 'insert-interval', 'merge-intervals', 
  'non-overlapping-intervals', 'meeting-rooms', 'meeting-rooms-ii', 'rotate-image', 'set-matrix-zeroes', 
  'spiral-matrix', 'number-of-1-bits', 'counting-bits', 'reverse-bits', 'missing-number', 'sum-of-two-integers'
]);

// Canonical FAANG & High-Frequency Company Mappings
const COMPANY_SLUGS_MAP: Record<string, string[]> = {
  google: [
    'two-sum', 'course-schedule', 'lru-cache', 'word-ladder', 'merge-k-sorted-lists', 'trapping-rain-water',
    'median-of-two-sorted-arrays', 'number-of-islands', 'word-search', 'bus-routes', 'alien-dictionary',
    'network-delay-time', 'coin-change', 'edit-distance', 'evaluate-division', 'sliding-window-maximum',
    'k-closest-points-to-origin', 'longest-increasing-subsequence', 'maximum-subarray', 'group-anagrams'
  ],
  meta: [
    '3sum', 'subarray-sum-equals-k', 'kth-largest-element-in-an-array', 'lowest-common-ancestor-of-a-binary-search-tree',
    'merge-intervals', 'product-of-array-except-self', 'valid-palindrome', 'binary-tree-vertical-order-traversal',
    'binary-tree-right-side-view', 'simplify-path', 'word-break', 'clone-graph', 'add-strings', 'valid-parentheses',
    'minimum-remove-to-make-valid-parentheses', 'next-permutation'
  ],
  amazon: [
    'lru-cache', 'top-k-frequent-elements', 'k-closest-points-to-origin', 'meeting-rooms-ii', 'course-schedule-ii',
    'word-break', 'coin-change', 'reorganize-string', 'task-scheduler', 'rotting-oranges', 'number-of-islands',
    'critical-connections-in-a-network', 'merge-k-sorted-lists', 'two-sum', 'trapping-rain-water', 'search-a-2d-matrix'
  ],
  microsoft: [
    'reverse-linked-list', 'lru-cache', 'group-anagrams', 'valid-parentheses', 'rotate-image', 'spiral-matrix',
    'design-add-and-search-words-data-structure', 'longest-palindromic-substring', 'search-in-rotated-sorted-array',
    'min-stack', 'set-matrix-zeroes', 'binary-tree-zigzag-level-order-traversal', 'merge-two-sorted-lists'
  ],
  apple: [
    'two-sum', 'container-with-most-water', 'search-in-rotated-sorted-array', 'climbing-stairs',
    'best-time-to-buy-and-sell-stock', 'jump-game', 'min-stack', 'intersection-of-two-linked-lists',
    'invert-binary-tree', 'reverse-bits', 'valid-anagram'
  ],
  uber: [
    'cheapest-flights-within-k-stops', 'network-delay-time', 'merge-intervals', 'insert-interval',
    'meeting-rooms-ii', 'course-schedule', 'number-of-islands', 'word-ladder', 'lru-cache', 'reorder-list'
  ],
  netflix: [
    'longest-substring-without-repeating-characters', 'sliding-window-maximum', 'find-median-from-data-stream',
    'lru-cache', 'task-scheduler', 'longest-consecutive-sequence', 'group-anagrams', 'subsets'
  ],
  bloomberg: [
    'min-stack', 'daily-temperatures', 'evaluate-reverse-polish-notation', 'top-k-frequent-words',
    'valid-parentheses', 'two-sum', 'group-anagrams', 'design-underground-system', 'string-compression'
  ]
};

// Helper to assign semantic tag colors
function getTagColorClass(tag: string): string {
  if (!tag) return 'bg-[#1a202c] text-gray-300 border-[#262d3d]';
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
        fetchTags().catch(() => [])
      ]);
      setProblems(probRes?.problems || []);
      setTags(tagRes || []);
    } catch (err: any) {
      console.error('Failed to load problems:', err);
      setProblems([]);
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
    if (!Array.isArray(problems)) return [];
    return problems.filter(p => {
      const pTags = Array.isArray(p.tags) ? p.tags : [];
      const slug = p.slug.toLowerCase();

      // 1. Curated Track Filter
      if (activeTrack === 'blind75') {
        const isBlind75 = BLIND_75_SLUGS.has(slug) || pTags.some(t => t.toLowerCase().includes('blind 75'));
        if (!isBlind75) return false;
      } else if (activeTrack === 'neetcode150') {
        // NeetCode 150 includes all algorithmic curriculum questions (non-SQL)
        const isSql = pTags.some(t => t.toLowerCase().includes('sql') || t.toLowerCase().includes('database'));
        if (isSql) return false;
      } else if (activeTrack === 'faang') {
        // FAANG questions
        const isFaang = Object.values(COMPANY_SLUGS_MAP).some(slugList => slugList.includes(slug)) ||
                        pTags.some(t => ['google', 'meta', 'amazon', 'microsoft', 'apple', 'uber', 'netflix'].includes(t.toLowerCase()));
        if (!isFaang) return false;
      } else if (activeTrack === 'sql') {
        const isSql = pTags.some(t => t.toLowerCase().includes('sql') || t.toLowerCase().includes('database')) || slug.includes('sql');
        if (!isSql) return false;
      }

      // 2. Company Tag Filter
      if (selectedCompany) {
        const compKey = selectedCompany.toLowerCase();
        const compSlugs = COMPANY_SLUGS_MAP[compKey] || [];
        const matchesCompany = compSlugs.includes(slug) || pTags.some(t => t.toLowerCase() === compKey);
        if (!matchesCompany) return false;
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
        <span className="inline-flex items-center gap-1 font-semibold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/30 text-[10px]">
          <Brain className="w-3 h-3 text-purple-400" />
          <span>Due</span>
        </span>
      );
    }
    if (p.interval_days !== null && p.interval_days !== undefined && p.interval_days > 0) {
      return (
        <span className="font-mono text-gray-300 text-xs">
          {p.interval_days}d
        </span>
      );
    }
    return (
      <span className="text-gray-600 font-mono text-xs">
        —
      </span>
    );
  };

  // 3-State Status indicator
  const renderStatusIndicator = (status: 'Solved' | 'Attempted' | 'Todo') => {
    if (status === 'Solved') {
      return (
        <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-sm shadow-emerald-500/20" title="Solved">
          <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-400/20" />
        </div>
      );
    }
    if (status === 'Attempted') {
      return (
        <div className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400" title="Attempted (Not yet accepted)">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        </div>
      );
    }
    return (
      <div className="w-5 h-5 rounded-full border border-gray-700/80 flex items-center justify-center" title="Todo (Not started)">
        <div className="w-1 h-1 rounded-full bg-gray-700" />
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-[#0a0d12] p-3 sm:p-6 lg:p-8 space-y-6">
      
      {/* 1. Curated Tracks Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {CURATED_TRACKS.map(track => {
          const Icon = track.icon;
          const isActive = activeTrack === track.id;
          return (
            <button
              key={track.id}
              onClick={() => {
                setActiveTrack(track.id);
                setSelectedCompany(null);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 border ${
                isActive
                  ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20'
                  : 'bg-[#12161f] border-[#262d3d] text-gray-400 hover:text-gray-200 hover:border-gray-600'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
              <span>{track.label}</span>
            </button>
          );
        })}
      </div>

      {/* 2. Top Company Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
          <Building2 className="w-3 h-3 text-amber-400" />
          <span>Companies:</span>
        </span>
        {POPULAR_COMPANIES.map(comp => {
          const isSelected = selectedCompany?.toLowerCase() === comp.toLowerCase();
          return (
            <button
              key={comp}
              onClick={() => {
                setSelectedCompany(isSelected ? null : comp);
                if (!isSelected) setActiveTrack('all');
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition border shrink-0 ${
                isSelected
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-sm'
                  : 'bg-[#0a0d12] border-[#262d3d] text-gray-400 hover:text-gray-200 hover:border-gray-600'
              }`}
            >
              {comp}
            </button>
          );
        })}
      </div>

      {/* 3. Search Bar + Dropdown Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        
        {/* Search with Autocomplete */}
        <div ref={searchContainerRef} className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
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
            <option value="Unsolved">Todo</option>
          </select>
        </div>
      </div>

      {/* 4. Filter Summary / Counter Bar */}
      <div className="flex items-center justify-between text-xs text-gray-400 px-1">
        <div>
          Showing <span className="font-bold text-gray-100">{filteredProblems.length}</span> questions
          {activeTrack !== 'all' && (
            <span> in <span className="text-blue-400 font-semibold">{CURATED_TRACKS.find(t => t.id === activeTrack)?.label}</span></span>
          )}
          {selectedCompany && (
            <span> asked at <span className="text-amber-400 font-semibold">{selectedCompany}</span></span>
          )}
        </div>

        {dueProblemsCount > 0 && (
          <button
            onClick={onNavigateReview}
            className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1.5 transition"
          >
            <Brain className="w-3.5 h-3.5" />
            <span>{dueProblemsCount} Review Cards Due</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
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
            const pTags = Array.isArray(p.tags) ? p.tags : [];

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

                  {(isExpanded ? pTags : pTags.slice(0, 2)).map((tag) => (
                    <span
                      key={tag}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-medium border ${getTagColorClass(tag)}`}
                    >
                      {tag}
                    </span>
                  ))}

                  {pTags.length > 2 && (
                    <button
                      onClick={(e) => toggleTagExpand(e, p.slug)}
                      className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#1a202c] text-blue-400 hover:bg-[#262d3d] border border-[#262d3d] transition"
                    >
                      {isExpanded ? 'Hide' : `+${pTags.length - 2}`}
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
            <p className="text-xs text-gray-500">Try loosening your search or filter tags.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#262d3d] bg-[#161b22] text-gray-400 font-semibold select-none">
                  <th className="py-3 px-4 w-12 text-center">Status</th>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4 w-28">Difficulty</th>
                  <th className="py-3 px-4">Category Tags</th>
                  <th className="py-3 px-4 w-32">SM-2 Review</th>
                  <th className="py-3 px-4 w-12 text-center">Star</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2533]">
                {filteredProblems.map((p) => {
                  const isExpanded = !!expandedTags[p.slug];
                  const isBookmarked = p.flagged_review === 1;
                  const pTags = Array.isArray(p.tags) ? p.tags : [];

                  return (
                    <tr
                      key={p.slug}
                      onClick={() => onSelectProblem(p.slug)}
                      className="hover:bg-[#181d28] transition group cursor-pointer"
                    >
                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex justify-center">
                          {renderStatusIndicator(p.status)}
                        </div>
                      </td>

                      {/* Title */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-gray-100 group-hover:text-blue-400 transition-colors flex items-center gap-2">
                          <span>{p.id}. {p.title}</span>
                        </div>
                      </td>

                      {/* Difficulty */}
                      <td className="py-3.5 px-4">
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

                      {/* Category Tags with expandable chips */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap items-center gap-1.5 max-w-lg">
                          {(isExpanded ? pTags : pTags.slice(0, 3)).map((tag) => (
                            <span
                              key={tag}
                              className={`px-2 py-0.5 rounded-md text-[10px] font-medium border ${getTagColorClass(tag)}`}
                            >
                              {tag}
                            </span>
                          ))}

                          {pTags.length > 3 && (
                            <button
                              onClick={(e) => toggleTagExpand(e, p.slug)}
                              className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#0a0d12] text-blue-400 hover:bg-[#1a202c] border border-[#262d3d] transition"
                            >
                              {isExpanded ? 'Hide' : `+${pTags.length - 3}`}
                            </button>
                          )}
                        </div>
                      </td>

                      {/* SM-2 Review Interval */}
                      <td className="py-3.5 px-4">
                        {formatSM2Interval(p)}
                      </td>

                      {/* Bookmark Star Toggle */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={(e) => handleToggleBookmark(e, p.slug)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-amber-400 hover:bg-[#1a202c] transition-colors"
                          title={isBookmarked ? "Remove from Spaced Repetition Review" : "Add to Spaced Repetition Review"}
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

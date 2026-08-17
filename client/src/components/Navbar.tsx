import React from 'react';
import { 
  Code2, 
  Flame, 
  Brain, 
  BarChart3, 
  FolderArchive, 
  Search, 
  CheckCircle2, 
  Layers,
  Briefcase
} from 'lucide-react';

interface NavbarProps {
  currentView: 'problems' | 'stats' | 'review';
  onNavigate: (view: 'problems' | 'stats' | 'review') => void;
  onOpenSearch: () => void;
  onOpenManager: () => void;
  onOpenInterview: () => void;
  streakCount: number;
  solvedCount: number;
  totalProblems: number;
  dueReviewsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenSearch,
  onOpenManager,
  onOpenInterview,
  streakCount,
  solvedCount,
  totalProblems,
  dueReviewsCount
}) => {
  return (
    <header className="h-14 border-b border-[#30363d] bg-[#161b22] px-4 flex items-center justify-between select-none z-30 shrink-0">
      {/* Brand & Logo */}
      <div className="flex items-center gap-6">
        <div 
          onClick={() => onNavigate('problems')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
              AlgoCraft
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Offline
              </span>
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1">
          <button
            onClick={() => onNavigate('problems')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
              currentView === 'problems'
                ? 'bg-[#21262d] text-white'
                : 'text-gray-400 hover:text-gray-200 hover:bg-[#21262d]/50'
            }`}
          >
            <Layers className="w-4 h-4" />
            Problems
          </button>

          <button
            onClick={() => onNavigate('review')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 relative ${
              currentView === 'review'
                ? 'bg-[#21262d] text-white'
                : 'text-gray-400 hover:text-gray-200 hover:bg-[#21262d]/50'
            }`}
          >
            <Brain className="w-4 h-4 text-purple-400" />
            Spaced Repetition
            {dueReviewsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[11px] font-bold bg-purple-500 text-white ml-1 animate-pulse">
                {dueReviewsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onNavigate('stats')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
              currentView === 'stats'
                ? 'bg-[#21262d] text-white'
                : 'text-gray-400 hover:text-gray-200 hover:bg-[#21262d]/50'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-sky-400" />
            Analytics
          </button>

          <button
            onClick={onOpenInterview}
            className="px-3 py-1.5 rounded-md text-sm font-medium text-purple-300 hover:text-white bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/30 transition-colors flex items-center gap-1.5 ml-1"
          >
            <Briefcase className="w-4 h-4 text-purple-400" />
            Mock Interview
          </button>
        </nav>
      </div>

      {/* Center Quick Search Trigger */}
      <button
        onClick={onOpenSearch}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#0d1117] border border-[#30363d] rounded-lg text-xs text-gray-400 hover:border-gray-500 hover:text-gray-200 transition-colors w-64 justify-between shadow-inner"
      >
        <span className="flex items-center gap-1.5">
          <Search className="w-3.5 h-3.5" />
          Quick Search...
        </span>
        <kbd className="px-1.5 py-0.5 text-[10px] font-semibold bg-[#21262d] text-gray-300 rounded border border-[#30363d]">
          Ctrl + K
        </kbd>
      </button>

      {/* Right Actions & Badges */}
      <div className="flex items-center gap-3">
        {/* Streak Counter */}
        <div 
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold"
          title={`${streakCount} day streak`}
        >
          <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span>{streakCount} {streakCount === 1 ? 'Day' : 'Days'}</span>
        </div>

        {/* Solved Counter */}
        <div 
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold"
          title={`${solvedCount} out of ${totalProblems} solved`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{solvedCount}/{totalProblems}</span>
        </div>

        {/* Problem Bank Manager */}
        <button
          onClick={onOpenManager}
          className="p-2 rounded-lg bg-[#21262d] hover:bg-[#30363d] text-gray-300 hover:text-white border border-[#30363d] transition-colors"
          title="Problem Bank Manager (Import/Export & Validation)"
        >
          <FolderArchive className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

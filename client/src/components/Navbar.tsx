import React, { useState } from 'react';
import { useAuth } from '../lib/auth-context.js';
import { 
  Code2, 
  Flame, 
  Brain, 
  FolderArchive, 
  Search, 
  CheckCircle2, 
  Layers,
  Briefcase,
  User as UserIcon,
  Trophy,
  Sparkles,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Bot,
  Zap,
  Target
} from 'lucide-react';

interface NavbarProps {
  currentView: 'problems' | 'dashboard' | 'leaderboard' | 'stats' | 'review';
  onNavigate: (view: 'problems' | 'dashboard' | 'leaderboard' | 'stats' | 'review') => void;
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
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const completionPct = totalProblems > 0 ? Math.round((solvedCount / totalProblems) * 100) : 0;

  return (
    <>
      {/* 1. Main Top Navigation Bar */}
      <header className="h-14 border-b border-[#262d3d] bg-[#12161f] px-3 md:px-6 flex items-center justify-between select-none z-30 shrink-0">
        
        {/* Left: Hamburger (mobile) & Brand & Desktop Nav Links */}
        <div className="flex items-center gap-3 lg:gap-6">
          
          {/* Mobile Hamburger Drawer Trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1.5 text-gray-400 hover:text-gray-100 hover:bg-[#1a202c] rounded-xl transition"
            aria-label="Toggle navigation menu"
            title="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Brand Logo */}
          <div 
            onClick={() => onNavigate('problems')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm group-hover:scale-105 transition-transform">
              <Code2 className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-white">
                AlgoCraft
              </span>
              <span className="text-[9px] uppercase font-mono font-bold px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-400 border border-blue-500/30">
                PRO
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => onNavigate('problems')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentView === 'problems'
                  ? 'bg-[#1a202c] text-white border border-[#262d3d] shadow-sm'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-[#1a202c]/50'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>Problems</span>
            </button>

            <button
              onClick={() => onNavigate('dashboard')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentView === 'dashboard'
                  ? 'bg-[#1a202c] text-blue-400 border border-blue-500/30 shadow-sm'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-[#1a202c]/50'
              }`}
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => onNavigate('leaderboard')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentView === 'leaderboard'
                  ? 'bg-[#1a202c] text-amber-400 border border-amber-500/30 shadow-sm'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-[#1a202c]/50'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Arena</span>
            </button>

            <button
              onClick={() => onNavigate('review')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 relative ${
                currentView === 'review'
                  ? 'bg-[#1a202c] text-purple-400 border border-purple-500/30 shadow-sm'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-[#1a202c]/50'
              }`}
            >
              <Brain className="w-3.5 h-3.5 text-purple-400" />
              <span>Review (SM-2)</span>
              {dueReviewsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-purple-500 text-white ml-0.5 animate-pulse">
                  {dueReviewsCount}
                </span>
              )}
            </button>

            <button
              onClick={onOpenInterview}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-purple-300 hover:text-white bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/30 transition-all flex items-center gap-1.5 ml-1 shadow-sm"
            >
              <Briefcase className="w-3.5 h-3.5 text-purple-400" />
              <span>Mock Interview</span>
            </button>
          </nav>
        </div>

        {/* Center: Search Trigger (Desktop) */}
        <button
          onClick={onOpenSearch}
          className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 bg-[#0a0d12] border border-[#262d3d] rounded-xl text-xs text-gray-400 hover:border-gray-500 hover:text-gray-200 transition-colors w-56 justify-between shadow-inner group"
          aria-label="Quick search problem bank"
        >
          <span className="flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 group-hover:text-blue-400 transition-colors" />
            <span>Search problems...</span>
          </span>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-semibold bg-[#1a202c] text-gray-300 rounded border border-[#262d3d]">
            Ctrl K
          </kbd>
        </button>

        {/* Right: Search (mobile), Tools, User Profile Dropdown */}
        <div className="flex items-center gap-2">
          
          {/* Quick Search on Mobile */}
          <button
            onClick={onOpenSearch}
            className="lg:hidden p-2 rounded-xl bg-[#0a0d12] border border-[#262d3d] text-gray-400 hover:text-white"
            aria-label="Search problems"
            title="Search problems"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Problem Bank Manager */}
          <button
            onClick={onOpenManager}
            className="hidden sm:flex p-2 rounded-xl bg-[#1a202c] hover:bg-[#262d3d] text-gray-300 hover:text-white border border-[#262d3d] transition-colors"
            title="Problem Bank Manager & Importer"
            aria-label="Problem Bank Manager"
          >
            <FolderArchive className="w-4 h-4" />
          </button>

          {/* User Profile / Sign In Dropdown */}
          <div className="relative">
            {isAuthenticated ? (
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-xl bg-[#1a202c] hover:bg-[#262d3d] border border-[#262d3d] transition"
                aria-label={`User menu for ${user?.username}`}
              >
                <img
                  src={user?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.username}`}
                  alt={user?.username || 'User avatar'}
                  className="w-6 h-6 rounded-lg bg-[#0a0d12] object-cover"
                />
                <span className="text-xs font-bold text-gray-200 max-w-[80px] truncate hidden sm:inline">
                  {user?.username}
                </span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>
            ) : (
              <button
                onClick={openAuthModal}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition shadow-md shadow-blue-600/20 flex items-center gap-1.5 active:scale-95"
                aria-label="Sign in with Email OTP"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

            {/* User Dropdown Menu */}
            {isUserMenuOpen && isAuthenticated && (
              <div 
                className="absolute right-0 mt-2 w-48 bg-[#12161f] border border-[#262d3d] rounded-2xl shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
                onMouseLeave={() => setIsUserMenuOpen(false)}
              >
                <div className="px-3.5 py-2 border-b border-[#1e2533]">
                  <div className="text-xs font-bold text-gray-100 truncate">{user?.username}</div>
                  <div className="text-[10px] text-gray-400 truncate">{user?.email}</div>
                </div>

                <button
                  onClick={() => {
                    onNavigate('dashboard');
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs text-gray-300 hover:text-white hover:bg-[#1a202c] flex items-center gap-2 transition"
                >
                  <UserIcon className="w-3.5 h-3.5 text-blue-400" />
                  <span>My Dashboard</span>
                </button>

                <button
                  onClick={() => {
                    onNavigate('leaderboard');
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs text-gray-300 hover:text-white hover:bg-[#1a202c] flex items-center gap-2 transition"
                >
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  <span>Global Rankings</span>
                </button>

                <div className="border-t border-[#1e2533] my-1" />

                <button
                  onClick={() => {
                    logout();
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* 2. Dedicated Stat Strip (Beneath Main Nav) */}
      <div className="h-9 border-b border-[#262d3d] bg-[#0d1117] px-3 md:px-6 flex items-center justify-between text-xs select-none shrink-0 overflow-x-auto scrollbar-none">
        
        {/* Left Stats: Streak & Solved Progress */}
        <div className="flex items-center gap-4 shrink-0">
          
          {/* Active Streak */}
          <div 
            className="flex items-center gap-1.5 text-amber-400 font-semibold cursor-pointer hover:opacity-80 transition"
            onClick={() => onNavigate('dashboard')}
            title={`${streakCount} day active solve streak`}
          >
            <Flame className="w-3.5 h-3.5 fill-amber-400" />
            <span className="font-mono font-bold text-gray-200">{streakCount}d</span>
            <span className="text-[11px] text-gray-500 hidden sm:inline font-normal">streak</span>
          </div>

          <div className="h-3 w-px bg-[#262d3d]" />

          {/* Solved Progress Bar */}
          <div 
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition"
            onClick={() => onNavigate('problems')}
            title={`${solvedCount} out of ${totalProblems} problems solved (${completionPct}%)`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-mono text-gray-200 font-bold">
              {solvedCount}<span className="text-gray-500 font-normal">/{totalProblems}</span>
            </span>
            
            <div className="w-16 h-1.5 rounded-full bg-[#1a202c] overflow-hidden hidden sm:block">
              <div 
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${completionPct}%` }}
              />
            </div>
            <span className="text-[10px] text-gray-500 font-mono hidden md:inline">
              ({completionPct}%)
            </span>
          </div>

          <div className="h-3 w-px bg-[#262d3d] hidden sm:block" />

          {/* SM-2 Review Due Badge */}
          {dueReviewsCount > 0 && (
            <button
              onClick={() => onNavigate('review')}
              className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-500/15 border border-purple-500/30 text-purple-300 text-[11px] font-semibold hover:bg-purple-500/25 transition"
            >
              <Brain className="w-3 h-3 text-purple-400" />
              <span>{dueReviewsCount} due today</span>
            </button>
          )}
        </div>

        {/* Right Info: Socratic AI & Practice Status */}
        <div className="flex items-center gap-3 shrink-0 text-gray-500 text-[11px]">
          <span className="hidden md:flex items-center gap-1 text-gray-400">
            <Zap className="w-3 h-3 text-amber-400" />
            <span>Target: Solve 1 problem daily</span>
          </span>

          <div className="hidden md:block h-3 w-px bg-[#262d3d]" />

          <span className="flex items-center gap-1 text-purple-400/80 font-mono text-[10px]" title="AI Socratic Assistant Enabled">
            <Bot className="w-3 h-3 text-purple-400" aria-label="AI Socratic Assistant" />
            <span>AI Mentor Active</span>
          </span>
        </div>
      </div>

      {/* 3. Mobile Slide-Over Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex">
          <div className="w-64 bg-[#12161f] border-r border-[#262d3d] h-full p-4 flex flex-col justify-between shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#262d3d]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Code2 className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-sm text-white">AlgoCraft Menu</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-200"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1">
                <button
                  onClick={() => {
                    onNavigate('problems');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-gray-200 hover:bg-[#1a202c] transition"
                >
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span>Problem Library</span>
                </button>

                <button
                  onClick={() => {
                    onNavigate('dashboard');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-gray-200 hover:bg-[#1a202c] transition"
                >
                  <UserIcon className="w-4 h-4 text-blue-400" />
                  <span>Personal Dashboard</span>
                </button>

                <button
                  onClick={() => {
                    onNavigate('leaderboard');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-gray-200 hover:bg-[#1a202c] transition"
                >
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>Global Leaderboard</span>
                </button>

                <button
                  onClick={() => {
                    onNavigate('review');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-gray-200 hover:bg-[#1a202c] transition"
                >
                  <Brain className="w-4 h-4 text-purple-400" />
                  <span>Spaced Repetition (SM-2)</span>
                </button>

                <button
                  onClick={() => {
                    onOpenInterview();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-purple-300 hover:bg-purple-950/40 transition"
                >
                  <Briefcase className="w-4 h-4 text-purple-400" />
                  <span>Mock Interview</span>
                </button>

                <button
                  onClick={() => {
                    onOpenManager();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-gray-400 hover:bg-[#1a202c] transition"
                >
                  <FolderArchive className="w-4 h-4" />
                  <span>Bank Manager</span>
                </button>
              </div>
            </div>

            {/* Bottom Auth button */}
            <div className="pt-4 border-t border-[#262d3d]">
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-500/10 text-rose-400 rounded-xl text-xs font-bold"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out ({user?.username})</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    openAuthModal();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Sign In with OTP</span>
                </button>
              )}
            </div>
          </div>
          <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
        </div>
      )}
    </>
  );
};

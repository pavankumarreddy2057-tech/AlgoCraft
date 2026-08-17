import React, { useState } from 'react';
import { useAuth } from '../lib/auth-context.js';
import { 
  Code2, 
  Flame, 
  Brain, 
  BarChart3, 
  FolderArchive, 
  Search, 
  CheckCircle2, 
  Layers,
  Briefcase,
  User as UserIcon,
  Trophy,
  Globe,
  Sparkles,
  LogOut,
  Menu,
  X,
  ChevronDown
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

  return (
    <>
      {/* Top Main Navbar */}
      <header className="h-14 border-b border-[#30363d] bg-[#161b22] px-3 md:px-6 flex items-center justify-between select-none z-30 shrink-0">
        
        {/* Left: Brand & Desktop Nav */}
        <div className="flex items-center gap-4 lg:gap-6">
          
          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1.5 text-gray-400 hover:text-gray-200 hover:bg-[#21262d] rounded-lg transition"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Brand Logo */}
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
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  V2
                </span>
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => onNavigate('problems')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                currentView === 'problems'
                  ? 'bg-[#21262d] text-white'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-[#21262d]/50'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Problems
            </button>

            <button
              onClick={() => onNavigate('dashboard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                currentView === 'dashboard'
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-[#21262d]/50'
              }`}
            >
              <UserIcon className="w-3.5 h-3.5" />
              Dashboard
            </button>

            <button
              onClick={() => onNavigate('leaderboard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                currentView === 'leaderboard'
                  ? 'bg-amber-600/20 text-amber-400 border border-amber-500/30'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-[#21262d]/50'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              Leaderboard
            </button>

            <button
              onClick={() => onNavigate('review')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 relative ${
                currentView === 'review'
                  ? 'bg-[#21262d] text-white'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-[#21262d]/50'
              }`}
            >
              <Brain className="w-3.5 h-3.5 text-purple-400" />
              <span>Review (SM-2)</span>
              {dueReviewsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-purple-500 text-white ml-0.5 animate-pulse">
                  {dueReviewsCount}
                </span>
              )}
            </button>

            <button
              onClick={onOpenInterview}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-purple-300 hover:text-white bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/30 transition-colors flex items-center gap-1.5 ml-1"
            >
              <Briefcase className="w-3.5 h-3.5 text-purple-400" />
              Mock Interview
            </button>
          </nav>
        </div>

        {/* Center: Search Trigger (Desktop) */}
        <button
          onClick={onOpenSearch}
          className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-[#0d1117] border border-[#30363d] rounded-lg text-xs text-gray-400 hover:border-gray-500 hover:text-gray-200 transition-colors w-56 justify-between shadow-inner"
        >
          <span className="flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5" />
            Quick Search...
          </span>
          <kbd className="px-1.5 py-0.5 text-[10px] font-semibold bg-[#21262d] text-gray-300 rounded border border-[#30363d]">
            Ctrl + K
          </kbd>
        </button>

        {/* Right: Streak, Manager, User Auth Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Quick Search on Mobile */}
          <button
            onClick={onOpenSearch}
            className="lg:hidden p-2 rounded-lg bg-[#0d1117] border border-[#30363d] text-gray-400"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Streak Badge */}
          <div 
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold"
            title={`${streakCount} day streak`}
          >
            <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{streakCount}d</span>
          </div>

          {/* Solved Badge (hidden on smallest screens) */}
          <div 
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold"
            title={`${solvedCount} out of ${totalProblems} solved`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{solvedCount}/{totalProblems}</span>
          </div>

          {/* Problem Bank Manager */}
          <button
            onClick={onOpenManager}
            className="hidden sm:flex p-2 rounded-lg bg-[#21262d] hover:bg-[#30363d] text-gray-300 hover:text-white border border-[#30363d] transition-colors"
            title="Problem Bank Manager"
          >
            <FolderArchive className="w-4 h-4" />
          </button>

          {/* User Profile / Sign In Dropdown */}
          <div className="relative">
            {isAuthenticated ? (
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-xl bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] transition"
              >
                <img
                  src={user?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.username}`}
                  alt={user?.username}
                  className="w-6 h-6 rounded-lg bg-[#0d1117] object-cover"
                />
                <span className="text-xs font-bold text-gray-200 max-w-[80px] truncate hidden sm:inline">
                  {user?.username}
                </span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>
            ) : (
              <button
                onClick={openAuthModal}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition shadow-md shadow-blue-600/20 flex items-center gap-1.5 active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

            {/* User Dropdown Menu */}
            {isUserMenuOpen && isAuthenticated && (
              <div 
                className="absolute right-0 mt-2 w-48 bg-[#161b22] border border-[#30363d] rounded-xl shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
                onMouseLeave={() => setIsUserMenuOpen(false)}
              >
                <div className="px-3.5 py-2 border-b border-[#21262d]">
                  <div className="text-xs font-bold text-gray-100 truncate">{user?.username}</div>
                  <div className="text-[10px] text-gray-400 truncate">{user?.email}</div>
                </div>

                <button
                  onClick={() => {
                    onNavigate('dashboard');
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs text-gray-300 hover:text-white hover:bg-[#21262d] flex items-center gap-2"
                >
                  <UserIcon className="w-3.5 h-3.5 text-blue-400" />
                  <span>My Dashboard</span>
                </button>

                <button
                  onClick={() => {
                    onNavigate('leaderboard');
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs text-gray-300 hover:text-white hover:bg-[#21262d] flex items-center gap-2"
                >
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  <span>Global Rankings</span>
                </button>

                <div className="border-t border-[#21262d] my-1" />

                <button
                  onClick={() => {
                    logout();
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs text-red-400 hover:bg-red-500/10 flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* Mobile Slide-Over Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex">
          <div className="w-64 bg-[#161b22] border-r border-[#30363d] h-full p-4 flex flex-col justify-between shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#30363d]">
                <div className="flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-emerald-400" />
                  <span className="font-bold text-sm text-white">AlgoCraft Menu</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-200"
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
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold text-gray-200 hover:bg-[#21262d]"
                >
                  <Layers className="w-4 h-4 text-blue-400" />
                  <span>Problem Library</span>
                </button>

                <button
                  onClick={() => {
                    onNavigate('dashboard');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold text-gray-200 hover:bg-[#21262d]"
                >
                  <UserIcon className="w-4 h-4 text-emerald-400" />
                  <span>Personal Dashboard</span>
                </button>

                <button
                  onClick={() => {
                    onNavigate('leaderboard');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold text-gray-200 hover:bg-[#21262d]"
                >
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>Global Leaderboard</span>
                </button>

                <button
                  onClick={() => {
                    onNavigate('review');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold text-gray-200 hover:bg-[#21262d]"
                >
                  <Brain className="w-4 h-4 text-purple-400" />
                  <span>Spaced Repetition</span>
                </button>

                <button
                  onClick={() => {
                    onOpenInterview();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold text-purple-300 hover:bg-purple-950/40"
                >
                  <Briefcase className="w-4 h-4 text-purple-400" />
                  <span>Mock Interview</span>
                </button>

                <button
                  onClick={() => {
                    onOpenManager();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold text-gray-400 hover:bg-[#21262d]"
                >
                  <FolderArchive className="w-4 h-4" />
                  <span>Bank Manager</span>
                </button>
              </div>
            </div>

            {/* Bottom Auth button */}
            <div className="pt-4 border-t border-[#30363d]">
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-500/10 text-red-400 rounded-xl text-xs font-semibold"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    openAuthModal();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-semibold shadow-lg"
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

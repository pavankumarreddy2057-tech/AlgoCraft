import React, { useState, useEffect } from 'react';
import { AuthProvider } from './lib/auth-context.js';
import { Navbar } from './components/Navbar.js';
import { ProblemBrowser } from './components/ProblemBrowser.js';
import { Workspace } from './components/Workspace.js';
import { SpacedRepetitionModal } from './components/SpacedRepetitionModal.js';
import { StatsDashboard } from './components/StatsDashboard.js';
import { PersonalDashboard } from './components/PersonalDashboard.js';
import { GlobalDashboard } from './components/GlobalDashboard.js';
import { ProblemManagerModal } from './components/ProblemManagerModal.js';
import { QuickSearchModal } from './components/QuickSearchModal.js';
import { MockInterviewModal } from './components/MockInterviewModal.js';
import { AuthModal } from './components/AuthModal.js';
import { fetchStats, fetchProblems, fetchReviewQueue } from './lib/api.js';
import { ProblemListItem, DashboardStats } from './types/index.js';
import { Layers, User as UserIcon, Trophy, Brain, Briefcase } from 'lucide-react';

function AppContent() {
  const [currentView, setCurrentView] = useState<'problems' | 'dashboard' | 'leaderboard' | 'stats' | 'review' | 'workspace'>('problems');
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [problems, setProblems] = useState<ProblemListItem[]>([]);
  const [dueReviewsCount, setDueReviewsCount] = useState<number>(0);

  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isManagerOpen, setIsManagerOpen] = useState<boolean>(false);
  const [isInterviewOpen, setIsInterviewOpen] = useState<boolean>(false);

  const loadGlobalData = async () => {
    try {
      const [sData, pData, rData] = await Promise.all([
        fetchStats(),
        fetchProblems(),
        fetchReviewQueue()
      ]);
      setStats(sData);
      setProblems(pData.problems);
      setDueReviewsCount(rData.count);
    } catch (err: any) {
      console.error('Error loading global data:', err);
    }
  };

  useEffect(() => {
    loadGlobalData();
  }, []);

  // Global keyboard shortcuts (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenProblem = (slug: string) => {
    setActiveSlug(slug);
    setCurrentView('workspace');
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#0d1117] text-gray-100 overflow-hidden font-sans">
      
      {/* Global Top Navbar */}
      <Navbar
        currentView={currentView === 'workspace' ? 'problems' : currentView}
        onNavigate={(view) => {
          setActiveSlug(null);
          setCurrentView(view);
        }}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenManager={() => setIsManagerOpen(true)}
        onOpenInterview={() => setIsInterviewOpen(true)}
        streakCount={stats?.currentStreak || 0}
        solvedCount={stats?.totalSolved || 0}
        totalProblems={stats?.totalBank || problems.length}
        dueReviewsCount={dueReviewsCount}
      />

      {/* Main View Router */}
      <main className="flex-1 flex overflow-hidden pb-12 md:pb-0">
        {currentView === 'problems' && (
          <ProblemBrowser
            onSelectProblem={handleOpenProblem}
            onNavigateReview={() => setCurrentView('review')}
          />
        )}

        {currentView === 'dashboard' && (
          <PersonalDashboard
            onOpenProblem={handleOpenProblem}
            onNavigateReview={() => setCurrentView('review')}
          />
        )}

        {currentView === 'leaderboard' && (
          <GlobalDashboard
            onOpenProblem={handleOpenProblem}
          />
        )}

        {currentView === 'workspace' && activeSlug && (
          <Workspace
            slug={activeSlug}
            onBack={() => {
              setActiveSlug(null);
              setCurrentView('problems');
              loadGlobalData();
            }}
            onNavigateProblem={(nextSlug) => setActiveSlug(nextSlug)}
            onRefreshStats={loadGlobalData}
          />
        )}

        {currentView === 'review' && (
          <SpacedRepetitionModal
            onOpenProblem={handleOpenProblem}
          />
        )}

        {currentView === 'stats' && (
          <StatsDashboard
            onOpenProblem={handleOpenProblem}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar (Screens < 768px, hidden in workspace) */}
      {currentView !== 'workspace' && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-13 bg-[#161b22]/95 backdrop-blur-md border-t border-[#30363d] px-2 flex items-center justify-around z-30 select-none">
          <button
            onClick={() => {
              setActiveSlug(null);
              setCurrentView('problems');
            }}
            className={`flex flex-col items-center justify-center py-1 flex-1 text-[10px] font-medium transition ${
              currentView === 'problems' ? 'text-emerald-400 font-bold' : 'text-gray-400'
            }`}
          >
            <Layers className="w-4 h-4 mb-0.5" />
            <span>Problems</span>
          </button>

          <button
            onClick={() => {
              setActiveSlug(null);
              setCurrentView('dashboard');
            }}
            className={`flex flex-col items-center justify-center py-1 flex-1 text-[10px] font-medium transition ${
              currentView === 'dashboard' ? 'text-blue-400 font-bold' : 'text-gray-400'
            }`}
          >
            <UserIcon className="w-4 h-4 mb-0.5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => {
              setActiveSlug(null);
              setCurrentView('leaderboard');
            }}
            className={`flex flex-col items-center justify-center py-1 flex-1 text-[10px] font-medium transition ${
              currentView === 'leaderboard' ? 'text-amber-400 font-bold' : 'text-gray-400'
            }`}
          >
            <Trophy className="w-4 h-4 mb-0.5" />
            <span>Arena</span>
          </button>

          <button
            onClick={() => {
              setActiveSlug(null);
              setCurrentView('review');
            }}
            className={`flex flex-col items-center justify-center py-1 flex-1 text-[10px] font-medium transition relative ${
              currentView === 'review' ? 'text-purple-400 font-bold' : 'text-gray-400'
            }`}
          >
            <Brain className="w-4 h-4 mb-0.5" />
            <span>Review</span>
            {dueReviewsCount > 0 && (
              <span className="absolute top-1 right-3 w-2 h-2 rounded-full bg-purple-500" />
            )}
          </button>

          <button
            onClick={() => setIsInterviewOpen(true)}
            className="flex flex-col items-center justify-center py-1 flex-1 text-[10px] font-medium text-purple-300"
          >
            <Briefcase className="w-4 h-4 mb-0.5" />
            <span>Interview</span>
          </button>
        </nav>
      )}

      {/* Quick Search Modal (Ctrl + K) */}
      <QuickSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        problems={problems}
        onSelectProblem={handleOpenProblem}
      />

      {/* Problem Manager Modal */}
      <ProblemManagerModal
        isOpen={isManagerOpen}
        onClose={() => setIsManagerOpen(false)}
        onRefresh={loadGlobalData}
      />

      {/* Mock Interview Simulator */}
      <MockInterviewModal
        isOpen={isInterviewOpen}
        onClose={() => setIsInterviewOpen(false)}
        onOpenProblem={handleOpenProblem}
      />

      {/* Email OTP Auth Modal */}
      <AuthModal />
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

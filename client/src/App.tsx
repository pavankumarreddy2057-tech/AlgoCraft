import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.js';
import { ProblemBrowser } from './components/ProblemBrowser.js';
import { Workspace } from './components/Workspace.js';
import { SpacedRepetitionModal } from './components/SpacedRepetitionModal.js';
import { StatsDashboard } from './components/StatsDashboard.js';
import { ProblemManagerModal } from './components/ProblemManagerModal.js';
import { QuickSearchModal } from './components/QuickSearchModal.js';
import { MockInterviewModal } from './components/MockInterviewModal.js';
import { fetchStats, fetchProblems, fetchReviewQueue } from './lib/api.js';
import { ProblemListItem, DashboardStats } from './types/index.js';

export function App() {
  const [currentView, setCurrentView] = useState<'problems' | 'stats' | 'review' | 'workspace'>('problems');
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
      <main className="flex-1 flex overflow-hidden">
        {currentView === 'problems' && (
          <ProblemBrowser
            onSelectProblem={handleOpenProblem}
            onNavigateReview={() => setCurrentView('review')}
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

      {/* Quick Search Modal (Ctrl + K) */}
      <QuickSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        problems={problems}
        onSelectProblem={handleOpenProblem}
      />

      {/* Problem Manager Modal (Import/Export/Validation) */}
      <ProblemManagerModal
        isOpen={isManagerOpen}
        onClose={() => setIsManagerOpen(false)}
        onRefresh={loadGlobalData}
      />

      {/* 45-Minute Timed Mock Interview Simulator */}
      <MockInterviewModal
        isOpen={isInterviewOpen}
        onClose={() => setIsInterviewOpen(false)}
        onOpenProblem={handleOpenProblem}
      />
    </div>
  );
}

export default App;

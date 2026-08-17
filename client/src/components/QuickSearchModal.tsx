import React, { useState, useEffect, useRef } from 'react';
import { Search, X, CheckCircle2, ChevronRight, Tag } from 'lucide-react';
import { ProblemListItem } from '../types/index.js';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  problems: ProblemListItem[];
  onSelectProblem: (slug: string) => void;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({
  isOpen,
  onClose,
  problems,
  onSelectProblem
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const filtered = problems.filter(p => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.difficulty.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    );
  }).slice(0, 10);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1 < filtered.length ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 >= 0 ? prev - 1 : filtered.length - 1));
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      e.preventDefault();
      onSelectProblem(filtered[selectedIndex].slug);
      onClose();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/60 backdrop-blur-sm p-4">
      <div 
        className="w-full max-w-2xl bg-[#161b22] border border-[#30363d] rounded-xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150"
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#30363d] bg-[#1e222d]">
          <Search className="w-5 h-5 text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search problems by title, tag, or difficulty... (e.g. dynamic programming, binary search)"
            className="w-full bg-transparent text-sm text-white placeholder-gray-400 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-gray-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="text-[11px] px-1.5 py-0.5 bg-[#21262d] text-gray-400 border border-[#30363d] rounded">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-[#21262d]/50">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-sm">
              No matching problems found for "{query}"
            </div>
          ) : (
            filtered.map((prob, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={prob.slug}
                  onClick={() => {
                    onSelectProblem(prob.slug);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg cursor-pointer transition-colors ${
                    isSelected ? 'bg-[#21262d] text-white' : 'text-gray-300 hover:bg-[#21262d]/60'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {prob.status === 'Solved' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-gray-500 shrink-0" />
                    )}
                    <span className="font-medium text-sm truncate">
                      {prob.id}. {prob.title}
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {prob.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-[11px] px-1.5 py-0.5 rounded bg-[#0d1117] text-gray-400 border border-[#30363d]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
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
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-[#0d1117] border-t border-[#30363d] text-[11px] text-gray-400 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span><kbd className="font-mono bg-[#21262d] px-1 py-0.5 rounded">↑</kbd> <kbd className="font-mono bg-[#21262d] px-1 py-0.5 rounded">↓</kbd> to navigate</span>
            <span><kbd className="font-mono bg-[#21262d] px-1 py-0.5 rounded">↵</kbd> to open</span>
          </div>
          <span>{problems.length} offline problems available</span>
        </div>
      </div>
    </div>
  );
};

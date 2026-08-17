import React, { useState } from 'react';
import { 
  Lightbulb, 
  BookOpen, 
  ChevronDown, 
  ChevronRight, 
  Eye, 
  EyeOff, 
  Code2, 
  Sparkles 
} from 'lucide-react';

interface HintsAndSolutionProps {
  hints: string[];
  referenceSolution: {
    python?: string;
    javascript?: string;
    [lang: string]: string | undefined;
  };
  editorialMd: string;
}

export const HintsAndSolution: React.FC<HintsAndSolutionProps> = ({
  hints,
  referenceSolution,
  editorialMd
}) => {
  const [revealedHints, setRevealedHints] = useState<Record<number, boolean>>({});
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [solutionLang, setSolutionLang] = useState<'python' | 'javascript'>('python');

  const toggleHint = (idx: number) => {
    setRevealedHints(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="space-y-6 pt-4">
      {/* Staged Hints Section */}
      {hints && hints.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-gray-200 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            Hints ({hints.length})
          </h3>

          <div className="space-y-2">
            {hints.map((hint, idx) => {
              const isRevealed = !!revealedHints[idx];
              return (
                <div 
                  key={idx}
                  className="rounded-xl border border-[#30363d] bg-[#161b22] overflow-hidden transition-all"
                >
                  <button
                    onClick={() => toggleHint(idx)}
                    className="w-full px-4 py-2.5 flex items-center justify-between text-left text-xs font-semibold text-gray-300 hover:text-white hover:bg-[#21262d] transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center text-[10px]">
                        {idx + 1}
                      </span>
                      Hint {idx + 1}
                    </span>
                    {isRevealed ? (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                  </button>

                  {isRevealed && (
                    <div className="px-4 py-3 border-t border-[#30363d] bg-[#0d1117] text-xs text-gray-300 leading-relaxed animate-in fade-in duration-150">
                      {hint}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Reference Solution & Editorial Section */}
      <div className="rounded-xl border border-[#30363d] bg-[#161b22] overflow-hidden">
        <button
          onClick={() => setShowSolution(!showSolution)}
          className="w-full px-4 py-3 flex items-center justify-between text-left text-sm font-bold text-gray-200 hover:text-white hover:bg-[#21262d] transition-colors"
        >
          <span className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-sky-400" />
            Official Reference Solution & Editorial
          </span>
          <span className="flex items-center gap-1.5 text-xs text-gray-400 font-normal">
            {showSolution ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {showSolution ? 'Hide Solution' : 'Reveal Solution'}
          </span>
        </button>

        {showSolution && (
          <div className="p-4 border-t border-[#30363d] bg-[#0d1117] space-y-4 animate-in fade-in duration-200">
            {/* Language Switcher for Solution */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-400">Implementation:</span>
              <div className="flex items-center bg-[#161b22] border border-[#30363d] rounded-lg p-0.5">
                <button
                  onClick={() => setSolutionLang('python')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md ${
                    solutionLang === 'python'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  Python
                </button>
                <button
                  onClick={() => setSolutionLang('javascript')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md ${
                    solutionLang === 'javascript'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  JavaScript
                </button>
              </div>
            </div>

            {/* Code Block */}
            <pre className="p-3.5 rounded-lg bg-[#161b22] border border-[#30363d] font-mono text-xs text-gray-200 overflow-x-auto">
              {referenceSolution[solutionLang] || 'No reference solution available for this language.'}
            </pre>

            {/* Editorial Markdown Notes */}
            {editorialMd && (
              <div className="pt-2 border-t border-[#30363d]/50 text-xs text-gray-300 space-y-2 leading-relaxed">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Complexity Analysis & Explanation
                </div>
                <div className="markdown-body">
                  {editorialMd.split('\n').map((line, idx) => (
                    <p key={idx}>{line}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

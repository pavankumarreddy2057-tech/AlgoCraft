import React, { useState, useEffect } from 'react';
import { FileText, Save, Check, X, Eye, Edit3 } from 'lucide-react';

interface ProblemNotesDrawerProps {
  slug: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ProblemNotesDrawer: React.FC<ProblemNotesDrawerProps> = ({
  slug,
  isOpen,
  onClose
}) => {
  const [notes, setNotes] = useState<string>('');
  const [savedStatus, setSavedStatus] = useState<string | null>(null);
  const [isPreview, setIsPreview] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && slug) {
      setLoading(true);
      fetch(`/api/notes/${slug}`)
        .then(res => res.json())
        .then(data => {
          setNotes(data.notes_md || '');
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [isOpen, slug]);

  const handleSave = async () => {
    try {
      setSavedStatus('Saving...');
      const res = await fetch(`/api/notes/${slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes_md: notes })
      });
      if (res.ok) {
        setSavedStatus('Saved!');
        setTimeout(() => setSavedStatus(null), 2000);
      }
    } catch (e) {
      setSavedStatus('Failed to save');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-[#161b22] border-l border-[#30363d] shadow-2xl z-40 flex flex-col animate-in slide-in-from-right duration-200">
      {/* Drawer Header */}
      <div className="h-12 px-4 border-b border-[#30363d] bg-[#1e222d] flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-white">
          <FileText className="w-4 h-4 text-emerald-400" />
          Problem Scratchpad & Notes
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPreview(!isPreview)}
            className="p-1 rounded text-gray-400 hover:text-white text-xs flex items-center gap-1"
            title={isPreview ? "Switch to Edit" : "Preview Markdown"}
          >
            {isPreview ? <Edit3 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Drawer Content */}
      <div className="flex-1 p-4 overflow-y-auto flex flex-col">
        {loading ? (
          <div className="py-12 text-center text-xs text-gray-400">Loading notes...</div>
        ) : isPreview ? (
          <div className="flex-1 text-xs text-gray-300 markdown-body leading-relaxed">
            {notes ? notes.split('\n').map((l, i) => <p key={i}>{l}</p>) : (
              <span className="italic text-gray-500">No notes written yet. Switch to edit mode to type your thoughts.</span>
            )}
          </div>
        ) : (
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Write your key takeaways, edge cases, time/space complexity notes, or pseudocode here..."
            className="flex-1 w-full bg-[#0d1117] border border-[#30363d] rounded-xl p-3 text-xs font-mono text-gray-200 focus:outline-none focus:border-emerald-500 resize-none leading-relaxed"
          />
        )}
      </div>

      {/* Drawer Footer */}
      <div className="h-12 px-4 border-t border-[#30363d] bg-[#1e222d] flex items-center justify-between">
        <span className="text-[11px] text-gray-400">
          {savedStatus && (
            <span className="text-emerald-400 flex items-center gap-1 font-semibold">
              <Check className="w-3.5 h-3.5" /> {savedStatus}
            </span>
          )}
        </span>

        <button
          onClick={handleSave}
          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors"
        >
          <Save className="w-3.5 h-3.5" />
          Save Notes
        </button>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Upload, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  FolderArchive,
  FileJson
} from 'lucide-react';
import { validateProblemBank, importProblemPack } from '../lib/api.js';

interface ProblemManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

export const ProblemManagerModal: React.FC<ProblemManagerModalProps> = ({
  isOpen,
  onClose,
  onRefresh
}) => {
  const [tab, setTab] = useState<'export' | 'import' | 'validate'>('export');
  const [importJson, setImportJson] = useState('');
  const [importCategory, setImportCategory] = useState('custom');
  const [importLoading, setImportLoading] = useState(false);
  const [importResult, setImportResult] = useState<string | null>(null);

  const [validating, setValidating] = useState(false);
  const [validationReport, setValidationReport] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleExport = () => {
    window.open('/api/admin/export', '_blank');
  };

  const handleImport = async () => {
    try {
      setImportLoading(true);
      setImportResult(null);
      const parsed = JSON.parse(importJson);
      const problemsArray = Array.isArray(parsed) ? parsed : (parsed.problems || [parsed]);

      const res = await importProblemPack(problemsArray, importCategory);
      setImportResult(`Successfully imported ${res.importedCount} problem(s)! Total in bank: ${res.totalInBank}`);
      setImportJson('');
      onRefresh();
    } catch (err: any) {
      alert(`Import error: ${err.message}`);
    } finally {
      setImportLoading(false);
    }
  };

  const handleValidate = async () => {
    try {
      setValidating(true);
      setValidationReport(null);
      const report = await validateProblemBank();
      setValidationReport(report);
    } catch (err: any) {
      alert(`Validation error: ${err.message}`);
    } finally {
      setValidating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-3xl bg-[#161b22] border border-[#30363d] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#30363d] bg-[#1e222d]">
          <div className="flex items-center gap-2.5">
            <FolderArchive className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">Problem Bank Manager</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-[#30363d] text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-[#30363d] bg-[#0d1117] px-6">
          <button
            onClick={() => setTab('export')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
              tab === 'export'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Download className="w-4 h-4" />
            Export Problem Pack
          </button>

          <button
            onClick={() => setTab('import')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
              tab === 'import'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Upload className="w-4 h-4" />
            Import Custom Problems
          </button>

          <button
            onClick={() => setTab('validate')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
              tab === 'validate'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Bank Validator Pipeline
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1">
          {tab === 'export' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-300">
                Export the complete offline problem library (including statements, starter code, test suites, and editorial solutions) as a portable JSON pack.
              </p>
              <div className="p-4 rounded-xl bg-[#0d1117] border border-[#30363d] flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white">Entire Problem Bank (.json)</div>
                  <div className="text-xs text-gray-400 mt-0.5">Compatible with any offline AlgoCraft instance</div>
                </div>
                <button
                  onClick={handleExport}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-md transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download JSON Pack
                </button>
              </div>
            </div>
          )}

          {tab === 'import' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-300">
                Import custom problem packs or AI-generated questions in JSON format.
              </p>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Target Category Subfolder</label>
                <input
                  type="text"
                  value={importCategory}
                  onChange={(e) => setImportCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. dynamic-programming or custom"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Problem JSON Payload</label>
                <textarea
                  rows={8}
                  value={importJson}
                  onChange={(e) => setImportJson(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Paste problem JSON or array of problems here..."
                />
              </div>

              {importResult && (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  {importResult}
                </div>
              )}

              <button
                onClick={handleImport}
                disabled={importLoading || !importJson.trim()}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-colors"
              >
                {importLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                Import Problem Pack
              </button>
            </div>
          )}

          {tab === 'validate' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Automated Integrity & Reference Solution Validator</h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Runs every problem's reference solution against all sample and hidden test cases in both Python and JavaScript.
                  </p>
                </div>
                <button
                  onClick={handleValidate}
                  disabled={validating}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-md transition-colors shrink-0"
                >
                  {validating ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                  Run Full Bank Validation
                </button>
              </div>

              {validationReport && (
                <div className="space-y-3 mt-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-[#0d1117] border border-[#30363d] text-center">
                      <div className="text-xs text-gray-400">Total Validated</div>
                      <div className="text-lg font-bold text-white">{validationReport.totalProblems}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                      <div className="text-xs text-emerald-400">100% Passing</div>
                      <div className="text-lg font-bold text-emerald-400">{validationReport.validCount}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-center">
                      <div className="text-xs text-rose-400">Issues Found</div>
                      <div className="text-lg font-bold text-rose-400">{validationReport.invalidCount}</div>
                    </div>
                  </div>

                  <div className="max-h-60 overflow-y-auto divide-y divide-[#30363d]/50 bg-[#0d1117] rounded-xl border border-[#30363d]">
                    {validationReport.results.map((res: any) => {
                      const hasErr = res.issues.some((i: any) => i.type === 'error');
                      return (
                        <div key={res.slug} className="p-2.5 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            {hasErr ? (
                              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                            ) : (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            )}
                            <span className="text-gray-200 font-medium">{res.title}</span>
                            <span className="text-gray-500 text-[11px]">({res.slug})</span>
                          </div>
                          <div className="flex items-center gap-3 text-[11px]">
                            <span className={res.pythonPassed ? 'text-emerald-400' : 'text-rose-400'}>
                              Py: {res.pythonPassed ? 'PASS' : 'FAIL'}
                            </span>
                            <span className={res.jsPassed ? 'text-emerald-400' : 'text-rose-400'}>
                              JS: {res.jsPassed ? 'PASS' : 'FAIL'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

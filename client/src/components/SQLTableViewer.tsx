import React from 'react';
import { Database, CheckCircle2, XCircle } from 'lucide-react';

interface SQLTableViewerProps {
  tableData: {
    columns: string[];
    values: any[][];
  } | null;
  expectedData?: {
    columns: string[];
    values: any[][];
  } | any;
  passed?: boolean;
}

export const SQLTableViewer: React.FC<SQLTableViewerProps> = ({
  tableData,
  expectedData,
  passed
}) => {
  if (!tableData && !expectedData) return null;

  return (
    <div className="space-y-4">
      {/* Actual Output Table */}
      {tableData && tableData.columns && tableData.columns.length > 0 ? (
        <div>
          <div className="text-xs font-semibold text-gray-400 mb-1.5 flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-sky-400" />
            Query Result Table:
          </div>
          <div className="overflow-x-auto rounded-xl border border-[#30363d] bg-[#0d1117]">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#1e222d] text-gray-300 uppercase font-mono text-[11px] border-b border-[#30363d]">
                <tr>
                  {tableData.columns.map((col, idx) => (
                    <th key={idx} className="px-3.5 py-2">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#30363d]/50 font-mono text-gray-200">
                {tableData.values.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-[#161b22]">
                    {row.map((val, cIdx) => (
                      <td key={cIdx} className="px-3.5 py-2">
                        {val === null ? <span className="text-gray-500 italic">null</span> : String(val)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="p-3 rounded-lg bg-[#0d1117] border border-[#30363d] text-xs text-gray-400">
          Query returned 0 rows or no tabular output.
        </div>
      )}

      {/* Expected Table */}
      {expectedData && expectedData.columns && (
        <div>
          <div className="text-xs font-semibold text-emerald-400 mb-1.5">Expected Result:</div>
          <div className="overflow-x-auto rounded-xl border border-emerald-500/30 bg-emerald-950/10">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#1e222d] text-emerald-300 uppercase font-mono text-[11px] border-b border-emerald-500/20">
                <tr>
                  {expectedData.columns.map((col: string, idx: number) => (
                    <th key={idx} className="px-3.5 py-2">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-500/20 font-mono text-gray-200">
                {expectedData.values.map((row: any[], rIdx: number) => (
                  <tr key={rIdx}>
                    {row.map((val, cIdx) => (
                      <td key={cIdx} className="px-3.5 py-2">
                        {val === null ? <span className="text-gray-500 italic">null</span> : String(val)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

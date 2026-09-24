import React, { useState } from 'react';
import {
  Table,
  Plus,
  Trash2,
  Download,
  Printer,
  Search,
  Filter,
  CheckSquare,
  Square,
  Sparkles,
  CheckCircle2,
  FileSpreadsheet,
  ArrowUpDown,
  RefreshCw,
  Copy,
  Eye
} from 'lucide-react';

interface GridRow {
  id: string;
  code: string;
  title: string;
  category: string;
  quantity: number;
  unit: string;
  rateRs: number;
  totalRs: number;
  status: 'VERIFIED' | 'PENDING' | 'DISPATCHED' | 'REJECTED';
  location: string;
}

const INITIAL_GRID_ROWS: GridRow[] = [
  { id: '1', code: 'RZ-LST-001', title: 'Grade-A Laterite Cut Stone (12x8x6)', category: 'Quarry Laterite', quantity: 2400, unit: 'Stones', rateRs: 52, totalRs: 124800, status: 'VERIFIED', location: 'Kasaragod Pit 1' },
  { id: '2', code: 'RZ-LST-002', title: 'Grade-B Laterite Foundation Block', category: 'Quarry Laterite', quantity: 1800, unit: 'Stones', rateRs: 44, totalRs: 79200, status: 'DISPATCHED', location: 'Kasaragod Pit 1' },
  { id: '3', code: 'RZ-AGG-020', title: '20mm Blue Metal Crushed Aggregate', category: 'Crusher VSI', quantity: 48, unit: 'Tons', rateRs: 640, totalRs: 30720, status: 'VERIFIED', location: 'Wayanad Crusher' },
  { id: '4', code: 'RZ-SND-001', title: 'Manufactured Sand (M-Sand - Zone II)', category: 'Crusher VSI', quantity: 64, unit: 'Tons', rateRs: 720, totalRs: 46080, status: 'VERIFIED', location: 'Wayanad Crusher' },
  { id: '5', code: 'RZ-SND-002', title: 'Plastering Sand (P-Sand - Fine Grade)', category: 'Crusher VSI', quantity: 32, unit: 'Tons', rateRs: 840, totalRs: 26880, status: 'PENDING', location: 'Wayanad Crusher' },
  { id: '6', code: 'RZ-BLK-008', title: 'Solid Concrete Building Block 8-Inch', category: 'Manufacturing', quantity: 1200, unit: 'Blocks', rateRs: 38, totalRs: 45600, status: 'VERIFIED', location: 'Mangalore Yard' }
];

export const RzGridDataStudio: React.FC = () => {
  const [rows, setRows] = useState<GridRow[]>(INITIAL_GRID_ROWS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchFilter, setSearchFilter] = useState('');
  const [editingCell, setEditingCell] = useState<{ id: string; field: keyof GridRow } | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSelectAll = () => {
    if (selectedIds.length === rows.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(rows.map(r => r.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleAddRow = () => {
    const newId = String(Date.now());
    const newRow: GridRow = {
      id: newId,
      code: `RZ-NEW-${Math.floor(100 + Math.random() * 900)}`,
      title: 'New Line Item / Product',
      category: 'Quarry Laterite',
      quantity: 100,
      unit: 'Units',
      rateRs: 50,
      totalRs: 5000,
      status: 'PENDING',
      location: 'Main Yard'
    };
    setRows([newRow, ...rows]);
    showToast('Added new spreadsheet row at top');
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    setRows(rows.filter(r => !selectedIds.includes(r.id)));
    setSelectedIds([]);
    showToast(`Deleted ${selectedIds.length} selected row(s)`);
  };

  const handleBulkStatus = (status: GridRow['status']) => {
    if (selectedIds.length === 0) return;
    setRows(rows.map(r => selectedIds.includes(r.id) ? { ...r, status } : r));
    showToast(`Updated status to ${status} for ${selectedIds.length} rows`);
  };

  const updateCell = (id: string, field: keyof GridRow, val: any) => {
    setRows(rows.map(r => {
      if (r.id === id) {
        const updated = { ...r, [field]: val };
        if (field === 'quantity' || field === 'rateRs') {
          updated.totalRs = (Number(updated.quantity) || 0) * (Number(updated.rateRs) || 0);
        }
        return updated;
      }
      return r;
    }));
  };

  const filteredRows = rows.filter(r =>
    r.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
    r.code.toLowerCase().includes(searchFilter.toLowerCase()) ||
    r.category.toLowerCase().includes(searchFilter.toLowerCase()) ||
    r.location.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const totalSum = filteredRows.reduce((acc, r) => acc + r.totalRs, 0);

  return (
    <div className="space-y-4">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-amber-500 text-slate-950 px-4 py-2.5 rounded-2xl font-bold text-xs shadow-2xl flex items-center gap-2 border border-amber-400">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Grid Top Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold text-amber-400 uppercase tracking-wider">
              RZ® GRID DATA STUDIO
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
              Inline Spreadsheet Mode
            </span>
          </div>
          <h2 className="text-xl font-black text-white">Smart Tabular Entry & Bulk Automation</h2>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <button
            onClick={handleAddRow}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Row</span>
          </button>
          <button
            onClick={() => showToast('Simulated Paste 12 Rows from CSV')}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5"
          >
            <Copy className="w-3.5 h-3.5 text-amber-400" />
            <span>Bulk Paste CSV</span>
          </button>
          <button
            onClick={() => showToast('Exporting table to Excel (.xlsx)...')}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Excel / PDF</span>
          </button>
          <button
            onClick={() => showToast('Opening Print Ready View')}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter & Bulk Actions Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 w-full sm:w-80 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
          <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search code, title, quarry or location..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full bg-transparent text-white focus:outline-none text-xs"
          />
        </div>

        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            <span className="font-bold text-amber-400">{selectedIds.length} Selected</span>
            <button
              onClick={() => handleBulkStatus('VERIFIED')}
              className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30"
            >
              Verify
            </button>
            <button
              onClick={() => handleBulkStatus('DISPATCHED')}
              className="px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30"
            >
              Dispatch
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-2.5 py-1 rounded-lg bg-red-500/20 text-red-300 font-bold border border-red-500/30 flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>

      {/* Spreadsheet Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300 border-collapse">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800 select-none">
              <tr>
                <th className="p-3 w-10 text-center">
                  <button onClick={handleSelectAll} className="text-slate-400 hover:text-white">
                    {selectedIds.length === rows.length && rows.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-amber-400" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="p-3">Item Code</th>
                <th className="p-3">Product Description</th>
                <th className="p-3">Category</th>
                <th className="p-3 text-right">Quantity</th>
                <th className="p-3">Unit</th>
                <th className="p-3 text-right">Rate (₹)</th>
                <th className="p-3 text-right">Total (₹)</th>
                <th className="p-3">Status</th>
                <th className="p-3">Site Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredRows.map((row) => {
                const isSelected = selectedIds.includes(row.id);
                return (
                  <tr
                    key={row.id}
                    className={`transition ${isSelected ? 'bg-amber-500/10' : 'hover:bg-slate-800/40'}`}
                  >
                    <td className="p-3 text-center">
                      <button onClick={() => toggleSelectRow(row.id)}>
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-amber-400" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-500" />
                        )}
                      </button>
                    </td>

                    {/* Code */}
                    <td className="p-3 font-mono font-bold text-amber-400">
                      {row.code}
                    </td>

                    {/* Title (Inline editable) */}
                    <td className="p-3 font-medium text-white">
                      <input
                        type="text"
                        value={row.title}
                        onChange={(e) => updateCell(row.id, 'title', e.target.value)}
                        className="w-full bg-transparent focus:bg-slate-950 focus:px-2 focus:py-1 focus:rounded focus:outline-none focus:ring-1 focus:ring-amber-500 text-white"
                      />
                    </td>

                    {/* Category */}
                    <td className="p-3">
                      <select
                        value={row.category}
                        onChange={(e) => updateCell(row.id, 'category', e.target.value)}
                        className="bg-transparent text-slate-300 text-xs focus:bg-slate-950 focus:outline-none"
                      >
                        <option value="Quarry Laterite" className="bg-slate-900">Quarry Laterite</option>
                        <option value="Crusher VSI" className="bg-slate-900">Crusher VSI</option>
                        <option value="Manufacturing" className="bg-slate-900">Manufacturing</option>
                        <option value="Logistics" className="bg-slate-900">Logistics</option>
                      </select>
                    </td>

                    {/* Quantity (Inline editable) */}
                    <td className="p-3 text-right font-mono">
                      <input
                        type="number"
                        value={row.quantity}
                        onChange={(e) => updateCell(row.id, 'quantity', Number(e.target.value))}
                        className="w-20 bg-transparent text-right focus:bg-slate-950 focus:px-2 focus:py-1 focus:rounded focus:outline-none focus:ring-1 focus:ring-amber-500 text-white font-mono"
                      />
                    </td>

                    {/* Unit */}
                    <td className="p-3 text-slate-400">
                      {row.unit}
                    </td>

                    {/* Rate (Inline editable) */}
                    <td className="p-3 text-right font-mono">
                      <input
                        type="number"
                        value={row.rateRs}
                        onChange={(e) => updateCell(row.id, 'rateRs', Number(e.target.value))}
                        className="w-20 bg-transparent text-right focus:bg-slate-950 focus:px-2 focus:py-1 focus:rounded focus:outline-none focus:ring-1 focus:ring-amber-500 text-white font-mono"
                      />
                    </td>

                    {/* Total */}
                    <td className="p-3 text-right font-mono font-bold text-emerald-400">
                      ₹{row.totalRs.toLocaleString()}
                    </td>

                    {/* Status */}
                    <td className="p-3">
                      <select
                        value={row.status}
                        onChange={(e) => updateCell(row.id, 'status', e.target.value as any)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          row.status === 'VERIFIED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          row.status === 'DISPATCHED' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                          row.status === 'REJECTED' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                          'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}
                      >
                        <option value="VERIFIED" className="bg-slate-900">VERIFIED</option>
                        <option value="PENDING" className="bg-slate-900">PENDING</option>
                        <option value="DISPATCHED" className="bg-slate-900">DISPATCHED</option>
                        <option value="REJECTED" className="bg-slate-900">REJECTED</option>
                      </select>
                    </td>

                    {/* Location */}
                    <td className="p-3 text-slate-400">
                      {row.location}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-slate-950 border-t border-slate-800 font-bold text-xs text-white">
              <tr>
                <td colSpan={7} className="p-3 text-right text-slate-400 uppercase font-mono text-[10px]">
                  Total Balance ({filteredRows.length} Items):
                </td>
                <td className="p-3 text-right font-mono text-emerald-400 text-sm">
                  ₹{totalSum.toLocaleString()}
                </td>
                <td colSpan={2} className="p-3 text-slate-500 text-[10px]">
                  BOS Live Reconciliation
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

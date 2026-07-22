/**
 * ExportToolbar - Shared component for Print/PDF and Excel/CSV export
 * 
 * Usage:
 *   <ExportToolbar
 *     title="Manajemen Tenant"
 *     subtitle="Data tenant aktif Graha Kaji"
 *     data={tenants}        // Array of objects to export as Excel/CSV
 *     columns={[            // Column definitions for Excel
 *       { key: 'company', label: 'Perusahaan' },
 *       { key: 'unit', label: 'Unit' },
 *       ...
 *     ]}
 *     printContentId="tenant-print-area"  // optional: ID of element to print
 *   />
 */

import React from 'react';
import { Printer, FileSpreadsheet } from 'lucide-react';

// ── Excel / CSV Export ─────────────────────────────────────────────────────
export function exportToCSV(data, columns, filename = 'export') {
  if (!data || data.length === 0) {
    alert('Tidak ada data untuk diekspor.');
    return;
  }

  const headers = columns.map(c => `"${c.label}"`).join(',');
  const rows = data.map(row =>
    columns.map(c => {
      const val = typeof c.render === 'function' ? c.render(row) : (row[c.key] ?? '');
      return `"${String(val).replace(/"/g, '""')}"`;
    }).join(',')
  );

  const csvContent = [headers, ...rows].join('\n');
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}_${new Date().toLocaleDateString('id-ID').replace(/\//g, '-')}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ── Print / PDF ─────────────────────────────────────────────────────────────
export function printSection(title, subtitle, tableHtml, extra = '') {
  const printWindow = window.open('', '_blank', 'width=1000,height=700');
  const date = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8" />
      <title>${title} - Graha Kaji</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; font-size: 11px; color: #1a1a2e; background: #fff; padding: 32px; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0033a0; padding-bottom: 16px; margin-bottom: 20px; }
        .header-left h1 { font-size: 20px; font-weight: 800; color: #0033a0; }
        .header-left p { font-size: 10px; color: #666; margin-top: 2px; }
        .header-right { text-align: right; }
        .header-right .building { font-size: 13px; font-weight: 700; color: #0033a0; }
        .header-right .date { font-size: 9px; color: #888; margin-top: 2px; }
        .subtitle { font-size: 11px; color: #555; margin-bottom: 14px; font-style: italic; }
        ${extra}
        table { width: 100%; border-collapse: collapse; margin-top: 8px; }
        thead tr { background: #0033a0; color: white; }
        thead th { padding: 8px 10px; text-align: left; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
        tbody tr:nth-child(even) { background: #f0f4ff; }
        tbody tr:hover { background: #e8eeff; }
        tbody td { padding: 7px 10px; font-size: 10px; border-bottom: 1px solid #e2e8f0; }
        .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-weight: 700; font-size: 9px; }
        .badge-green { background: #d1fae5; color: #065f46; }
        .badge-blue { background: #dbeafe; color: #1e40af; }
        .badge-red { background: #fee2e2; color: #991b1b; }
        .badge-yellow { background: #fef3c7; color: #92400e; }
        .badge-gray { background: #f3f4f6; color: #374151; }
        .footer { margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 12px; display: flex; justify-content: space-between; font-size: 9px; color: #aaa; }
        .summary-row { display: flex; gap: 24px; margin-bottom: 16px; }
        .summary-card { background: #f0f4ff; border: 1px solid #c7d2fe; border-radius: 8px; padding: 10px 16px; min-width: 120px; }
        .summary-card .val { font-size: 18px; font-weight: 800; color: #0033a0; }
        .summary-card .lbl { font-size: 9px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 2px; }
        @media print {
          body { padding: 16px; }
          @page { margin: 10mm; size: A4 landscape; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="header-left">
          <h1>${title}</h1>
          <p>${subtitle || 'Laporan Resmi Graha Kaji Building Management'}</p>
        </div>
        <div class="header-right">
          <div class="building">🏢 Graha Kaji Building Management</div>
          <div class="date">Dicetak pada: ${date}</div>
        </div>
      </div>
      ${tableHtml}
      <div class="footer">
        <span>Graha Kaji Building Management System — Dokumen Resmi</span>
        <span>Dicetak: ${date}</span>
      </div>
    </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => printWindow.print(), 500);
}

// ── Helper: Build HTML table from data + columns ────────────────────────────
export function buildTableHtml(data, columns, summaryCards = []) {
  const summaryHtml = summaryCards.length > 0 ? `
    <div class="summary-row">
      ${summaryCards.map(s => `
        <div class="summary-card">
          <div class="val">${s.value}</div>
          <div class="lbl">${s.label}</div>
        </div>
      `).join('')}
    </div>
  ` : '';

  const headerRow = columns.map(c => `<th>${c.label}</th>`).join('');
  const bodyRows = data.map(row =>
    `<tr>${columns.map(c => {
      const val = typeof c.render === 'function' ? c.render(row) : (row[c.key] ?? '—');
      return `<td>${val}</td>`;
    }).join('')}</tr>`
  ).join('');

  return `
    ${summaryHtml}
    <table>
      <thead><tr>${headerRow}</tr></thead>
      <tbody>${bodyRows || '<tr><td colspan="${columns.length}" style="text-align:center;padding:20px;color:#aaa;">Tidak ada data</td></tr>'}</tbody>
    </table>
  `;
}

// ── ExportToolbar Component ────────────────────────────────────────────────
export default function ExportToolbar({ title, subtitle, data, columns, filename, summaryCards = [], extraStyle = '' }) {
  const handleExcel = () => {
    exportToCSV(data, columns, filename || title.toLowerCase().replace(/\s+/g, '_'));
  };

  const handlePrint = () => {
    const tableHtml = buildTableHtml(data, columns, summaryCards);
    printSection(title, subtitle, tableHtml, extraStyle);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleExcel}
        title="Export ke Excel / CSV"
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow transition-colors cursor-pointer"
      >
        <FileSpreadsheet className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Excel</span>
      </button>
      <button
        onClick={handlePrint}
        title="Cetak / Save PDF"
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-primary hover:bg-[#001c59] text-white rounded-lg shadow transition-colors cursor-pointer"
      >
        <Printer className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Print PDF</span>
      </button>
    </div>
  );
}

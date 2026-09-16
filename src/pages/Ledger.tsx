import { useMemo, useState } from 'react';
import { Download, Search } from 'lucide-react';
import { usePortal } from '../context/PortalContext';
import { formatDateIn, formatInr, type LedgerRow } from '../types/portal';

function pdfEscape(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

function downloadTaxInvoicePdf(row: LedgerRow, dealerName: string, gstin: string) {
  const lines = [
    'BHARAT PLASTICS LTD — TAX INVOICE',
    `Invoice: ${row.invoiceNo}`,
    `Date: ${formatDateIn(row.date)}`,
    `Dealer: ${dealerName}`,
    `GSTIN: ${gstin}`,
    `Particulars: ${row.particulars}`,
    `Entry: ${row.entryType}  Amount: INR ${Math.round(row.amount).toLocaleString('en-IN')}`,
    `Settlement: ${row.settlementType}  UTR: ${row.utr}`,
    `Running balance: INR ${Math.round(row.runningBalance).toLocaleString('en-IN')}`,
    'GST @ 18% included where the entry is a tax invoice debit.',
    'This e-invoice is generated from the dealer portal for demonstration and books of account.',
  ];

  const content: string[] = ['BT', '/F1 11 Tf'];
  let y = 780;
  lines.forEach((line, index) => {
    const size = index === 0 ? 16 : 11;
    content.push(`/F1 ${size} Tf`);
    content.push(`50 ${y} Td (${pdfEscape(line)}) Tj`);
    content.push('ET BT');
    y -= index === 0 ? 28 : 20;
  });
  content.push('ET');
  const stream = content.join('\n');

  const objects = [
    '1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj',
    '2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj',
    '3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj',
    `4 0 obj << /Length ${stream.length} >> stream\n${stream}\nendstream endobj`,
    '5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj',
  ];

  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  objects.forEach((object) => {
    offsets.push(pdf.length);
    pdf += `${object}\n`;
  });
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  for (let i = 1; i < offsets.length; i += 1) {
    pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;

  const blob = new Blob([pdf], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${row.invoiceNo}-tax-invoice.pdf`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function Ledger() {
  const { ledger, dealer, ledgerBalance } = usePortal();
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState<'All' | 'Credit' | 'Debit'>('All');

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ledger.filter((row) => {
      const matchesKind = kind === 'All' || row.entryType === kind;
      const hay = `${row.invoiceNo} ${row.particulars} ${row.settlementType} ${row.utr}`.toLowerCase();
      return matchesKind && (!q || hay.includes(q));
    });
  }, [kind, ledger, query]);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-kiln-500">Credit Control</p>
          <h1 className="mt-1 text-2xl font-semibold">Dealer ledger</h1>
          <p className="mt-1 text-sm text-mill-800/80">
            GSTIN {dealer.gstin} · Books outstanding {formatInr(ledgerBalance)} against limit{' '}
            {formatInr(dealer.creditLimitInr)}
          </p>
        </div>
      </header>

      <div className="flex flex-wrap gap-3">
        <label className="relative min-w-[240px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-2.5 text-mill-800/40" size={16} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search invoice, UTR, NEFT/RTGS…"
            className="w-full rounded-lg border border-mill-200 bg-white py-2 pl-9 pr-3 text-sm outline-none ring-kiln-500 focus:ring-2"
          />
        </label>
        <select
          value={kind}
          onChange={(e) => setKind(e.target.value as typeof kind)}
          className="rounded-lg border border-mill-200 bg-white px-3 py-2 text-sm"
        >
          <option>All</option>
          <option>Debit</option>
          <option>Credit</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-mill-200 bg-white shadow-panel">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="bg-mill-50 text-[11px] uppercase tracking-wide text-mill-800/70">
            <tr>
              <th className="px-4 py-3">Invoice No</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Particulars</th>
              <th className="px-4 py-3">Credit / Debit</th>
              <th className="px-4 py-3">Settlement</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3 text-right">Balance</th>
              <th className="px-4 py-3">Tax invoice</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-mill-100">
                <td className="px-4 py-3 font-mono font-medium">{row.invoiceNo}</td>
                <td className="px-4 py-3">{formatDateIn(row.date)}</td>
                <td className="px-4 py-3">
                  {row.particulars}
                  {row.utr !== '—' && (
                    <span className="block font-mono text-[11px] text-mill-800/60">UTR {row.utr}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      row.entryType === 'Debit'
                        ? 'rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-800'
                        : 'rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-800'
                    }
                  >
                    {row.entryType}
                  </span>
                </td>
                <td className="px-4 py-3">{row.settlementType}</td>
                <td className="px-4 py-3 text-right font-mono">{formatInr(row.amount)}</td>
                <td className="px-4 py-3 text-right font-mono">{formatInr(row.runningBalance)}</td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => downloadTaxInvoicePdf(row, dealer.legalName, dealer.gstin)}
                    className="inline-flex items-center gap-1 rounded-md border border-mill-200 px-2 py-1 text-xs font-medium hover:bg-mill-50"
                  >
                    <Download size={13} />
                    Download Tax Invoice (PDF)
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

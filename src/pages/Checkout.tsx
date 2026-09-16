import { useMemo, useState } from 'react';
import { AlertTriangle, Ban, ShieldAlert, Trash2 } from 'lucide-react';
import { usePortal } from '../context/PortalContext';
import {
  GST_RATE,
  formatInr,
  formatMt,
  priceCartLine,
  summarizeCart,
} from '../types/portal';

export function Checkout() {
  const {
    cart,
    updateCartQty,
    removeCartLine,
    clearCart,
    placeOrder,
    ledgerBalance,
    dealer,
    setView,
  } = usePortal();
  const [notice, setNotice] = useState<string | null>(null);

  const summary = useMemo(() => summarizeCart(cart), [cart]);
  const projected = summary.grandTotal + ledgerBalance;
  const overLimit = projected > dealer.creditLimitInr;

  const submit = (mode: 'process' | 'credit-review') => {
    const result = placeOrder(mode);
    setNotice(result.message);
  };

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-kiln-500">Indent desk</p>
        <h1 className="mt-1 text-xl font-semibold sm:text-2xl">Cart, GST and credit validation</h1>
        <p className="mt-1 text-sm text-mill-800/80">
          GST @ {(GST_RATE * 100).toFixed(0)}% is computed on discounted material subtotals. Credit Guardrail
          compares GST-inclusive total + active ledger balance against {formatInr(dealer.creditLimitInr)}.
        </p>
      </header>

      {overLimit && cart.length > 0 && (
        <div className="flex gap-3 rounded-xl border border-amber-400 bg-amber-50 px-4 py-4 text-amber-950">
          <ShieldAlert className="mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">Credit Guardrail — processing blocked</p>
            <p className="mt-1 text-sm leading-relaxed">
              Projected exposure {formatInr(projected)} exceeds the sanctioned limit of{' '}
              {formatInr(dealer.creditLimitInr)}. Confirm & Process is disabled. You may only submit this indent
              as <span className="font-semibold">Credit Review Pending</span>. Mill scheduling will not start
              until Credit Control releases the excess.
            </p>
          </div>
        </div>
      )}

      {notice && (
        <p className="rounded-lg border border-mill-200 bg-white px-4 py-3 text-sm shadow-panel">{notice}</p>
      )}

      {cart.length === 0 ? (
        <article className="rounded-xl border border-dashed border-mill-300 bg-white p-6 text-center sm:p-10">
          <Ban className="mx-auto text-mill-800/40" />
          <p className="mt-3 font-medium">No polymer lines in the cart</p>
          <button
            type="button"
            onClick={() => setView('catalog')}
            className="mt-4 rounded-lg bg-mill-900 px-4 py-2 text-sm font-semibold text-white"
          >
            Browse catalogue
          </button>
        </article>
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-3 lg:col-span-2">
            {cart.map((line) => {
              const priced = priceCartLine(line);
              return (
                <article key={line.lineId} className="rounded-xl border border-mill-200 bg-white p-4 shadow-panel">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="font-semibold">
                        {line.polymer} Grade {line.grade}
                      </h2>
                      <p className="text-xs font-mono text-mill-800/70">
                        {line.sku} · Masterbatch {line.color}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeCartLine(line.lineId)}
                      className="rounded-md p-2 text-mill-800/70 hover:bg-mill-50"
                      aria-label={`Remove ${line.sku}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-4">
                    <label className="text-sm">
                      Tonnage (MT)
                      <input
                        type="number"
                        min={1}
                        step={0.25}
                        value={line.quantityMt}
                        onChange={(e) => updateCartQty(line.lineId, Number(e.target.value))}
                        className="mt-1 w-full rounded-lg border border-mill-200 px-3 py-2 font-mono"
                      />
                    </label>
                    <div className="text-sm">
                      <p className="text-mill-800/60">List / MT</p>
                      <p className="mt-1 font-mono">{formatInr(line.listPricePerMt)}</p>
                    </div>
                    <div className="text-sm">
                      <p className="text-mill-800/60">Net / MT</p>
                      <p className="mt-1 font-mono">
                        {formatInr(line.discountedPricePerMt)}
                        {line.volumeDiscountPct > 0 && (
                          <span className="ml-2 text-xs font-sans text-emerald-700">
                            −{line.volumeDiscountPct}%
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="text-sm">
                      <p className="text-mill-800/60">Line + GST</p>
                      <p className="mt-1 font-mono">{formatInr(priced.lineTotal)}</p>
                    </div>
                  </div>
                </article>
              );
            })}
            <button type="button" onClick={clearCart} className="text-sm text-mill-800/70 underline">
              Clear indent
            </button>
          </div>

          <aside className="h-fit rounded-xl border border-mill-200 bg-white p-5 shadow-panel">
            <h2 className="font-semibold">Tax accounting</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt>Tonnage</dt>
                <dd className="font-mono">{formatMt(summary.totalMt)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Material list value</dt>
                <dd className="font-mono">{formatInr(summary.listValue)}</dd>
              </div>
              <div className="flex justify-between text-emerald-800">
                <dt>Volume discount</dt>
                <dd className="font-mono">− {formatInr(summary.volumeDiscount)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Taxable value</dt>
                <dd className="font-mono">{formatInr(summary.taxableValue)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>GST 18%</dt>
                <dd className="font-mono">{formatInr(summary.gstAmount)}</dd>
              </div>
              <div className="flex justify-between border-t border-mill-200 pt-2 text-base font-semibold">
                <dt>Payable</dt>
                <dd className="font-mono">{formatInr(summary.grandTotal)}</dd>
              </div>
              <div className="flex justify-between text-mill-800/80">
                <dt>Active ledger</dt>
                <dd className="font-mono">{formatInr(ledgerBalance)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Projected exposure</dt>
                <dd className="font-mono">{formatInr(projected)}</dd>
              </div>
            </dl>

            <button
              type="button"
              disabled={overLimit}
              onClick={() => submit('process')}
              className="mt-5 w-full rounded-lg bg-mill-900 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-mill-200 disabled:text-mill-800/50"
            >
              Confirm & Process
            </button>
            <button
              type="button"
              onClick={() => submit('credit-review')}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-amber-400 bg-amber-50 py-2.5 text-sm font-semibold text-amber-950"
            >
              <AlertTriangle size={16} />
              Submit as Credit Review Pending
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}

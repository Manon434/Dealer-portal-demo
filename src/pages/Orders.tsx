import { TrackerStepper } from '../components/TrackerStepper';
import { usePortal } from '../context/PortalContext';
import { formatDateIn, formatInr, formatMt } from '../types/portal';

export function Orders() {
  const { orders } = usePortal();

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-kiln-500">Production control</p>
        <h1 className="mt-1 text-2xl font-semibold">My orders — historic & live jobs</h1>
        <p className="mt-1 text-sm text-mill-800/80">
          Each job maps to the Indian mill pipeline: mixing, extrusion, QA, transport bay, and out for delivery.
        </p>
      </header>

      <div className="space-y-4">
        {orders.map((order) => (
          <article key={order.id} className="rounded-xl border border-mill-200 bg-white p-5 shadow-panel">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-mono text-xs text-kiln-500">{order.poNumber}</p>
                <h2 className="text-lg font-semibold">{order.id}</h2>
                <p className="text-sm text-mill-800/70">
                  {formatDateIn(order.placedAt)} · {order.plant} · Ship-to {order.shipTo}
                </p>
              </div>
              <span
                className={
                  order.creditReview
                    ? 'rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900'
                    : 'rounded-full bg-mill-100 px-3 py-1 text-xs font-semibold text-mill-900'
                }
              >
                {order.status}
              </span>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="text-[11px] uppercase tracking-wide text-mill-800/60">
                  <tr>
                    <th className="pb-2">Grade</th>
                    <th className="pb-2">Masterbatch</th>
                    <th className="pb-2">Qty</th>
                    <th className="pb-2">Discount</th>
                    <th className="pb-2">GST</th>
                    <th className="pb-2 text-right">Line total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.lines.map((line) => (
                    <tr key={`${order.id}-${line.sku}-${line.color}`} className="border-t border-mill-100">
                      <td className="py-2">
                        {line.polymer} {line.grade}
                        <span className="block font-mono text-[11px] text-mill-800/60">{line.sku}</span>
                      </td>
                      <td>{line.color}</td>
                      <td className="font-mono">{formatMt(line.quantityMt)}</td>
                      <td>{line.volumeDiscountPct > 0 ? `${line.volumeDiscountPct}%` : '—'}</td>
                      <td className="font-mono">{formatInr(line.gstAmount)}</td>
                      <td className="text-right font-mono">{formatInr(line.lineTotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm">
              <p>
                Taxable {formatInr(order.taxableValue)} · GST {formatInr(order.gstAmount)}
              </p>
              <p className="font-semibold">
                Grand total <span className="font-mono">{formatInr(order.grandTotal)}</span>
              </p>
            </div>

            <div className="mt-5">
              <TrackerStepper currentStep={order.trackerStep} paused={order.creditReview} />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

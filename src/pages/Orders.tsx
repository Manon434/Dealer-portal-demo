import { TrackerStepper } from '../components/TrackerStepper';
import { usePortal } from '../context/PortalContext';
import { formatDateIn, formatInr, formatMt } from '../types/portal';

export function Orders() {
  const { orders } = usePortal();

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-kiln-500">Production control</p>
        <h1 className="mt-1 text-xl font-semibold sm:text-2xl">My orders — historic & live jobs</h1>
        <p className="mt-1 text-sm text-mill-800/80">
          Each job maps to the mill pipeline: mixing, extrusion, QA, transport bay, and out for delivery.
        </p>
      </header>

      <div className="space-y-4">
        {orders.map((order) => (
          <article key={order.id} className="rounded-xl border border-mill-200 bg-white p-4 shadow-panel sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-mono text-xs text-kiln-500">{order.poNumber}</p>
                <h2 className="text-lg font-semibold">{order.id}</h2>
                <p className="text-sm text-mill-800/70">
                  {formatDateIn(order.placedAt)} · {order.plant}
                </p>
                <p className="text-sm text-mill-800/70">Ship-to {order.shipTo}</p>
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

            <div className="mt-4 space-y-3 lg:hidden">
              {order.lines.map((line) => (
                <div
                  key={`${order.id}-${line.sku}-${line.color}`}
                  className="rounded-lg border border-mill-100 bg-mill-50 px-3 py-3 text-sm"
                >
                  <p className="font-semibold">
                    {line.polymer} {line.grade}
                    <span className="ml-2 font-mono text-[11px] font-normal text-mill-800/60">{line.sku}</span>
                  </p>
                  <p className="mt-1 text-mill-800/70">
                    {line.color} · {formatMt(line.quantityMt)}
                    {line.volumeDiscountPct > 0 ? ` · ${line.volumeDiscountPct}% off` : ''}
                  </p>
                  <p className="mt-1 font-mono">
                    GST {formatInr(line.gstAmount)} · {formatInr(line.lineTotal)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 hidden overflow-x-auto lg:block">
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

            <div className="mt-4 flex flex-col gap-1 text-sm sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
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

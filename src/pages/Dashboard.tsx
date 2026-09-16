import { AlertTriangle, Boxes, IndianRupee, Scale, Truck } from 'lucide-react';
import { KPIWidget } from '../components/KPIWidget';
import { TrackerStepper } from '../components/TrackerStepper';
import { usePortal } from '../context/PortalContext';
import { formatInr, formatMt } from '../types/portal';

export function Dashboard() {
  const { dealer, orders, ledgerBalance, availableCredit, cart, setView, products } = usePortal();
  const openOrders = orders.filter((order) => order.status !== 'Delivered');
  const live = openOrders[0];
  const bookedMt = orders.reduce(
    (sum, order) => sum + order.lines.reduce((lineSum, line) => lineSum + line.quantityMt, 0),
    0,
  );
  const millStock = products.reduce((sum, product) => sum + product.availableStockMt, 0);
  const utilisation = Math.min(100, Math.round((ledgerBalance / dealer.creditLimitInr) * 100));

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-kiln-500">West region · FY 2026-27</p>
        <h1 className="mt-1 text-xl font-semibold text-mill-950 sm:text-2xl">Aggregated mill status</h1>
        <p className="mt-1 text-sm text-mill-800/80">
          {dealer.legalName}
          <span className="mt-1 block sm:mt-0 sm:inline">
            <span className="hidden sm:inline"> · </span>GSTIN {dealer.gstin} · RM {dealer.relationshipManager}
          </span>
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KPIWidget
          label="Sanctioned credit"
          value={formatInr(dealer.creditLimitInr)}
          hint="Default dealer limit from Credit Control"
          icon={<IndianRupee size={18} />}
        />
        <KPIWidget
          label="Ledger outstanding"
          value={formatInr(ledgerBalance)}
          hint={`${utilisation}% of limit utilised`}
          tone={utilisation > 70 ? 'warning' : 'default'}
          icon={<AlertTriangle size={18} />}
        />
        <KPIWidget
          label="Available headroom"
          value={formatInr(Math.max(0, availableCredit))}
          hint="Limit minus active ledger balance"
          tone="positive"
          icon={<Scale size={18} />}
        />
        <KPIWidget
          label="Open mill jobs"
          value={String(openOrders.length)}
          hint={`${formatMt(bookedMt, 1)} booked across plants`}
          icon={<Truck size={18} />}
        />
      </div>

      <section className="grid gap-4 lg:grid-cols-3">
        <article className="rounded-xl border border-mill-200 bg-white p-5 shadow-panel lg:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Live manufacturing pipeline</h2>
              <p className="text-sm text-mill-800/70">
                {live
                  ? `${live.id} · ${live.plant} · ${live.status}`
                  : 'No open jobs. Raise an indent from the catalogue.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setView('orders')}
              className="text-sm font-medium text-mill-800 underline-offset-2 hover:underline"
            >
              All jobs
            </button>
          </div>
          {live && (
            <div className="mt-5">
              <TrackerStepper currentStep={live.trackerStep} paused={live.creditReview} />
            </div>
          )}
        </article>

        <article className="rounded-xl border border-mill-200 bg-white p-5 shadow-panel">
          <h2 className="text-lg font-semibold">West allocation</h2>
          <p className="mt-1 flex items-center gap-2 text-sm text-mill-800/70">
            <Boxes size={16} /> {formatMt(millStock, 0)} uncommitted mill stock
          </p>
          <ul className="mt-4 space-y-3">
            {products.map((product) => (
              <li key={product.id} className="flex items-center justify-between text-sm">
                <span>
                  {product.polymer} {product.grade}
                  <span className="block text-[11px] text-mill-800/60">{product.plant}</span>
                </span>
                <span className="font-mono">{formatMt(product.availableStockMt, 0)}</span>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => setView('catalog')}
            className="mt-5 w-full rounded-lg bg-mill-900 py-2.5 text-sm font-semibold text-white"
          >
            Raise polymer indent
          </button>
        </article>
      </section>

      <section className="rounded-xl border border-mill-200 bg-white p-5 shadow-panel">
        <h2 className="text-lg font-semibold">Draft cart</h2>
        <p className="text-sm text-mill-800/70">
          {cart.length === 0
            ? 'No lines staged. Volume discount of 10% applies automatically above 5 MT per polymer.'
            : `${cart.length} line(s) · ${formatMt(cart.reduce((s, l) => s + l.quantityMt, 0))} staged for GST checkout.`}
        </p>
      </section>
    </div>
  );
}

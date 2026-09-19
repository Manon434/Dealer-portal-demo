import { useMemo } from 'react';
import { BarChart3, IndianRupee, Package, TrendingUp } from 'lucide-react';
import { usePortal } from '../context/PortalContext';
import { formatInr, orderTonnage } from '../types/portal';

const MONTHLY_SALES = [
  { month: 'Jan', value: 6.8 },
  { month: 'Feb', value: 7.2 },
  { month: 'Mar', value: 8.1 },
  { month: 'Apr', value: 7.4 },
  { month: 'May', value: 8.8 },
  { month: 'Jun', value: 8.1 },
  { month: 'Jul', value: 9.6 },
  { month: 'Aug', value: 8.9 },
  { month: 'Sep', value: 8.42 },
  { month: 'Oct', value: 9.1 },
  { month: 'Nov', value: 9.4 },
  { month: 'Dec', value: 10.2 },
];

export function SalesPerformance() {
  const { orders } = usePortal();

  const metrics = useMemo(() => {
    const total = orders.reduce((sum, order) => sum + order.grandTotal, 0);
    const quantity = orders.reduce((sum, order) => sum + orderTonnage(order), 0);
    const average = orders.length ? total / orders.length : 0;

    return {
      total,
      quantity,
      average,
    };
  }, [orders]);

  const max = Math.max(...MONTHLY_SALES.map((item) => item.value));

  return (
    <div className="space-y-5">
      <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-rose-600">
          Commercial Analytics
        </p>
        <h1 className="mt-1 text-2xl font-black text-slate-950">
          Sales Performance
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Sales trends and commercial performance across the manufacturer network.
        </p>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        {[
          ['MTD Sales', '₹8.42 Cr', IndianRupee],
          ['MoM Growth', '+6.8%', TrendingUp],
          ['YTD Sales', '₹74.6 Cr', BarChart3],
          ['YoY Growth', '+11.4%', TrendingUp],
          ['Average Order', formatInr(metrics.average), IndianRupee],
          ['Quantity Sold', `${metrics.quantity.toLocaleString('en-IN')} MT`, Package],
        ].map(([label, value, Icon]) => {
          const MetricIcon = Icon as typeof IndianRupee;

          return (
            <div
              key={String(label)}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                  {label}
                </p>
                <MetricIcon size={17} className="text-rose-600" />
              </div>
              <p className="mt-3 font-mono text-xl font-black text-slate-950">
                {value}
              </p>
            </div>
          );
        })}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-extrabold text-slate-950">
              Monthly Sales Trend
            </h2>
            <p className="text-xs text-slate-500">
              Sales value shown in ₹ Crore.
            </p>
          </div>

          <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
            Current year
          </span>
        </div>

        <div className="mt-8 flex h-72 items-end gap-2 sm:gap-4">
          {MONTHLY_SALES.map((item) => {
            const height = `${Math.max(8, (item.value / max) * 100)}%`;

            return (
              <div
                key={item.month}
                className="flex h-full flex-1 flex-col items-center justify-end gap-2"
              >
                <span className="font-mono text-[10px] font-bold text-slate-500">
                  ₹{item.value}Cr
                </span>

                <div className="flex h-full w-full items-end">
                  <div
                    className="w-full rounded-t-lg bg-rose-600 transition hover:bg-rose-500"
                    style={{ height }}
                    title={`${item.month}: ₹${item.value} Cr`}
                  />
                </div>

                <span className="text-[10px] font-bold text-slate-500">
                  {item.month}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Current Month
          </p>
          <p className="mt-2 text-2xl font-black text-slate-950">₹8.42 Cr</p>
          <p className="mt-1 text-xs text-emerald-600 font-bold">
            +6.8% vs previous month
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            YTD vs Previous YTD
          </p>
          <p className="mt-2 text-2xl font-black text-slate-950">+11.4%</p>
          <p className="mt-1 text-xs text-slate-500">
            ₹74.6 Cr current YTD
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Commercial Volume
          </p>
          <p className="mt-2 text-2xl font-black text-slate-950">
            {metrics.quantity.toLocaleString('en-IN')} MT
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Based on current synchronized order book
          </p>
        </div>
      </section>
    </div>
  );
}
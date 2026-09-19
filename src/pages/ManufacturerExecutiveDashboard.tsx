import { useMemo } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Boxes,
  CreditCard,
  IndianRupee,
  PackageCheck,
  ShoppingCart,
  Users,
} from 'lucide-react';
import { usePortal } from '../context/PortalContext';
import { formatDateIn, formatInr, formatMt, orderTonnage } from '../types/portal';

export function ManufacturerExecutiveDashboard() {
  const { orders } = usePortal();

  const metrics = useMemo(() => {
    const activeOrders = orders.filter(
      (o) => !o.delivered && o.status !== 'Delivered',
    );

    const pendingDispatch = orders.filter(
      (o) => o.status === 'Ready to Dispatch' || o.status === 'In Transit',
    );

    const creditReview = orders.filter((o) => o.creditReview);

    const totalOrderValue = orders.reduce(
      (sum, order) => sum + order.grandTotal,
      0,
    );

    const productionMt = activeOrders
      .filter((o) => !o.creditReview)
      .reduce((sum, order) => sum + orderTonnage(order), 0);

    const creditValue = creditReview.reduce(
      (sum, order) => sum + order.grandTotal,
      0,
    );

    return {
      activeOrders,
      pendingDispatch,
      creditReview,
      totalOrderValue,
      productionMt,
      creditValue,
    };
  }, [orders]);

  const cards = [
    {
      label: 'Total Sales – MTD',
      value: '₹8.42 Cr',
      description: 'Current month sales',
      icon: IndianRupee,
      accent: 'rose',
    },
    {
      label: 'Total Sales – YTD',
      value: '₹74.6 Cr',
      description: 'Year-to-date performance',
      icon: Activity,
      accent: 'blue',
    },
    {
      label: 'Orders – MTD',
      value: '428',
      description: 'Number of orders',
      icon: ShoppingCart,
      accent: 'emerald',
    },
    {
      label: 'Open Orders',
      value: String(metrics.activeOrders.length),
      description: 'Orders yet to be completed',
      icon: Boxes,
      accent: 'amber',
    },
    {
      label: 'Pending Dispatch',
      value: String(metrics.pendingDispatch.length),
      description: 'Dispatch workload',
      icon: PackageCheck,
      accent: 'violet',
    },
    {
      label: 'Active Dealers',
      value: '186',
      description: 'Dealer engagement',
      icon: Users,
      accent: 'cyan',
    },
    {
      label: 'Credit Utilized',
      value: '₹21.4 Cr',
      description: 'Dealer credit exposure',
      icon: CreditCard,
      accent: 'orange',
    },
    {
      label: 'Available Dealer Credit',
      value: '₹13.6 Cr',
      description: 'Remaining sanctioned capacity',
      icon: CreditCard,
      accent: 'green',
    },
  ];

  const accentClasses: Record<string, string> = {
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    violet: 'bg-violet-50 text-violet-600 border-violet-100',
    cyan: 'bg-cyan-50 text-cyan-600 border-cyan-100',
    orange: 'bg-orange-50 text-orange-600 border-orange-100',
    green: 'bg-green-50 text-green-600 border-green-100',
  };

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-rose-600">
              Management Intelligence
            </p>
            <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-950">
              Executive Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Commercial, dealer and manufacturing performance overview.
            </p>
          </div>

          <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
              Operations
            </p>
            <p className="text-xs font-bold text-emerald-800">
              Live synchronized
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                    {card.label}
                  </p>
                  <p className="mt-3 font-mono text-2xl font-black tracking-tight text-slate-950">
                    {card.value}
                  </p>
                </div>

                <div
                  className={`rounded-xl border p-2.5 ${accentClasses[card.accent]}`}
                >
                  <Icon size={19} />
                </div>
              </div>

              <p className="mt-2 text-xs font-medium text-slate-500">
                {card.description}
              </p>
            </div>
          );
        })}
      </section>

      <section className="grid gap-5 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm xl:col-span-2">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="font-extrabold text-slate-950">
              Recent Incoming Orders
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Latest dealer purchase orders across the network.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-3">Order</th>
                  <th className="px-5 py-3">Dealer</th>
                  <th className="px-5 py-3">Value</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Date</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {orders.slice(0, 6).map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3">
                      <p className="font-mono text-xs font-bold text-slate-900">
                        {order.id}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {formatMt(orderTonnage(order), 0)}
                      </p>
                    </td>

                    <td className="px-5 py-3">
                      <p className="font-semibold text-slate-800">
                        {order.dealerName}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {order.dealerCode}
                      </p>
                    </td>

                    <td className="px-5 py-3 font-mono text-xs font-bold">
                      {formatInr(order.grandTotal)}
                    </td>

                    <td className="px-5 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                          order.creditReview
                            ? 'bg-amber-100 text-amber-800'
                            : order.delivered
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td className="px-5 py-3 text-xs text-slate-500">
                      {formatDateIn(order.placedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="font-extrabold text-slate-950">
              Attention Required
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Exceptions requiring management action.
            </p>
          </div>

          <div className="space-y-3 p-4">
            <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3">
              <AlertTriangle className="text-amber-600" size={19} />
              <div className="flex-1">
                <p className="text-sm font-bold text-amber-900">
                  Credit approvals
                </p>
                <p className="text-xs text-amber-700">
                  {metrics.creditReview.length} orders awaiting release.
                </p>
              </div>
              <ArrowUpRight size={16} className="text-amber-700" />
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 p-3">
              <PackageCheck className="text-rose-600" size={19} />
              <div className="flex-1">
                <p className="text-sm font-bold text-rose-900">
                  Dispatch workload
                </p>
                <p className="text-xs text-rose-700">
                  {metrics.pendingDispatch.length} orders require dispatch.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Production tonnage
              </p>
              <p className="mt-1 font-mono text-xl font-black text-slate-950">
                {formatMt(metrics.productionMt, 0)}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Credit review value
              </p>
              <p className="mt-1 font-mono text-xl font-black text-slate-950">
                {formatInr(metrics.creditValue)}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Current Order Book
            </p>
            <p className="mt-1 font-mono text-xl font-black">
              {formatInr(metrics.totalOrderValue)}
            </p>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Active Jobs
            </p>
            <p className="mt-1 font-mono text-xl font-black">
              {metrics.activeOrders.length}
            </p>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Dealer Network
            </p>
            <p className="mt-1 font-mono text-xl font-black">186</p>
          </div>
        </div>
      </section>
    </div>
  );
}
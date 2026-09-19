import { useMemo } from 'react';
import {
  ArrowLeft,
  Building2,
  CreditCard,
  FileText,
  Package,
  TrendingUp,
} from 'lucide-react';
import { usePortal } from '../context/PortalContext';
import {
  formatDateIn,
  formatInr,
  orderTonnage,
} from '../types/portal';

const DEALER_DATA = {
  'DEALER-001': {
    name: 'ABC Distributors',
    code: 'BPD-MH-001',
    region: 'West',
    city: 'Mumbai',
    state: 'Maharashtra',
    contact: '+91 98765 43210',
    manager: 'Rahul Mehta',
    creditLimit: 60000000,
    utilized: 72,
    mtdSales: 4200000,
    ytdSales: 48000000,
    status: 'Active',
  },
  'DEALER-002': {
    name: 'XYZ Polymers',
    code: 'BPD-MH-002',
    region: 'West',
    city: 'Pune',
    state: 'Maharashtra',
    contact: '+91 98200 12345',
    manager: 'Priya Shah',
    creditLimit: 50000000,
    utilized: 61,
    mtdSales: 3600000,
    ytdSales: 39000000,
    status: 'Active',
  },
  'DEALER-003': {
    name: 'PQR Agencies',
    code: 'BPD-KA-003',
    region: 'South',
    city: 'Bengaluru',
    state: 'Karnataka',
    contact: '+91 99887 11223',
    manager: 'Arjun Rao',
    creditLimit: 30000000,
    utilized: 91,
    mtdSales: 1800000,
    ytdSales: 21000000,
    status: 'Attention',
  },
} as const;

export function Dealer360() {
  const { orders } = usePortal();

  const selectedId =
    sessionStorage.getItem('selectedDealerId') ?? 'DEALER-001';

  const dealer =
    DEALER_DATA[selectedId as keyof typeof DEALER_DATA] ??
    DEALER_DATA['DEALER-001'];

  const dealerOrders = useMemo(() => {
    return orders.filter(
      (order) =>
        order.dealerCode === dealer.code ||
        order.dealerId === selectedId ||
        selectedId === 'DEALER-001',
    );
  }, [dealer.code, orders, selectedId]);

  const totalMt = dealerOrders.reduce(
    (sum, order) => sum + orderTonnage(order),
    0,
  );

  const orderValue = dealerOrders.reduce(
    (sum, order) => sum + order.grandTotal,
    0,
  );

  const availableCredit =
    dealer.creditLimit * (1 - dealer.utilized / 100);

  const goBack = () => {
    window.history.pushState({}, '', '#dealer-network');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={goBack}
        className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-rose-600"
      >
        <ArrowLeft size={17} />
        Back to Dealer Network
      </button>

      <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white">
              <Building2 size={25} />
            </div>

            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600">
                Dealer 360°
              </p>
              <h1 className="text-2xl font-black text-slate-950">
                {dealer.name}
              </h1>
              <p className="font-mono text-xs text-slate-500">
                {dealer.code} · {dealer.city}, {dealer.state}
              </p>
            </div>
          </div>

          <span
            className={`rounded-full px-3 py-1.5 text-xs font-bold ${
              dealer.status === 'Attention'
                ? 'bg-amber-100 text-amber-800'
                : 'bg-emerald-100 text-emerald-800'
            }`}
          >
            {dealer.status}
          </span>
        </div>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <TrendingUp size={18} className="text-rose-600" />
          <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            MTD Sales
          </p>
          <p className="mt-1 font-mono text-xl font-black">
            {formatInr(dealer.mtdSales)}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <TrendingUp size={18} className="text-blue-600" />
          <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            YTD Sales
          </p>
          <p className="mt-1 font-mono text-xl font-black">
            {formatInr(dealer.ytdSales)}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <CreditCard size={18} className="text-amber-600" />
          <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Credit Utilized
          </p>
          <p className="mt-1 font-mono text-xl font-black">
            {dealer.utilized}%
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <Package size={18} className="text-emerald-600" />
          <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Purchased MT
          </p>
          <p className="mt-1 font-mono text-xl font-black">
            {totalMt.toLocaleString('en-IN')} MT
          </p>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-extrabold">Dealer Profile</h2>

          <div className="mt-4 space-y-3 text-sm">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400">
                Region
              </p>
              <p className="font-semibold">{dealer.region}</p>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400">
                Contact
              </p>
              <p className="font-semibold">{dealer.contact}</p>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400">
                Relationship Manager
              </p>
              <p className="font-semibold">{dealer.manager}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-extrabold">Financial Snapshot</h2>

          <div className="mt-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Credit Limit</span>
              <strong>{formatInr(dealer.creditLimit)}</strong>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Utilized</span>
              <strong>{dealer.utilized}%</strong>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Available Credit</span>
              <strong className="text-emerald-700">
                {formatInr(availableCredit)}
              </strong>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full ${
                  dealer.utilized >= 90
                    ? 'bg-rose-500'
                    : dealer.utilized >= 75
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                }`}
                style={{ width: `${dealer.utilized}%` }}
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-extrabold">Order Snapshot</h2>

          <div className="mt-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Orders</span>
              <strong>{dealerOrders.length}</strong>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Order Value</span>
              <strong>{formatInr(orderValue)}</strong>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Open Orders</span>
              <strong>
                {
                  dealerOrders.filter(
                    (order) =>
                      !order.delivered && order.status !== 'Delivered',
                  ).length
                }
              </strong>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="font-extrabold">Order History</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3">Order</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">MT</th>
                <th className="px-5 py-3">Value</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {dealerOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-5 py-3 font-mono text-xs font-bold">
                    {order.id}
                  </td>
                  <td className="px-5 py-3 text-xs text-slate-500">
                    {formatDateIn(order.placedAt)}
                  </td>
                  <td className="px-5 py-3 font-mono">
                    {orderTonnage(order).toLocaleString('en-IN')} MT
                  </td>
                  <td className="px-5 py-3 font-mono font-bold">
                    {formatInr(order.grandTotal)}
                  </td>
                  <td className="px-5 py-3">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold">
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {dealerOrders.length === 0 && (
          <div className="p-8 text-center text-sm text-slate-500">
            No synchronized orders found for this dealer.
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <FileText size={18} className="text-rose-600" />
          <h2 className="font-extrabold">Commercial Summary</h2>
        </div>

        <p className="mt-3 text-sm text-slate-500">
          This view is connected to the existing order state. Manufacturer
          order updates therefore remain visible in the synchronized order
          history.
        </p>
      </section>
    </div>
  );
}
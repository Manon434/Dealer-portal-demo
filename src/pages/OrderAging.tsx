import { useMemo, useState } from 'react';
import { AlertTriangle, Clock, Search } from 'lucide-react';
import { usePortal } from '../context/PortalContext';
import { formatInr, orderTonnage } from '../types/portal';

function ageInDays(date: string): number {
  return Math.max(
    0,
    Math.floor((Date.now() - new Date(date).getTime()) / 86_400_000),
  );
}

function bucketForAge(age: number): string {
  if (age <= 2) return '0–2 Days';
  if (age <= 5) return '3–5 Days';
  if (age <= 10) return '6–10 Days';
  return '>10 Days';
}

export function OrderAging() {
  const { orders } = usePortal();
  const [search, setSearch] = useState('');
  const [bucket, setBucket] = useState('All');

  const rows = useMemo(() => {
    return orders
      .map((order) => ({
        order,
        age: ageInDays(order.placedAt),
      }))
      .filter(({ order, age }) => {
        const query = `${order.id} ${order.dealerName} ${order.dealerCode}`.toLowerCase();

        return (
          query.includes(search.toLowerCase()) &&
          (bucket === 'All' || bucketForAge(age) === bucket)
        );
      })
      .sort((a, b) => b.age - a.age);
  }, [bucket, orders, search]);

  const buckets = ['0–2 Days', '3–5 Days', '6–10 Days', '>10 Days'];

  return (
    <div className="space-y-5">
      <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-rose-600">
          Exception Management
        </p>
        <h1 className="mt-1 text-2xl font-black text-slate-950">
          Orders & Aging
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Identify orders that are waiting too long and require operational attention.
        </p>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {buckets.map((name) => {
          const matching = orders.filter(
            (order) => bucketForAge(ageInDays(order.placedAt)) === name,
          );

          const value = matching.reduce(
            (sum, order) => sum + order.grandTotal,
            0,
          );

          return (
            <button
              key={name}
              type="button"
              onClick={() => setBucket(name)}
              className={`rounded-2xl border p-4 text-left shadow-sm transition ${
                bucket === name
                  ? 'border-rose-300 bg-rose-50'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                  {name}
                </p>
                <Clock size={17} className="text-rose-600" />
              </div>

              <p className="mt-3 font-mono text-2xl font-black text-slate-950">
                {matching.length}
              </p>

              <p className="mt-1 font-mono text-xs font-bold text-slate-500">
                {formatInr(value)}
              </p>
            </button>
          );
        })}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-extrabold text-slate-950">
              Exception Order Queue
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Oldest orders appear first.
            </p>
          </div>

          <div className="flex gap-2">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-2.5 text-slate-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search order or dealer"
                className="w-64 rounded-xl border border-slate-300 bg-white py-2 pl-9 pr-3 text-xs outline-none focus:border-rose-500"
              />
            </div>

            <select
              value={bucket}
              onChange={(e) => setBucket(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold"
            >
              <option>All</option>
              {buckets.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3">Order</th>
                <th className="px-5 py-3">Dealer</th>
                <th className="px-5 py-3">Age</th>
                <th className="px-5 py-3">MT</th>
                <th className="px-5 py-3">Value</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Pipeline</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {rows.map(({ order, age }) => (
                <tr
                  key={order.id}
                  className={age > 10 ? 'bg-rose-50/40' : 'hover:bg-slate-50'}
                >
                  <td className="px-5 py-3">
                    <p className="font-mono text-xs font-bold">
                      {order.id}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {order.poNumber}
                    </p>
                  </td>

                  <td className="px-5 py-3">
                    <p className="font-semibold">{order.dealerName}</p>
                    <p className="font-mono text-[10px] text-slate-500">
                      {order.dealerCode}
                    </p>
                  </td>

                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                        age > 10
                          ? 'bg-rose-100 text-rose-800'
                          : age > 5
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {age > 10 && <AlertTriangle size={12} />}
                      {age} days
                    </span>
                  </td>

                  <td className="px-5 py-3 font-mono text-xs">
                    {orderTonnage(order).toLocaleString('en-IN')} MT
                  </td>

                  <td className="px-5 py-3 font-mono text-xs font-bold">
                    {formatInr(order.grandTotal)}
                  </td>

                  <td className="px-5 py-3">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold">
                      {order.status}
                    </span>
                  </td>

                  <td className="px-5 py-3 text-xs font-semibold text-slate-600">
                    {order.pipelineStage}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {rows.length === 0 && (
          <div className="p-10 text-center text-sm text-slate-500">
            No orders match the selected filters.
          </div>
        )}
      </section>
    </div>
  );
}
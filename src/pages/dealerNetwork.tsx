import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Search,
  Users,
  WalletCards,
} from 'lucide-react';
import { usePortal } from '../context/PortalContext';
import { formatInr, orderTonnage } from '../types/portal';

interface DealerRow {
  id: string;
  name: string;
  code: string;
  region: string;
  mtdSales: number;
  ytdSales: number;
  orders: number;
  creditUtilized: number;
  status: 'Active' | 'Attention' | 'Inactive';
}

const DEALERS: DealerRow[] = [
  {
    id: 'DEALER-001',
    name: 'ABC Distributors',
    code: 'BPD-MH-001',
    region: 'West',
    mtdSales: 4200000,
    ytdSales: 48000000,
    orders: 24,
    creditUtilized: 72,
    status: 'Active',
  },
  {
    id: 'DEALER-002',
    name: 'XYZ Polymers',
    code: 'BPD-MH-002',
    region: 'West',
    mtdSales: 3600000,
    ytdSales: 39000000,
    orders: 19,
    creditUtilized: 61,
    status: 'Active',
  },
  {
    id: 'DEALER-003',
    name: 'PQR Agencies',
    code: 'BPD-KA-003',
    region: 'South',
    mtdSales: 1800000,
    ytdSales: 21000000,
    orders: 11,
    creditUtilized: 91,
    status: 'Attention',
  },
  {
    id: 'DEALER-004',
    name: 'Metro Polymer House',
    code: 'BPD-GJ-004',
    region: 'West',
    mtdSales: 2900000,
    ytdSales: 32500000,
    orders: 17,
    creditUtilized: 48,
    status: 'Active',
  },
  {
    id: 'DEALER-005',
    name: 'Eastern Resin Traders',
    code: 'BPD-WB-005',
    region: 'East',
    mtdSales: 2200000,
    ytdSales: 27800000,
    orders: 13,
    creditUtilized: 67,
    status: 'Active',
  },
  {
    id: 'DEALER-006',
    name: 'Southline Industrial Supply',
    code: 'BPD-TN-006',
    region: 'South',
    mtdSales: 1500000,
    ytdSales: 18800000,
    orders: 8,
    creditUtilized: 94,
    status: 'Attention',
  },
];

export function DealerNetwork() {
  const { orders } = usePortal();
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('All');
  const [status, setStatus] = useState('All');

  const currentDealer = orders[0];

  const filtered = useMemo(() => {
    return DEALERS.filter((dealer) => {
      const text = `${dealer.name} ${dealer.code} ${dealer.region}`.toLowerCase();

      return (
        text.includes(search.toLowerCase()) &&
        (region === 'All' || dealer.region === region) &&
        (status === 'All' || dealer.status === status)
      );
    });
  }, [region, search, status]);

  const openDealer = (dealer: DealerRow) => {
    sessionStorage.setItem('selectedDealerId', dealer.id);

    window.dispatchEvent(
      new CustomEvent('dealer-selected', {
        detail: dealer.id,
      }),
    );
  };

  const openDealerPage = (dealer: DealerRow) => {
    sessionStorage.setItem('selectedDealerId', dealer.id);
    window.dispatchEvent(
      new CustomEvent('dealer-selected', {
        detail: dealer.id,
      }),
    );
    window.history.pushState({}, '', '#dealer360');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <div className="space-y-5">
      <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-rose-600">
          Channel Management
        </p>
        <h1 className="mt-1 text-2xl font-black text-slate-950">
          Dealer Network
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Network-wide dealer performance, credit exposure and engagement.
        </p>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ['Total Dealers', '186', Users],
          ['Active Dealers', '171', Users],
          ['Dealers Near Credit Limit', '17', WalletCards],
          ['Overdue / Attention', '9', AlertTriangle],
        ].map(([label, value, Icon]) => {
          const MetricIcon = Icon as typeof Users;

          return (
            <div
              key={String(label)}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex justify-between">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                  {label}
                </p>
                <MetricIcon size={18} className="text-rose-600" />
              </div>
              <p className="mt-3 font-mono text-2xl font-black">
                {value}
              </p>
            </div>
          );
        })}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:w-80">
            <Search
              size={16}
              className="absolute left-3 top-2.5 text-slate-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search dealer..."
              className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold"
            >
              <option>All</option>
              <option>North</option>
              <option>West</option>
              <option>South</option>
              <option>East</option>
            </select>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold"
            >
              <option>All</option>
              <option>Active</option>
              <option>Attention</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-slate-50 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3">Dealer</th>
                <th className="px-5 py-3">Region</th>
                <th className="px-5 py-3">MTD Sales</th>
                <th className="px-5 py-3">YTD Sales</th>
                <th className="px-5 py-3">Orders</th>
                <th className="px-5 py-3">Credit</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filtered.map((dealer) => (
                <tr
                  key={dealer.id}
                  className="cursor-pointer hover:bg-slate-50"
                  onClick={() => openDealer(dealer)}
                >
                  <td className="px-5 py-3">
                    <p className="font-bold text-slate-900">{dealer.name}</p>
                    <p className="font-mono text-[10px] text-slate-500">
                      {dealer.code}
                    </p>
                  </td>

                  <td className="px-5 py-3">{dealer.region}</td>

                  <td className="px-5 py-3 font-mono text-xs font-bold">
                    {formatInr(dealer.mtdSales)}
                  </td>

                  <td className="px-5 py-3 font-mono text-xs font-bold">
                    {formatInr(dealer.ytdSales)}
                  </td>

                  <td className="px-5 py-3 font-mono">{dealer.orders}</td>

                  <td className="px-5 py-3">
                    <span
                      className={`font-mono font-bold ${
                        dealer.creditUtilized >= 90
                          ? 'text-rose-600'
                          : dealer.creditUtilized >= 75
                            ? 'text-amber-600'
                            : 'text-emerald-600'
                      }`}
                    >
                      {dealer.creditUtilized}%
                    </span>
                  </td>

                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                        dealer.status === 'Attention'
                          ? 'bg-amber-100 text-amber-800'
                          : dealer.status === 'Inactive'
                            ? 'bg-slate-100 text-slate-600'
                            : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {dealer.status}
                    </span>
                  </td>

                  <td className="px-5 py-3">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        openDealerPage(dealer);
                      }}
                      className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-rose-600"
                    >
                      Dealer 360°
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="p-10 text-center text-sm text-slate-500">
            No dealers match the selected filters.
          </div>
        )}
      </section>

      {currentDealer && (
        <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-xs text-blue-800">
          Current synchronized order book contains{' '}
          <strong>{orders.length}</strong> orders and{' '}
          <strong>
            {orders.reduce((sum, order) => sum + orderTonnage(order), 0).toLocaleString('en-IN')} MT
          </strong>{' '}
          across the existing portal state.
        </div>
      )}
    </div>
  );
}
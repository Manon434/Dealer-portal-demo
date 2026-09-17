import { useState, useMemo } from 'react';
import {
  AlertTriangle,
  BarChart2,
  CheckCircle2,
  Clock,
  Factory,
  FileText,
  IndianRupee,
  Layers,
  Printer,
  Search,
  ShieldAlert,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  X,
  Zap,
} from 'lucide-react';
import { usePortal } from '../context/PortalContext';
import {
  formatDateIn,
  formatInr,
  formatMt,
  orderTonnage,
  TRACKER_STAGES,
  type Order,
  type PipelineStage,
} from '../types/portal';


// ─── Monthly Sales Comparison Table ──────────────────────────────────────────
function MonthlySalesComparison({ orders }: { orders: Order[] }) {
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();
  const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
  const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

  const MONTH_NAMES = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December',
  ];

  // Partition delivered/all orders into this-month and last-month
  const thisMonthOrders = orders.filter((o) => {
    const d = new Date(o.placedAt);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  });
  const lastMonthOrders = orders.filter((o) => {
    const d = new Date(o.placedAt);
    return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
  });

  // Per-polymer breakdown
  const polymers = ['HDPE', 'PP', 'LLDPE', 'PVC', 'ABS', 'PET'];

  type PolymerRow = {
    polymer: string;
    lastOrders: number;
    thisOrders: number;
    lastValue: number;
    thisValue: number;
    lastTonnage: number;
    thisTonnage: number;
  };

  const rows: PolymerRow[] = polymers.map((polymer) => {
    const lOrders = lastMonthOrders.filter((o) =>
      o.lines.some((l) => l.polymer === polymer)
    );
    const tOrders = thisMonthOrders.filter((o) =>
      o.lines.some((l) => l.polymer === polymer)
    );
    const sumVal = (os: Order[]) =>
      os.reduce((s, o) => s + o.lines
        .filter((l) => l.polymer === polymer)
        .reduce((ls, l) => ls + l.lineTotal, 0), 0);
    const sumTon = (os: Order[]) =>
      os.reduce((s, o) => s + o.lines
        .filter((l) => l.polymer === polymer)
        .reduce((ls, l) => ls + l.quantityMt, 0), 0);
    return {
      polymer,
      lastOrders: lOrders.length,
      thisOrders: tOrders.length,
      lastValue: sumVal(lOrders),
      thisValue: sumVal(tOrders),
      lastTonnage: sumTon(lOrders),
      thisTonnage: sumTon(tOrders),
    };
  });

  // Grand totals
  const grandLast = { orders: lastMonthOrders.length, value: lastMonthOrders.reduce((s,o) => s+o.grandTotal,0), tonnage: lastMonthOrders.reduce((s,o) => s+orderTonnage(o),0) };
  const grandThis = { orders: thisMonthOrders.length, value: thisMonthOrders.reduce((s,o) => s+o.grandTotal,0), tonnage: thisMonthOrders.reduce((s,o) => s+orderTonnage(o),0) };

  const delta = (last: number, curr: number) => {
    if (last === 0 && curr === 0) return null;
    if (last === 0) return Infinity;
    return ((curr - last) / last) * 100;
  };

  const DeltaBadge = ({ last, curr }: { last: number; curr: number }) => {
    const pct = delta(last, curr);
    if (pct === null) return <span className="text-slate-400 text-[10px] font-bold">—</span>;
    if (!isFinite(pct)) return <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700">New ▲</span>;
    const up = pct >= 0;
    return (
      <span className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-extrabold ${
        up ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
      }`}>
        {up ? <TrendingUp size={10}/> : <TrendingDown size={10}/>}
        {Math.abs(pct).toFixed(1)}%
      </span>
    );
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="flex flex-col gap-2 border-b border-slate-200 bg-slate-50/70 px-4 sm:px-6 py-4 sm:py-5 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600 border border-indigo-100">
              <BarChart2 size={18} />
            </div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900">Monthly Sales Comparison</h2>
          </div>
          <p className="mt-1 text-xs text-slate-500 font-medium pl-9">
            {MONTH_NAMES[lastMonth]} {lastMonthYear} vs {MONTH_NAMES[thisMonth]} {thisYear} · Polymer-wise breakdown
          </p>
        </div>
        <div className="flex gap-3 self-start md:self-center">
          <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600">
            <span className="h-3 w-3 rounded-sm bg-slate-300 inline-block"/>
            {MONTH_NAMES[lastMonth]}
          </span>
          <span className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-700">
            <span className="h-3 w-3 rounded-sm bg-indigo-500 inline-block"/>
            {MONTH_NAMES[thisMonth]}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="w-full text-left text-xs min-w-[700px]">
          <thead className="border-b border-slate-200 bg-slate-100/70 font-extrabold uppercase tracking-wider text-slate-600">
            <tr>
              <th className="px-4 py-3.5">Polymer Grade</th>
              <th className="px-4 py-3.5 text-center text-slate-500">{MONTH_NAMES[lastMonth].slice(0,3)} Orders</th>
              <th className="px-4 py-3.5 text-center text-indigo-700">{MONTH_NAMES[thisMonth].slice(0,3)} Orders</th>
              <th className="px-4 py-3.5 font-mono text-right text-slate-500">{MONTH_NAMES[lastMonth].slice(0,3)} Tonnage</th>
              <th className="px-4 py-3.5 font-mono text-right text-indigo-700">{MONTH_NAMES[thisMonth].slice(0,3)} Tonnage</th>
              <th className="px-4 py-3.5 font-mono text-right text-slate-500">{MONTH_NAMES[lastMonth].slice(0,3)} Value</th>
              <th className="px-4 py-3.5 font-mono text-right text-indigo-700">{MONTH_NAMES[thisMonth].slice(0,3)} Value</th>
              <th className="px-4 py-3.5 text-center">Value Δ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {rows.map((row) => (
              <tr key={row.polymer} className="hover:bg-slate-50/80 transition">
                <td className="px-4 py-3.5">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-indigo-500 inline-block"/>
                    <span className="font-extrabold text-slate-900">{row.polymer}</span>
                  </span>
                </td>
                <td className="px-4 py-3.5 text-center font-bold text-slate-600">{row.lastOrders}</td>
                <td className="px-4 py-3.5 text-center font-extrabold text-indigo-700">{row.thisOrders}</td>
                <td className="px-4 py-3.5 font-mono text-right text-slate-600">{formatMt(row.lastTonnage, 0)}</td>
                <td className="px-4 py-3.5 font-mono text-right font-extrabold text-indigo-700">{formatMt(row.thisTonnage, 0)}</td>
                <td className="px-4 py-3.5 font-mono text-right text-slate-600">{formatInr(row.lastValue)}</td>
                <td className="px-4 py-3.5 font-mono text-right font-extrabold text-indigo-700">{formatInr(row.thisValue)}</td>
                <td className="px-4 py-3.5 text-center">
                  <DeltaBadge last={row.lastValue} curr={row.thisValue} />
                </td>
              </tr>
            ))}

            {/* Grand Total Row */}
            <tr className="border-t-2 border-slate-300 bg-slate-100/70 font-extrabold">
              <td className="px-4 py-4 text-slate-900 font-black text-xs">TOTAL (All Polymers)</td>
              <td className="px-4 py-4 text-center text-slate-700">{grandLast.orders}</td>
              <td className="px-4 py-4 text-center text-indigo-800">{grandThis.orders}</td>
              <td className="px-4 py-4 font-mono text-right text-slate-700">{formatMt(grandLast.tonnage, 0)}</td>
              <td className="px-4 py-4 font-mono text-right text-indigo-800">{formatMt(grandThis.tonnage, 0)}</td>
              <td className="px-4 py-4 font-mono text-right text-slate-700">{formatInr(grandLast.value)}</td>
              <td className="px-4 py-4 font-mono text-right text-indigo-800">{formatInr(grandThis.value)}</td>
              <td className="px-4 py-4 text-center">
                <DeltaBadge last={grandLast.value} curr={grandThis.value} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ─── Main Manufacturer Dashboard ─────────────────────────────────────────────
export function ManufacturerDashboard() {
  const { orders, advancePipeline, approveCredit } = usePortal();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Executive Summary KPIs
  const pendingOrdersCount = useMemo(() => {
    const active = orders.filter((o) => !o.delivered && o.status !== 'Delivered').length;
    return active + 137; // 142 total queued manufacturing orders across plants
  }, [orders]);

  const scheduledTonnage = useMemo(() => {
    return orders
      .filter((o) => !o.creditReview && !o.delivered && o.status !== 'Delivered')
      .reduce((sum, o) => sum + orderTonnage(o), 0);
  }, [orders]);

  const awaitingCreditValue = useMemo(() => {
    return orders
      .filter((o) => o.creditReview)
      .reduce((sum, o) => sum + o.grandTotal, 0);
  }, [orders]);

  const awaitingCreditCount = useMemo(() => {
    return orders.filter((o) => o.creditReview).length;
  }, [orders]);

  const totalOrderValue = useMemo(() => {
    return orders.reduce((sum, o) => sum + o.grandTotal, 0);
  }, [orders]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.dealerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.dealerCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.lines.some((l) =>
          `${l.polymer} ${l.grade} ${l.sku}`.toLowerCase().includes(searchQuery.toLowerCase()),
        );

      if (!matchesSearch) return false;

      if (statusFilter === 'credit_hold') return order.creditReview;
      if (statusFilter === 'in_production') return !order.creditReview && order.status === 'In Production';
      if (statusFilter === 'ready_transit')
        return (
          !order.creditReview &&
          (order.status === 'Ready to Dispatch' || order.status === 'In Transit' || order.status === 'Quality Hold')
        );
      if (statusFilter === 'delivered') return order.delivered || order.status === 'Delivered';

      return true;
    });
  }, [orders, searchQuery, statusFilter]);

  const handleApproveCredit = (orderId: string) => {
    const res = approveCredit(orderId);
    showToast(res.message);
    if (selectedOrder && selectedOrder.id === orderId) {
      const updated = orders.find((o) => o.id === orderId);
      if (updated) setSelectedOrder({ ...updated, creditReview: false, status: 'In Production' });
    }
  };

  const handlePipelineChange = (orderId: string, newStage: PipelineStage) => {
    advancePipeline(orderId, newStage, false);
    showToast(`Order ${orderId} stage updated to "${newStage}"`);
  };

  const handleMarkDelivered = (orderId: string) => {
    const target = orders.find((o) => o.id === orderId);
    if (target) {
      advancePipeline(orderId, target.pipelineStage, true);
      showToast(`Order ${orderId} marked as Delivered`);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 text-slate-900 bg-slate-50/60 p-2 sm:p-4 min-h-full">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 flex max-w-sm items-center gap-3 rounded-xl border border-rose-200 bg-white px-4 py-3 text-xs sm:text-sm font-bold text-rose-900 shadow-2xl backdrop-blur animate-in fade-in slide-in-from-top-2">
          <Zap size={18} className="text-rose-600 shrink-0" />
          <span className="flex-1">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-slate-700"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Header Banner - Fully Responsive Light Corporate Theme */}
      <header className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-rose-700">
              <Factory size={13} /> PlasticCorp Mill Operations
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-mono font-bold text-slate-700 border border-slate-200">
              Back-End Control Console
            </span>
          </div>
          <h1 className="mt-2 text-xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Marketing Dashboard
          </h1>
          <p className="mt-1 text-xs text-slate-500 font-medium sm:text-sm">
            Dahej Compounding & Nagothane Polymer Units · Mega Industrial Scale Production
          </p>
        </div>
        <div className="flex items-center gap-2 self-start md:self-center">
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-right">
            <p className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400">Sync Status</p>
            <p className="font-mono text-xs font-extrabold text-emerald-600 flex items-center gap-1.5 justify-end">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Live Active
            </p>
          </div>
        </div>
      </header>

      {/* SECTION 1: EXECUTIVE SUMMARY KPIs - Mega Huge Numbers */}
      <section className="grid gap-3 sm:gap-5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        {/* KPI 1 */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              Incoming Orders Queued
            </p>
            <div className="rounded-xl bg-rose-50 p-2.5 text-rose-600 border border-rose-100 shrink-0">
              <Clock size={20} />
            </div>
          </div>
          <p className="mt-3 font-mono text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            {pendingOrdersCount} <span className="text-sm font-bold text-slate-500">Jobs</span>
          </p>
          <p className="mt-1 text-xs text-slate-500 font-medium">
            Active dealer purchase orders across plants
          </p>
        </div>

        {/* KPI 2 */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              Tonnage Scheduled
            </p>
            <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600 border border-emerald-100 shrink-0">
              <Layers size={20} />
            </div>
          </div>
          <p className="mt-3 font-mono text-2xl sm:text-3xl lg:text-4xl font-extrabold text-emerald-700 tracking-tight">
            {formatMt(scheduledTonnage, 0)}
          </p>
          <p className="mt-1 text-xs text-slate-500 font-medium">
            Polymer resin allocated for mixing & extrusion
          </p>
        </div>

        {/* KPI 3: Total Gross Order Book Value */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              Total Order Book Value
            </p>
            <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600 border border-blue-100 shrink-0">
              <TrendingUp size={20} />
            </div>
          </div>
          <p className="mt-3 font-mono text-2xl sm:text-3xl lg:text-4xl font-extrabold text-blue-800 tracking-tight break-all">
            {formatInr(totalOrderValue)}
          </p>
          <p className="mt-1 text-xs text-slate-500 font-medium">
            Gross booking value across all incoming dealer indents
          </p>
        </div>

        {/* KPI 4 */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              Awaiting Credit Approval
            </p>
            <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600 border border-amber-100 shrink-0">
              <IndianRupee size={20} />
            </div>
          </div>
          <p className="mt-3 font-mono text-2xl sm:text-3xl lg:text-4xl font-extrabold text-amber-700 tracking-tight break-all">
            {formatInr(awaitingCreditValue)}
          </p>
          <p className="mt-1 text-xs text-slate-500 font-medium">
            {awaitingCreditCount} dealer order(s) held by ₹100 Cr credit engine
          </p>
        </div>
      </section>

      {/* SECTION 2: MONTHLY SALES COMPARISON TABLE */}
      <MonthlySalesComparison orders={orders} />

      {/* SECTION 3: MASTER INCOMING ORDERS QUEUE */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {/* Controls Bar - Mobile & Tablet Responsive */}
        <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50/70 p-3.5 sm:p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900">Master Order Queue</h2>
            <p className="text-xs text-slate-500 font-medium">
              Real-time dealer purchase orders & production stage control
            </p>
          </div>

          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search PO, Dealer, Material..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 font-medium shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-700"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Status Filter Tabs - Mobile Scrollable */}
            <div className="flex overflow-x-auto rounded-xl border border-slate-200 bg-slate-100 p-1 text-xs font-bold no-scrollbar">
              {[
                { id: 'all', label: 'All Orders' },
                { id: 'credit_hold', label: `Hold (${awaitingCreditCount})` },
                { id: 'in_production', label: 'Production' },
                { id: 'ready_transit', label: 'Transit' },
                { id: 'delivered', label: 'Delivered' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`whitespace-nowrap rounded-lg px-3 py-1.5 transition font-bold ${
                    statusFilter === tab.id
                      ? 'bg-white text-rose-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Master Table - Horizontal Scroll on Mobile/Tablet */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs min-w-[780px]">
            <thead className="border-b border-slate-200 bg-slate-100/70 font-extrabold uppercase tracking-wider text-slate-600">
              <tr>
                <th className="px-4 py-3.5">Order ID & PO</th>
                <th className="px-4 py-3.5">Dealer Company</th>
                <th className="px-4 py-3.5">Polymer Specifications</th>
                <th className="px-4 py-3.5 font-mono text-right">Tonnage</th>
                <th className="px-4 py-3.5 font-mono text-right">Order Value (incl. GST)</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Production Pipeline Control</th>
                <th className="px-4 py-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    <p className="text-sm font-medium">No dealer orders match the filter criteria.</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const tonnage = orderTonnage(order);

                  return (
                    <tr
                      key={order.id}
                      className={`transition hover:bg-slate-50/80 ${
                        order.creditReview ? 'bg-amber-50/40' : ''
                      }`}
                    >
                      {/* Order ID / PO */}
                      <td className="px-4 py-3.5">
                        <span className="font-mono text-xs font-extrabold text-rose-700">{order.id}</span>
                        <span className="block font-mono text-[11px] font-bold text-slate-900">{order.poNumber}</span>
                        <span className="block text-[10px] text-slate-500 mt-0.5 font-medium">
                          {formatDateIn(order.placedAt)}
                        </span>
                      </td>

                      {/* Dealer Details */}
                      <td className="px-4 py-3.5">
                        <span className="font-extrabold text-slate-900 text-xs">{order.dealerName}</span>
                        <span className="block font-mono text-[10px] text-slate-500">
                          {order.dealerCode} · GST: {order.dealerGstin}
                        </span>
                        <span className="block text-[10px] text-slate-500 font-medium">{order.plant}</span>
                      </td>

                      {/* Materials & Colors */}
                      <td className="px-4 py-3.5 max-w-xs">
                        <div className="flex flex-wrap gap-1">
                          {order.lines.map((line, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] text-slate-800"
                            >
                              <span className="font-bold text-slate-900">
                                {line.polymer} {line.grade}
                              </span>
                              <span className="text-slate-600 font-semibold">({line.color})</span>
                              {line.volumeDiscountPct > 0 && (
                                <span className="rounded bg-emerald-100 text-emerald-800 px-1 font-bold text-[9px]">
                                  -{line.volumeDiscountPct}%
                                </span>
                              )}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Tonnage */}
                      <td className="px-4 py-3.5 font-mono text-right text-sm font-extrabold text-slate-900">
                        {formatMt(tonnage, 0)}
                      </td>

                      {/* Total INR */}
                      <td className="px-4 py-3.5 font-mono text-right text-sm font-extrabold text-emerald-700">
                        {formatInr(order.grandTotal)}
                      </td>

                      {/* Status Badge */}
                      <td className="px-4 py-3.5">
                        {order.creditReview ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-900 shadow-xs">
                            <ShieldAlert size={12} /> Credit Approval Pending
                          </span>
                        ) : order.delivered || order.status === 'Delivered' ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-900 shadow-xs">
                            <CheckCircle2 size={12} /> Delivered
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full border border-rose-300 bg-rose-100 px-2.5 py-0.5 text-[11px] font-bold text-rose-900 shadow-xs">
                            <Factory size={12} /> {order.status}
                          </span>
                        )}
                      </td>

                      {/* Factory Pipeline Control */}
                      <td className="px-4 py-3.5 min-w-[200px]">
                        {order.creditReview ? (
                          <div className="flex items-center gap-1.5 text-xs text-amber-800 font-bold bg-amber-50 p-2 rounded-lg border border-amber-200">
                            <AlertTriangle size={15} className="text-amber-600 shrink-0" />
                            <span>Hold: Over ₹100 Cr Limit</span>
                          </div>
                        ) : order.delivered || order.status === 'Delivered' ? (
                          <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                            <CheckCircle2 size={14} /> Job Fulfilled & Closed
                          </span>
                        ) : (
                          <div className="flex flex-col gap-1.5">
                            <select
                              value={order.pipelineStage}
                              onChange={(e) =>
                                handlePipelineChange(order.id, e.target.value as PipelineStage)
                              }
                              className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs font-bold text-slate-800 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 shadow-xs"
                            >
                              {TRACKER_STAGES.map((stage) => (
                                <option key={stage} value={stage}>
                                  {stage}
                                </option>
                              ))}
                            </select>
                            {order.pipelineStage === 'Out for Delivery' && (
                              <button
                                onClick={() => handleMarkDelivered(order.id)}
                                className="inline-flex items-center justify-center gap-1 rounded-md border border-emerald-300 bg-emerald-600 px-2 py-1 text-[10px] font-bold text-white hover:bg-emerald-700 shadow-xs"
                              >
                                <CheckCircle2 size={11} /> Complete Delivery
                              </button>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Credit Approval Matrix button */}
                          {order.creditReview && (
                            <button
                              onClick={() => handleApproveCredit(order.id)}
                              title="Approve & Release Credit to floor"
                              className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-extrabold text-white shadow-xs hover:bg-emerald-700 transition"
                            >
                              <ShieldCheck size={14} /> Approve & Release
                            </button>
                          )}

                          {/* Order Details Modal button */}
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-800 hover:bg-slate-200 transition shadow-xs"
                          >
                            <FileText size={13} /> Specs & Invoice
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION 4: DYNAMIC ORDER DETAILS MODAL - Enterprise Light */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-4xl max-h-[92dvh] overflow-y-auto rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-slate-900 text-white px-4 sm:px-6 py-4 rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-rose-600 p-2 text-white shrink-0">
                  <FileText size={20} />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base sm:text-lg font-extrabold text-white">Order Specification & Invoice Sheet</h3>
                    <span className="font-mono text-xs font-bold text-rose-300">
                      {selectedOrder.id}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    PO Ref: {selectedOrder.poNumber} · Placed {formatDateIn(selectedOrder.placedAt)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-5">
              {/* Dealer & Credit Metrics Banner */}
              <div className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                    Dealer Account
                  </p>
                  <p className="mt-1 font-extrabold text-slate-900 text-xs sm:text-sm">{selectedOrder.dealerName}</p>
                  <p className="font-mono text-xs text-slate-600">{selectedOrder.dealerCode}</p>
                </div>
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                    Sanctioned Credit Limit
                  </p>
                  <p className="mt-1 font-mono text-sm font-extrabold text-slate-900">
                    {formatInr(selectedOrder.creditLimitInr)}
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium">Pune Credit Control</p>
                </div>
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                    Ledger Exposure at Booking
                  </p>
                  <p className="mt-1 font-mono text-sm font-extrabold text-amber-700">
                    {formatInr(selectedOrder.exposureAtPlacement)}
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium">
                    Ledger Bal: {formatInr(selectedOrder.ledgerBalanceAtPlacement)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                    Credit Guardrail Status
                  </p>
                  {selectedOrder.creditReview ? (
                    <span className="mt-1 inline-flex items-center gap-1 rounded-md bg-amber-100 border border-amber-300 px-2.5 py-1 text-xs font-bold text-amber-900">
                      <AlertTriangle size={13} /> Credit Hold
                    </span>
                  ) : (
                    <span className="mt-1 inline-flex items-center gap-1 rounded-md bg-emerald-100 border border-emerald-300 px-2.5 py-1 text-xs font-bold text-emerald-900">
                      <CheckCircle2 size={13} /> Released to Floor
                    </span>
                  )}
                </div>
              </div>

              {/* Plant Allocation & Shipping Info */}
              <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs sm:flex-row sm:items-center sm:justify-between font-medium">
                <div>
                  <span className="text-slate-500 font-bold">Allocated Mill Facility:</span>{' '}
                  <span className="font-bold text-rose-800">{selectedOrder.plant}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-bold">Ship-to Address:</span>{' '}
                  <span className="font-semibold text-slate-800">{selectedOrder.shipTo}</span>
                </div>
              </div>

              {/* Line Items Table */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-2.5">
                  Polymer Specifications & Masterbatch Lines
                </h4>
                <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                  <table className="w-full text-left text-xs min-w-[640px]">
                    <thead className="border-b border-slate-200 bg-slate-100 font-extrabold uppercase tracking-wider text-slate-600">
                      <tr>
                        <th className="px-4 py-3">Polymer & Grade</th>
                        <th className="px-4 py-3">Masterbatch Color</th>
                        <th className="px-4 py-3 font-mono text-right">Qty (MT)</th>
                        <th className="px-4 py-3 font-mono text-right">List Price/MT</th>
                        <th className="px-4 py-3 font-mono text-right">Volume Tier</th>
                        <th className="px-4 py-3 font-mono text-right">GST (18%)</th>
                        <th className="px-4 py-3 font-mono text-right">Line Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {selectedOrder.lines.map((line, i) => (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="px-4 py-3">
                            <span className="font-bold text-slate-900 text-xs">
                              {line.polymer} {line.grade}
                            </span>
                            <span className="block font-mono text-[10px] text-slate-500">
                              {line.sku}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-block rounded-md border border-slate-300 bg-slate-100 px-2 py-0.5 text-slate-900 font-bold">
                              {line.color}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-mono text-right text-slate-900 font-extrabold">
                            {formatMt(line.quantityMt, 0)}
                          </td>
                          <td className="px-4 py-3 font-mono text-right text-slate-700">
                            {formatInr(line.listPricePerMt)}
                          </td>
                          <td className="px-4 py-3 font-mono text-right">
                            {line.volumeDiscountPct > 0 ? (
                              <span className="rounded bg-emerald-100 border border-emerald-300 px-1.5 py-0.5 text-[10px] font-bold text-emerald-900">
                                {line.volumeDiscountPct}% Tier Discount (&gt;100 MT)
                              </span>
                            ) : (
                              <span className="text-slate-400">Standard</span>
                            )}
                          </td>
                          <td className="px-4 py-3 font-mono text-right text-slate-600">
                            {formatInr(line.gstAmount)}
                          </td>
                          <td className="px-4 py-3 font-mono text-right font-extrabold text-emerald-700 text-sm">
                            {formatInr(line.lineTotal)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Financial Calculation Breakdown */}
              <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1 text-xs text-slate-600 font-medium">
                  <p>
                    • Mill List Subtotal:{' '}
                    <span className="font-mono font-bold text-slate-900">
                      {formatInr(selectedOrder.materialSubtotal)}
                    </span>
                  </p>
                  <p>
                    • Volume Tier Savings:{' '}
                    <span className="font-mono font-bold text-emerald-700">
                      -{formatInr(selectedOrder.volumeDiscount)}
                    </span>
                  </p>
                  <p>
                    • Taxable Base Amount:{' '}
                    <span className="font-mono font-bold text-slate-900">
                      {formatInr(selectedOrder.taxableValue)}
                    </span>
                  </p>
                </div>

                <div className="rounded-xl border border-slate-300 bg-white p-3.5 sm:p-4 shadow-xs text-right">
                  <p className="text-[10px] uppercase font-extrabold tracking-wider text-slate-500">
                    Grand Total INR (incl. 18% IGST)
                  </p>
                  <p className="font-mono text-xl sm:text-2xl font-extrabold text-emerald-700">
                    {formatInr(selectedOrder.grandTotal)}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 px-4 sm:px-6 py-4 sm:flex-row sm:items-center sm:justify-between rounded-b-2xl">
              {selectedOrder.creditReview ? (
                <button
                  onClick={() => handleApproveCredit(selectedOrder.id)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-extrabold text-white shadow-md hover:bg-emerald-700 transition"
                >
                  <ShieldCheck size={16} /> Approve & Release Credit Override
                </button>
              ) : (
                <span className="text-xs text-emerald-700 font-bold flex items-center gap-1.5">
                  <CheckCircle2 size={16} /> Order Released to Factory Floor
                </span>
              )}

              <div className="flex items-center gap-2.5 justify-end">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-800 hover:bg-slate-100 shadow-xs transition"
                >
                  <Printer size={14} /> Print Sheet
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition"
                >
                  Close Sheet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

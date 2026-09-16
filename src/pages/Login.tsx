import { useState, type FormEvent } from 'react';
import { CATALOG_PRODUCTS, DEMO_DEALER, formatInr, formatMt, type UserRole } from '../types/portal';
import { usePortal } from '../context/PortalContext';
import { Building2, Factory, ShieldCheck, Zap } from 'lucide-react';

export function Login() {
  const { login, authError } = usePortal();
  const [activeTab, setActiveTab] = useState<UserRole>('dealer');
  const [email, setEmail] = useState('dealer@bharatplastics.in');
  const [password, setPassword] = useState('password123');

  const handleTabChange = (role: UserRole) => {
    setActiveTab(role);
    if (role === 'dealer') {
      setEmail('dealer@bharatplastics.in');
      setPassword('password123');
    } else {
      setEmail('manufacturer@plasticcorp.in');
      setPassword('password123');
    }
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    login(email, password);
  };

  const quickLoginDealer = () => {
    login('dealer@bharatplastics.in', 'password123');
  };

  const quickLoginManufacturer = () => {
    login('manufacturer@plasticcorp.in', 'password123');
  };

  const hdpe = CATALOG_PRODUCTS[0];
  const pp = CATALOG_PRODUCTS[1];
  const lldpe = CATALOG_PRODUCTS[2];
  const pvc = CATALOG_PRODUCTS[3];

  const isManufacturer = activeTab === 'manufacturer';

  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-slate-50 text-slate-900">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(244,63,94,0.06),_transparent_45%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.06),_transparent_40%)]" />

      <div className="relative mx-auto flex min-h-dvh max-w-6xl flex-col px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Top Role Selector Tabs */}
        <div className="mb-6 flex justify-center">
          <div className="inline-flex rounded-2xl border border-slate-200 bg-slate-200/70 p-1.5 shadow-sm">
            <button
              type="button"
              onClick={() => handleTabChange('dealer')}
              className={`flex items-center gap-2.5 rounded-xl px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider transition ${
                activeTab === 'dealer'
                  ? 'bg-white text-emerald-800 shadow-md border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 size={16} />
              Dealer Portal Login
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('manufacturer')}
              className={`flex items-center gap-2.5 rounded-lg px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider transition ${
                activeTab === 'manufacturer'
                  ? 'bg-white text-rose-700 shadow-md border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Factory size={16} />
              Manufacturer Admin Login
            </button>
          </div>
        </div>

        {/* Header Section */}
        <header className="flex flex-col gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <p
              className={`text-[11px] font-extrabold uppercase tracking-[0.18em] ${
                isManufacturer ? 'text-rose-700' : 'text-emerald-700'
              }`}
            >
              {isManufacturer ? 'PlasticCorp India Operations' : 'Bharat Plastics Ltd.'}
            </p>
            <p className="mt-1 break-all font-mono text-[11px] text-slate-500 font-medium">
              {isManufacturer ? 'MILL CONTROL REGISTRATION ID #MC-9904' : 'CIN L25209GJ1998PLC024418'}
            </p>
            <h1 className="mt-2 text-xl font-extrabold text-slate-900 sm:text-3xl tracking-tight">
              {isManufacturer ? 'Manufacturer Admin Operations Center' : 'West Region Dealer Indent Desk'}
            </h1>
            <p className="mt-1 text-xs leading-relaxed text-slate-600 font-medium sm:text-sm">
              {isManufacturer
                ? 'Dahej Compounding · Nagothane PP · Real-time Dealer Fulfillment & Credit Matrix'
                : 'Dahej compounding · Nagothane PP · Jamnagar LLDPE · Kota vinyl · ship-to Chakan MIDC'}
            </p>
          </div>
          <dl className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-3 lg:max-w-md lg:grid-cols-1 lg:text-right">
            <div className="flex items-baseline justify-between gap-3 lg:block">
              <dt className="text-slate-500 font-semibold">Auth Realm</dt>
              <dd className="font-mono font-bold text-slate-900">
                {isManufacturer ? 'Manufacturer Back-End' : 'Dealer Frontend'}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-3 lg:block">
              <dt className="text-slate-500 font-semibold">Target Mailbox</dt>
              <dd className="font-mono font-bold text-slate-900">{email}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-3 lg:block">
              <dt className="text-slate-500 font-semibold">Sync Status</dt>
              <dd className="text-emerald-700 font-bold">Real-time Bi-directional</dd>
            </div>
          </dl>
        </header>

        {/* Main Section */}
        <div className="grid flex-1 items-start gap-8 py-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-12">
          {/* Info Side */}
          <section className="order-2 space-y-6 lg:order-1">
            <div>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider ${
                  isManufacturer
                    ? 'border border-rose-200 bg-rose-50 text-rose-800'
                    : 'border border-emerald-200 bg-emerald-50 text-emerald-800'
                }`}
              >
                {isManufacturer ? <Factory size={14} /> : <Building2 size={14} />}
                {isManufacturer ? 'Role B · Manufacturer Admin' : 'Role A · Authorized Dealer'}
              </span>
              <h2 className="mt-3 max-w-xl text-2xl sm:text-4xl font-extrabold leading-tight text-slate-900">
                {isManufacturer
                  ? 'Fulfill dealer orders & control mill production floors'
                  : 'Book West-region resin against live mill allocation'}
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 font-medium">
                {isManufacturer
                  ? 'Logging in as Manufacturer Admin unlocks full control over the Master Incoming Queue, pipeline stage stepper advances, invoice spec sheet inspector, and credit approval guardrail overrides.'
                  : `This gate is for ${DEMO_DEALER.legalName} (${DEMO_DEALER.partnerCode}). Indents debit the Pune hub GSTIN ${DEMO_DEALER.gstin} and the sanctioned limit of ${formatInr(DEMO_DEALER.creditLimitInr)}.`}
              </p>
            </div>

            <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[hdpe, pp, lldpe, pvc].map((product) => (
                <li
                  key={product.id}
                  className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm"
                >
                  <p className={`font-mono text-[10px] font-bold ${isManufacturer ? 'text-rose-700' : 'text-emerald-700'}`}>
                    {product.sku}
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-900">
                    {product.polymer} {product.grade}
                  </p>
                  <p className="mt-2 font-mono text-lg font-extrabold text-slate-900">
                    {formatMt(product.availableStockMt, 0)}
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium">{product.plant.split(' ')[0]} stock</p>
                </li>
              ))}
            </ul>

            <dl className="grid gap-3 text-sm text-slate-700 sm:grid-cols-3 font-medium">
              <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
                <dt className="text-[11px] uppercase font-bold tracking-wide text-slate-500">
                  {isManufacturer ? 'Pipeline Stages' : 'Volume Slab'}
                </dt>
                <dd className="mt-1 text-xs text-slate-700">
                  {isManufacturer
                    ? 'Advance jobs from Mixing to Extrusion, QA, Transport & Delivery in real-time.'
                    : '10% off list when a single grade exceeds 100 MT on one indent.'}
                </dd>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
                <dt className="text-[11px] uppercase font-bold tracking-wide text-slate-500">
                  {isManufacturer ? 'Credit Guardrail' : 'GST Posting'}
                </dt>
                <dd className="mt-1 text-xs text-slate-700">
                  {isManufacturer
                    ? 'Manually release credit locks on over-limit dealer purchases with 1 click.'
                    : 'IGST 18% on discounted taxable value; e-invoice series BP-2026-xx.'}
                </dd>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
                <dt className="text-[11px] uppercase font-bold tracking-wide text-slate-500">
                  {isManufacturer ? 'Spec Sheets' : 'Over-Limit Indents'}
                </dt>
                <dd className="mt-1 text-xs text-slate-700">
                  {isManufacturer
                    ? 'Inspect masterbatch colors, volume discount flags, and invoice metrics.'
                    : 'Exposure above ₹100 Crores parks the job as Credit Review Pending.'}
                </dd>
              </div>
            </dl>
          </section>

          {/* Form Side */}
          <div className="order-1 w-full space-y-4 lg:order-2">
            {/* Quick Demo Login Cards */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-md">
              <p className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                ⚡ Instant Demo Portal Launch
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={quickLoginDealer}
                  className="flex flex-col gap-1 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-left transition hover:bg-emerald-100 hover:border-emerald-300"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Role A</span>
                    <Zap size={13} className="text-emerald-700" />
                  </div>
                  <p className="text-xs font-bold text-emerald-950">Enter as Dealer</p>
                  <p className="text-[10px] text-emerald-800 font-mono truncate">dealer@bharatplastics.in</p>
                </button>

                <button
                  type="button"
                  onClick={quickLoginManufacturer}
                  className="flex flex-col gap-1 rounded-xl border border-rose-200 bg-rose-50 p-3 text-left transition hover:bg-rose-100 hover:border-rose-300"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800">Role B</span>
                    <Zap size={13} className="text-rose-700" />
                  </div>
                  <p className="text-xs font-bold text-rose-950">Enter as Manufacturer</p>
                  <p className="text-[10px] text-rose-800 font-mono truncate">manufacturer@plasticcorp.in</p>
                </button>
              </div>
            </div>

            {/* Standard Credentials Form */}
            <form
              onSubmit={onSubmit}
              className="w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-lg sm:p-8"
            >
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">
                  {isManufacturer ? 'Manufacturer Admin Authorization' : 'Dealer Indent Desk Sign-In'}
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {isManufacturer
                    ? 'Enter issued mill operations credentials to access the back-end fulfillment system.'
                    : `Mailbox issued by Credit Control · maps to GSTIN ${DEMO_DEALER.gstin}`}
                </p>
              </div>

              <label className="mt-5 block text-xs font-extrabold uppercase tracking-wider text-slate-700">
                Email Mailbox
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 font-mono text-sm text-slate-900 outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800"
                  autoComplete="username"
                />
              </label>

              <label className="mt-4 block text-xs font-extrabold uppercase tracking-wider text-slate-700">
                Password
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 font-mono text-sm text-slate-900 outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800"
                  autoComplete="current-password"
                />
              </label>

              {authError && (
                <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-bold text-red-800">
                  {authError}
                </p>
              )}

              <button
                type="submit"
                className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-extrabold transition shadow-md ${
                  isManufacturer
                    ? 'bg-rose-600 text-white hover:bg-rose-700'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                {isManufacturer ? <Factory size={18} /> : <ShieldCheck size={18} />}
                {isManufacturer ? 'Open Manufacturer Admin Dashboard' : 'Open Dealer Workspace'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

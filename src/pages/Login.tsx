import { useState, type FormEvent } from 'react';
import { CATALOG_PRODUCTS, DEMO_DEALER, formatInr, formatMt } from '../types/portal';
import { usePortal } from '../context/PortalContext';

export function Login() {
  const { login, authError } = usePortal();
  const [email, setEmail] = useState('dealer@bharatplastics.in');
  const [password, setPassword] = useState('password123');

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    login(email, password);
  };

  const hdpe = CATALOG_PRODUCTS[0];
  const pp = CATALOG_PRODUCTS[1];
  const lldpe = CATALOG_PRODUCTS[2];
  const pvc = CATALOG_PRODUCTS[3];

  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-mill-950 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(212,138,34,0.18),_transparent_42%),radial-gradient(circle_at_bottom_right,_rgba(196,220,204,0.12),_transparent_40%)]" />

      <div className="relative mx-auto flex min-h-dvh max-w-6xl flex-col px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        <header className="flex flex-col gap-4 border-b border-white/10 pb-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-kiln-400">
              Bharat Plastics Ltd.
            </p>
            <p className="mt-1 break-all font-mono text-[11px] text-mill-200/80">CIN L25209GJ1998PLC024418</p>
            <h1 className="mt-2 text-xl font-semibold sm:text-2xl">West Region Indent Desk</h1>
            <p className="mt-1 text-xs leading-relaxed text-mill-200 sm:text-sm">
              Dahej compounding · Nagothane PP · Jamnagar LLDPE · Kota vinyl · ship-to Chakan MIDC
            </p>
          </div>
          <dl className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-3 lg:max-w-md lg:grid-cols-1 lg:text-right">
            <div className="flex items-baseline justify-between gap-3 lg:block">
              <dt className="text-mill-200/70">Desk GSTIN</dt>
              <dd className="font-mono text-white">24AABCB4418Q1ZX</dd>
            </div>
            <div className="flex items-baseline justify-between gap-3 lg:block">
              <dt className="text-mill-200/70">Indent cut-off</dt>
              <dd className="font-mono text-white">16:30 IST</dd>
            </div>
            <div className="flex items-baseline justify-between gap-3 lg:block">
              <dt className="text-mill-200/70">Credit Control</dt>
              <dd className="text-white">{DEMO_DEALER.relationshipManager}, Pune</dd>
            </div>
          </dl>
        </header>

        <div className="grid flex-1 items-start gap-8 py-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-12">
          <section className="order-2 space-y-6 lg:order-1">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-kiln-400">
                16 Sep 2026 · B-shift silo board
              </p>
              <h2 className="mt-2 max-w-xl text-3xl font-semibold leading-tight sm:text-4xl">
                Book West-region resin against live mill allocation
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-mill-200">
                This gate is for {DEMO_DEALER.legalName} ({DEMO_DEALER.partnerCode}). Indents debit the Pune
                hub GSTIN {DEMO_DEALER.gstin} and the sanctioned limit of {formatInr(DEMO_DEALER.creditLimitInr)}.
                Today’s Chakan trailer window is 18:00–22:00 IST via NH-48.
              </p>
            </div>

            <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[hdpe, pp, lldpe, pvc].map((product) => (
                <li key={product.id} className="rounded-lg border border-white/10 bg-white/5 px-3 py-3">
                  <p className="font-mono text-[10px] text-kiln-400">{product.sku}</p>
                  <p className="mt-1 text-sm font-semibold">
                    {product.polymer} {product.grade}
                  </p>
                  <p className="mt-2 font-mono text-lg">{formatMt(product.availableStockMt, 0)}</p>
                  <p className="text-[11px] text-mill-200/80">{product.plant.split(' ')[0]} uncommitted</p>
                </li>
              ))}
            </ul>

            <dl className="grid gap-3 text-sm text-mill-100 sm:grid-cols-3">
              <div className="rounded-lg border border-white/10 px-3 py-3">
                <dt className="text-[11px] uppercase tracking-wide text-mill-200/70">Volume slab</dt>
                <dd className="mt-1">10% off list when a single grade exceeds 5 MT on one indent.</dd>
              </div>
              <div className="rounded-lg border border-white/10 px-3 py-3">
                <dt className="text-[11px] uppercase tracking-wide text-mill-200/70">GST posting</dt>
                <dd className="mt-1">IGST 18% on discounted taxable value; e-invoice series BP-2026-xx.</dd>
              </div>
              <div className="rounded-lg border border-white/10 px-3 py-3">
                <dt className="text-[11px] uppercase tracking-wide text-mill-200/70">Over-limit indents</dt>
                <dd className="mt-1">Exposure above ₹15,00,000 parks the job as Credit Review Pending.</dd>
              </div>
            </dl>
          </section>

          <form
            onSubmit={onSubmit}
            className="order-1 w-full rounded-2xl border border-white/10 bg-white/5 p-5 shadow-panel backdrop-blur sm:p-8 lg:order-2"
          >
            <div>
              <h2 className="text-lg font-semibold">Partner sign-in</h2>
              <p className="text-xs text-mill-200">
                Mailbox issued by Credit Control · maps to GSTIN {DEMO_DEALER.gstin}
              </p>
            </div>

            <div className="mt-5 rounded-lg border border-kiln-500/40 bg-kiln-500/10 px-4 py-3 text-sm">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-kiln-400">
                Pune hub test mailbox
              </p>
              <p className="mt-1 break-all font-mono text-[13px] leading-relaxed">
                dealer@bharatplastics.in
                <br />
                password123
              </p>
            </div>

            <label className="mt-6 block text-sm">
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-white/15 bg-mill-900 px-3 py-2.5 text-white outline-none ring-kiln-500 focus:ring-2"
                autoComplete="username"
              />
            </label>
            <label className="mt-4 block text-sm">
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-white/15 bg-mill-900 px-3 py-2.5 text-white outline-none ring-kiln-500 focus:ring-2"
                autoComplete="current-password"
              />
            </label>

            {authError && (
              <p className="mt-4 rounded-md border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                {authError}
              </p>
            )}

            <button
              type="submit"
              className="mt-6 w-full rounded-lg bg-kiln-500 py-2.5 text-sm font-semibold text-mill-950 hover:bg-kiln-400"
            >
              Open Chakan workspace
            </button>
            <p className="mt-4 text-center text-[11px] text-mill-200/80">
              Session stays in this browser tab. Cut-off after 16:30 IST rolls the indent to next B-shift.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

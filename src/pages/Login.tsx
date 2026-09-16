import { useState, type FormEvent } from 'react';
import { Factory, LockKeyhole, ShieldCheck } from 'lucide-react';
import { usePortal } from '../context/PortalContext';

export function Login() {
  const { login, authError } = usePortal();
  const [email, setEmail] = useState('dealer@bharatplastics.in');
  const [password, setPassword] = useState('password123');

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    login(email, password);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-mill-950 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(212,138,34,0.18),_transparent_42%),radial-gradient(circle_at_bottom_right,_rgba(196,220,204,0.12),_transparent_40%)]" />
      <div className="relative mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-6 py-12 lg:grid-cols-2">
        <section>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-kiln-400">
            Bharat Plastics Ltd. · Dahej | Nagothane | Kota | Jamnagar
          </p>
          <h1 className="mt-4 max-w-xl text-4xl font-semibold leading-tight">
            Dealer gateway for 100+ Indian polymer distribution partners
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-mill-200">
            Indent HDPE, PP, LLDPE and PVC against mill allocation, post 18% GST, and operate within a
            sanctioned credit limit of ₹15,00,000. Tonnage is booked in Metric Tons against live West-region
            stock.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-mill-100">
            <li className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 text-kiln-400" size={18} />
              Credit Control blocks processing when GST-inclusive exposure exceeds the limit.
            </li>
            <li className="flex items-start gap-3">
              <Factory className="mt-0.5 text-kiln-400" size={18} />
              Volume discount of 10% auto-applies when a single polymer indent exceeds 5 MT.
            </li>
          </ul>
        </section>

        <form
          onSubmit={onSubmit}
          className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-panel backdrop-blur"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-kiln-500 p-2 text-mill-950">
              <LockKeyhole size={18} />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Secure dealer login</h2>
              <p className="text-xs text-mill-200">GSTIN-linked partner workspace</p>
            </div>
          </div>

          <div className="mt-5 rounded-lg border border-kiln-500/40 bg-kiln-500/10 px-4 py-3 text-sm">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-kiln-400">Tester tip</p>
            <p className="mt-1 font-mono text-[13px] leading-relaxed">
              Dealer Login: dealer@bharatplastics.in
              <br />
              Password: password123
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
            Enter mill workspace
          </button>
          <p className="mt-4 text-center text-[11px] text-mill-200/80">
            Session is held in application memory for this demonstration. No credentials leave the browser.
          </p>
        </form>
      </div>
    </div>
  );
}

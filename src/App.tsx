import { useState } from 'react';
import { Menu } from 'lucide-react';
import { PortalProvider, usePortal } from './context/PortalContext';
import { MobileTabBar, Sidebar } from './components/Sidebar';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Catalog } from './pages/Catalog';
import { Checkout } from './pages/Checkout';
import { Orders } from './pages/Orders';
import { Ledger } from './pages/Ledger';

import { ManufacturerDashboard } from './pages/ManufacturerDashboard';

function Workspace() {
  const { isAuthenticated, role, view, dealer } = usePortal();
  const [navOpen, setNavOpen] = useState(false);

  if (!isAuthenticated) {
    return <Login />;
  }

  if (role === 'manufacturer') {
    return (
      <div className="flex h-dvh overflow-hidden bg-slate-50 font-sans text-slate-900">
        <Sidebar mobileOpen={navOpen} onClose={() => setNavOpen(false)} />
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <header className="z-20 flex shrink-0 items-center justify-between gap-3 border-b border-slate-800 bg-slate-900 px-3 py-3 sm:px-5 lg:px-6 shadow-sm">
            <div className="flex min-w-0 items-center gap-2">
              <button
                type="button"
                className="rounded-md p-2 text-slate-200 hover:bg-slate-800 md:hidden"
                onClick={() => setNavOpen(true)}
                aria-label="Open navigation"
              >
                <Menu size={20} />
              </button>
              <div className="min-w-0">
                <p className="truncate text-[11px] font-bold uppercase tracking-[0.18em] text-rose-400">
                  PLASTICCORP MILL OPERATIONS · DAHEJ & NAGOTHANE COMPLEX
                </p>
                <p className="truncate text-sm font-bold text-white">
                  Manufacturer Admin Control Console
                  <span className="hidden sm:inline text-xs text-slate-300 font-normal"> · Real-time Dealer Fulfillment System</span>
                </p>
              </div>
            </div>
            <div className="hidden items-center gap-3 sm:flex">
              <span className="rounded bg-rose-600/20 px-2.5 py-1 text-[10px] font-mono font-bold text-rose-300 border border-rose-500/40">
                ADMIN LEVEL 1
              </span>
              <p className="font-mono text-xs text-slate-200 font-medium">manufacturer@plasticcorp.in</p>
            </div>
          </header>
          <main className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-3 py-4 pb-24 sm:px-5 sm:py-6 md:pb-6 lg:px-6 bg-slate-50">
            <ManufacturerDashboard />
          </main>
        </div>
      </div>
    );
  }

  const screen =
    view === 'catalog' ? (
      <Catalog />
    ) : view === 'checkout' ? (
      <Checkout />
    ) : view === 'orders' ? (
      <Orders />
    ) : view === 'ledger' ? (
      <Ledger />
    ) : (
      <Dashboard />
    );

  return (
    <div className="flex h-dvh overflow-hidden bg-slate-50 font-sans text-slate-900">
      <Sidebar mobileOpen={navOpen} onClose={() => setNavOpen(false)} />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="z-20 flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-white px-3 py-3 sm:px-5 lg:px-6 shadow-xs">
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              className="rounded-md p-2 text-slate-800 hover:bg-slate-100 md:hidden"
              onClick={() => setNavOpen(true)}
              aria-label="Open navigation"
            >
              <Menu size={20} />
            </button>
            <div className="min-w-0">
              <p className="truncate text-[11px] font-extrabold uppercase tracking-[0.18em] text-emerald-700">
                {dealer.partnerCode} · CHAKAN INDENT DESK
              </p>
              <p className="truncate text-sm font-bold text-slate-900">
                {dealer.city}, {dealer.state}
                <span className="hidden sm:inline text-xs text-slate-500 font-normal"> · {dealer.territory}</span>
              </p>
            </div>
          </div>
          <p className="hidden shrink-0 font-mono text-xs font-semibold text-slate-600 sm:block">{dealer.email}</p>
        </header>
        <main className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-3 py-4 pb-24 sm:px-5 sm:py-6 md:pb-6 lg:px-6 bg-slate-50">
          {screen}
        </main>
      </div>
      <MobileTabBar />
    </div>
  );
}

export default function App() {
  return (
    <PortalProvider>
      <Workspace />
    </PortalProvider>
  );
}

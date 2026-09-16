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

function Workspace() {
  const { isAuthenticated, view, dealer } = usePortal();
  const [navOpen, setNavOpen] = useState(false);

  if (!isAuthenticated) {
    return <Login />;
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
    <div className="flex h-dvh overflow-hidden bg-mill-50">
      <Sidebar mobileOpen={navOpen} onClose={() => setNavOpen(false)} />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="z-20 flex shrink-0 items-center justify-between gap-3 border-b border-mill-200 bg-white px-3 py-3 sm:px-5 lg:px-6">
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              className="rounded-md p-2 text-mill-900 hover:bg-mill-50 md:hidden"
              onClick={() => setNavOpen(true)}
              aria-label="Open navigation"
            >
              <Menu size={20} />
            </button>
            <div className="min-w-0">
              <p className="truncate text-[11px] font-semibold uppercase tracking-[0.18em] text-mill-800/60">
                {dealer.partnerCode} · Chakan indent desk
              </p>
              <p className="truncate text-sm font-medium">
                {dealer.city}, {dealer.state}
                <span className="hidden sm:inline"> · {dealer.territory}</span>
              </p>
            </div>
          </div>
          <p className="hidden shrink-0 font-mono text-xs text-mill-800/80 sm:block">{dealer.email}</p>
        </header>
        <main className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-3 py-4 pb-24 sm:px-5 sm:py-6 md:pb-6 lg:px-6">
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

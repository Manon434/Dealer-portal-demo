import { PortalProvider, usePortal } from './context/PortalContext';
import { Sidebar } from './components/Sidebar';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Catalog } from './pages/Catalog';
import { Checkout } from './pages/Checkout';
import { Orders } from './pages/Orders';
import { Ledger } from './pages/Ledger';

function Workspace() {
  const { isAuthenticated, view, dealer } = usePortal();

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
    <div className="flex min-h-screen bg-mill-50">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-mill-200 bg-white px-6 py-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-mill-800/60">
              Authenticated partner session
            </p>
            <p className="text-sm font-medium">
              {dealer.city}, {dealer.state} · {dealer.territory}
            </p>
          </div>
          <p className="font-mono text-xs text-mill-800/80">{dealer.email}</p>
        </header>
        <main className="flex-1 overflow-y-auto px-6 py-6">{screen}</main>
      </div>
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

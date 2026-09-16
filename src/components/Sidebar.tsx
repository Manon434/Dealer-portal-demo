import {
  BookOpen,
  ClipboardList,
  Factory,
  LayoutDashboard,
  LogOut,
  PackageSearch,
  ShoppingCart,
} from 'lucide-react';
import { usePortal } from '../context/PortalContext';
import type { PortalView } from '../types/portal';
import clsx from 'clsx';

const NAV: { id: PortalView; label: string; hint: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Command Centre', hint: 'Exposure & mill load', icon: LayoutDashboard },
  { id: 'catalog', label: 'Polymer Catalogue', hint: 'Live mill allocation', icon: PackageSearch },
  { id: 'checkout', label: 'Indent Checkout', hint: 'GST & credit check', icon: ShoppingCart },
  { id: 'orders', label: 'My Orders', hint: 'Live job tracker', icon: ClipboardList },
  { id: 'ledger', label: 'Dealer Ledger', hint: 'Tax invoices & UTR', icon: BookOpen },
];

export function Sidebar() {
  const { view, setView, logout, dealer, cart, availableCredit } = usePortal();
  const cartMt = cart.reduce((sum, line) => sum + line.quantityMt, 0);

  return (
    <aside className="flex h-full w-[272px] shrink-0 flex-col border-r border-white/10 bg-mill-950 text-mill-50">
      <div className="border-b border-white/10 px-5 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-kiln-500 text-mill-950">
            <Factory size={22} strokeWidth={2.25} />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-kiln-400">
              Bharat Plastics
            </p>
            <p className="text-sm font-semibold leading-tight">Dealer Portal</p>
          </div>
        </div>
        <p className="mt-4 rounded-md bg-white/5 px-3 py-2 text-[11px] leading-relaxed text-mill-200">
          {dealer.tradeName}
          <span className="mt-1 block font-mono text-[10px] text-kiln-400">{dealer.partnerCode}</span>
        </p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = view === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setView(item.id)}
              className={clsx(
                'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition',
                active ? 'bg-white/10 text-white shadow-inner' : 'text-mill-200 hover:bg-white/5 hover:text-white',
              )}
            >
              <Icon size={18} />
              <span className="flex-1">
                <span className="block text-sm font-medium">{item.label}</span>
                <span className="block text-[11px] text-mill-200/70">{item.hint}</span>
              </span>
              {item.id === 'checkout' && cart.length > 0 && (
                <span className="rounded-full bg-kiln-500 px-2 py-0.5 font-mono text-[10px] font-semibold text-mill-950">
                  {cartMt.toFixed(1)}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-white/10 px-4 py-4">
        <p className="text-[11px] uppercase tracking-wider text-mill-200/80">Headroom</p>
        <p className="mt-1 font-mono text-sm text-white">
          {new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
          }).format(Math.max(0, availableCredit))}
        </p>
        <button
          type="button"
          onClick={logout}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-md border border-white/15 px-3 py-2 text-sm text-mill-100 hover:bg-white/10"
        >
          <LogOut size={15} />
          Sign out
        </button>
      </div>
    </aside>
  );
}

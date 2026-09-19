// import { useEffect } from 'react';
// import {
//   BookOpen,
//   ClipboardList,
//   Factory,
//   LayoutDashboard,
//   LogOut,
//   PackageSearch,
//   ShoppingCart,
//   X,
// } from 'lucide-react';

// import {
//   BarChart3,
//   BookOpen,
//   ClipboardList,
//   Factory,
//   LayoutDashboard,
//   LogOut,
//   PackageSearch,
//   ShoppingCart,
//   Users,
//   Clock3,
//   X,
// } from 'lucide-react';
// import { usePortal } from '../context/PortalContext';
// import type { PortalView } from '../types/portal';
// import { formatInr } from '../types/portal';
// import clsx from 'clsx';

// export const NAV: { id: PortalView; label: string; short: string; hint: string; icon: typeof LayoutDashboard }[] = [
//   { id: 'dashboard', label: 'Command Centre', short: 'Centre', hint: 'Exposure & mill load', icon: LayoutDashboard },
//   { id: 'catalog', label: 'Polymer Catalogue', short: 'Catalogue', hint: 'Live mill allocation', icon: PackageSearch },
//   { id: 'checkout', label: 'Indent Checkout', short: 'Indent', hint: 'GST & credit check', icon: ShoppingCart },
//   { id: 'orders', label: 'My Orders', short: 'Orders', hint: 'Live job tracker', icon: ClipboardList },
//   { id: 'ledger', label: 'Dealer Ledger', short: 'Ledger', hint: 'Tax invoices & UTR', icon: BookOpen },
// ];

// interface SidebarProps {
//   mobileOpen: boolean;
//   onClose: () => void;
// }

// export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
//   const { role, view, setView, logout, dealer, cart, availableCredit, orders } = usePortal();
//   const cartMt = cart.reduce((sum, line) => sum + line.quantityMt, 0);

//   useEffect(() => {
//     document.body.style.overflow = mobileOpen ? 'hidden' : '';
//     return () => {
//       document.body.style.overflow = '';
//     };
//   }, [mobileOpen]);

//   const go = (id: PortalView) => {
//     setView(id);
//     onClose();
//   };

//   if (role === 'manufacturer') {
//     const pendingCreditCount = orders.filter((o) => o.creditReview).length;

//     return (
//       <>
//         <div
//           className={clsx(
//             'fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs transition-opacity md:hidden',
//             mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
//           )}
//           onClick={onClose}
//           aria-hidden={!mobileOpen}
//         />

//         <aside
//           className={clsx(
//             'fixed inset-y-0 left-0 z-50 flex w-[min(18.5rem,88vw)] flex-col border-r border-slate-800 bg-slate-900 text-slate-100 transition-transform md:static md:z-0 md:w-[14rem] md:translate-x-0 lg:w-[17rem] shadow-xl',
//             mobileOpen ? 'translate-x-0' : 'pointer-events-none -translate-x-full md:pointer-events-auto md:translate-x-0',
//           )}
//         >
//           <div className="border-b border-slate-800 px-4 py-5 lg:px-5 lg:py-6">
//             <div className="flex items-start justify-between gap-2">
//               <div className="flex items-center gap-3">
//                 <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-600 text-white shadow-md font-bold">
//                   <Factory size={22} strokeWidth={2.25} />
//                 </div>
//                 <div>
//                   <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-rose-400">
//                     PlasticCorp Mill
//                   </p>
//                   <p className="text-sm font-extrabold leading-tight text-white">Manufacturer Admin</p>
//                 </div>
//               </div>
//               <button
//                 type="button"
//                 className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white md:hidden"
//                 onClick={onClose}
//                 aria-label="Close navigation"
//               >
//                 <X size={18} />
//               </button>
//             </div>
//             <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/80 px-3.5 py-2.5 text-[11px] leading-relaxed text-slate-300">
//               <span className="font-extrabold text-rose-400">Dahej & Nagothane Complex</span>
//               <span className="mt-0.5 block font-mono text-[10px] text-slate-400 font-bold">EXECUTIVE CONTROL CONSOLE</span>
//             </div>
//           </div>

//           // <nav className="flex-1 space-y-1.5 overflow-y-auto px-3 py-4">
//           //   <button
//           //     type="button"
//           //     onClick={() => go('dashboard')}
//           //     className={clsx(
//           //       'flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left transition font-semibold',
//           //       view === 'dashboard' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800 hover:text-white',
//           //     )}
//           //   >
//           //     <LayoutDashboard size={18} className="shrink-0" />
//           //     <span className="min-w-0 flex-1">
//           //       <span className="block truncate text-sm font-bold">Master Order Console</span>
//           //       <span className="hidden truncate text-[11px] text-slate-300 font-medium lg:block">Orders, Pipeline & Credit</span>
//           //     </span>
//           //     {pendingCreditCount > 0 && (
//           //       <span className="rounded-full bg-amber-500 px-2 py-0.5 font-mono text-[10px] font-extrabold text-slate-950 shadow-xs">
//           //         {pendingCreditCount}
//           //       </span>
//           //     )}
//           //   </button>
//           // </nav>
          
//        <nav className="flex-1 space-y-1.5 overflow-y-auto px-3 py-4">
//   {[
//     {
//       id: 'dashboard' as PortalView,
//       label: 'Executive Dashboard',
//       hint: 'Management overview',
//       icon: LayoutDashboard,
//     },
//     {
//       id: 'sales' as PortalView,
//       label: 'Sales Performance',
//       hint: 'MTD, YTD & trends',
//       icon: BarChart3,
//     },
//     {
//       id: 'dealers' as PortalView,
//       label: 'Dealer Network',
//       hint: 'Dealer performance',
//       icon: Users,
//     },
//     {
//       id: 'aging' as PortalView,
//       label: 'Orders & Aging',
//       hint: 'Exceptions & delays',
//       icon: Clock3,
//     },
//   ].map((item) => {
//     const Icon = item.icon;
//     const active = view === item.id;

//     return (
//       <button
//         key={item.id}
//         type="button"
//         onClick={() => go(item.id)}
//         className={clsx(
//           'flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left transition font-semibold',
//           active
//             ? 'bg-rose-600 text-white shadow-md'
//             : 'text-slate-300 hover:bg-slate-800 hover:text-white',
//         )}
//       >
//         <Icon size={18} className="shrink-0" />

//         <span className="min-w-0 flex-1">
//           <span className="block truncate text-sm font-bold">
//             {item.label}
//           </span>

//           <span className="hidden truncate text-[11px] text-slate-300 font-medium lg:block">
//             {item.hint}
//           </span>
//         </span>
//       </button>
//     );
//   })}

//   <div className="my-3 border-t border-slate-800" />

//   <button
//     type="button"
//     onClick={() => go('dashboard')}
//     className={clsx(
//       'flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left transition font-semibold',
//       view === 'dashboard'
//         ? 'bg-slate-800 text-white'
//         : 'text-slate-300 hover:bg-slate-800 hover:text-white',
//     )}
//   >
//     <Factory size={18} />
//     <span>
//       <span className="block text-sm font-bold">Order Console</span>
//       <span className="hidden text-[11px] text-slate-400 lg:block">
//         Production & Credit
//       </span>
//     </span>
//   </button>
// </nav>

//           <div className="border-t border-slate-800 px-4 py-4">
//             <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
//               <p className="text-[11px] font-extrabold uppercase tracking-wider text-rose-400">System Mode</p>
//               <p className="mt-0.5 text-xs text-white font-bold">Enterprise Light Portal</p>
//               <p className="mt-1 font-mono text-[10px] text-emerald-400 font-bold">₹100 Cr Credit Realm</p>
//             </div>
//             <button
//               type="button"
//               onClick={() => {
//                 onClose();
//                 logout();
//               }}
//               className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm font-bold text-slate-200 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition shadow-sm"
//             >
//               <LogOut size={15} />
//               Sign out
//             </button>
//           </div>
//         </aside>
//       </>
//     );
//   }

//   return (
//     <>
//       <div
//         className={clsx(
//           'fixed inset-0 z-40 bg-mill-950/50 transition-opacity md:hidden',
//           mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
//         )}
//         onClick={onClose}
//         aria-hidden={!mobileOpen}
//       />

//       <aside
//         className={clsx(
//           'fixed inset-y-0 left-0 z-50 flex w-[min(18.5rem,88vw)] flex-col border-r border-white/10 bg-mill-950 text-mill-50 transition-transform md:static md:z-0 md:w-[13.5rem] md:translate-x-0 lg:w-[17rem]',
//           mobileOpen ? 'translate-x-0' : 'pointer-events-none -translate-x-full md:pointer-events-auto md:translate-x-0',
//         )}
//       >
//         <div className="border-b border-white/10 px-4 py-5 lg:px-5 lg:py-6">
//           <div className="flex items-start justify-between gap-2">
//             <div className="flex items-center gap-3">
//               <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-kiln-500 text-mill-950">
//                 <Factory size={22} strokeWidth={2.25} />
//               </div>
//               <div>
//                 <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-kiln-400">
//                   Bharat Plastics
//                 </p>
//                 <p className="text-sm font-semibold leading-tight">West indent desk</p>
//               </div>
//             </div>
//             <button
//               type="button"
//               className="rounded-md p-2 text-mill-100 hover:bg-white/10 md:hidden"
//               onClick={onClose}
//               aria-label="Close navigation"
//             >
//               <X size={18} />
//             </button>
//           </div>
//           <p className="mt-4 rounded-md bg-white/5 px-3 py-2 text-[11px] leading-relaxed text-mill-200">
//             {dealer.tradeName}
//             <span className="mt-1 block font-mono text-[10px] text-kiln-400">{dealer.partnerCode}</span>
//           </p>
//         </div>

//         <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
//           {NAV.map((item) => {
//             const Icon = item.icon;
//             const active = view === item.id;
//             return (
//               <button
//                 key={item.id}
//                 type="button"
//                 onClick={() => go(item.id)}
//                 aria-current={active ? 'page' : undefined}
//                 className={clsx(
//                   'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition',
//                   active ? 'bg-white/10 text-white shadow-inner' : 'text-mill-200 hover:bg-white/5 hover:text-white',
//                 )}
//               >
//                 <Icon size={18} className="shrink-0" />
//                 <span className="min-w-0 flex-1">
//                   <span className="block truncate text-sm font-medium">{item.label}</span>
//                   <span className="hidden truncate text-[11px] text-mill-200/70 lg:block">{item.hint}</span>
//                 </span>
//                 {item.id === 'checkout' && cart.length > 0 && (
//                   <span className="rounded-full bg-kiln-500 px-2 py-0.5 font-mono text-[10px] font-semibold text-mill-950">
//                     {cartMt.toFixed(1)}
//                   </span>
//                 )}
//               </button>
//             );
//           })}
//         </nav>

//         <div className="border-t border-white/10 px-4 py-4">
//           <p className="text-[11px] uppercase tracking-wider text-mill-200/80">Credit headroom</p>
//           <p className="mt-1 font-mono text-sm text-white">{formatInr(Math.max(0, availableCredit))}</p>
//           <button
//             type="button"
//             onClick={() => {
//               onClose();
//               logout();
//             }}
//             className="mt-4 flex w-full items-center justify-center gap-2 rounded-md border border-white/15 px-3 py-2 text-sm text-mill-100 hover:bg-white/10"
//           >
//             <LogOut size={15} />
//             Sign out
//           </button>
//         </div>
//       </aside>
//     </>
//   );
// }

// export function MobileTabBar() {
//   const { view, setView, cart } = usePortal();
//   const cartMt = cart.reduce((sum, line) => sum + line.quantityMt, 0);

//   return (
//     <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-mill-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
//       <ul className="grid grid-cols-5">
//         {NAV.map((item) => {
//           const Icon = item.icon;
//           const active = view === item.id;
//           return (
//             <li key={item.id}>
//               <button
//                 type="button"
//                 onClick={() => setView(item.id)}
//                 className={clsx(
//                   'relative flex w-full flex-col items-center gap-0.5 px-1 py-2 text-[10px] font-medium',
//                   active ? 'text-mill-950' : 'text-mill-800/60',
//                 )}
//               >
//                 <Icon size={18} />
//                 {item.short}
//                 {item.id === 'checkout' && cart.length > 0 && (
//                   <span className="absolute right-2 top-1 rounded-full bg-kiln-500 px-1 font-mono text-[9px] text-mill-950">
//                     {cartMt.toFixed(0)}
//                   </span>
//                 )}
//               </button>
//             </li>
//           );
//         })}
//       </ul>
//     </nav>
//   );
// }


import { useEffect } from 'react';
import {
  BarChart3,
  BookOpen,
  ClipboardList,
  Clock3,
  Factory,
  LayoutDashboard,
  LogOut,
  PackageSearch,
  ShoppingCart,
  Users,
  X,
} from 'lucide-react';
import { usePortal } from '../context/PortalContext';
import type { PortalView } from '../types/portal';
import { formatInr } from '../types/portal';
import clsx from 'clsx';

export const NAV: {
  id: PortalView;
  label: string;
  short: string;
  hint: string;
  icon: typeof LayoutDashboard;
}[] = [
  {
    id: 'dashboard',
    label: 'Command Centre',
    short: 'Centre',
    hint: 'Exposure & mill load',
    icon: LayoutDashboard,
  },
  {
    id: 'catalog',
    label: 'Polymer Catalogue',
    short: 'Catalogue',
    hint: 'Live mill allocation',
    icon: PackageSearch,
  },
  {
    id: 'checkout',
    label: 'Indent Checkout',
    short: 'Indent',
    hint: 'GST & credit check',
    icon: ShoppingCart,
  },
  {
    id: 'orders',
    label: 'My Orders',
    short: 'Orders',
    hint: 'Live job tracker',
    icon: ClipboardList,
  },
  {
    id: 'ledger',
    label: 'Dealer Ledger',
    short: 'Ledger',
    hint: 'Tax invoices & UTR',
    icon: BookOpen,
  },
];

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const {
    role,
    view,
    setView,
    logout,
    dealer,
    cart,
    availableCredit,
    orders,
  } = usePortal();

  const cartMt = cart.reduce(
    (sum, line) => sum + line.quantityMt,
    0,
  );

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const go = (id: PortalView) => {
    setView(id);
    onClose();
  };

  /*
   * ============================================================
   * MANUFACTURER SIDEBAR
   * ============================================================
   */
  if (role === 'manufacturer') {
    const pendingCreditCount = orders.filter(
      (o) => o.creditReview,
    ).length;

    const manufacturerNav: {
      id: PortalView;
      label: string;
      hint: string;
      icon: typeof LayoutDashboard;
    }[] = [
      {
        id: 'dashboard',
        label: 'Executive Dashboard',
        hint: 'Management overview',
        icon: LayoutDashboard,
      },
      {
        id: 'sales',
        label: 'Sales Performance',
        hint: 'MTD, YTD & trends',
        icon: BarChart3,
      },
      {
        id: 'dealers',
        label: 'Dealer Network',
        hint: 'Dealer performance',
        icon: Users,
      },
      {
        id: 'aging',
        label: 'Orders & Aging',
        hint: 'Exceptions & delays',
        icon: Clock3,
      },
    ];

    return (
      <>
        <div
          className={clsx(
            'fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs transition-opacity md:hidden',
            mobileOpen
              ? 'opacity-100'
              : 'pointer-events-none opacity-0',
          )}
          onClick={onClose}
          aria-hidden={!mobileOpen}
        />

        <aside
          className={clsx(
            'fixed inset-y-0 left-0 z-50 flex w-[min(18.5rem,88vw)] flex-col border-r border-slate-800 bg-slate-900 text-slate-100 transition-transform md:static md:z-0 md:w-[14rem] md:translate-x-0 lg:w-[17rem] shadow-xl',
            mobileOpen
              ? 'translate-x-0'
              : 'pointer-events-none -translate-x-full md:pointer-events-auto md:translate-x-0',
          )}
        >
          {/* Manufacturer Header */}
          <div className="border-b border-slate-800 px-4 py-5 lg:px-5 lg:py-6">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-600 text-white shadow-md font-bold">
                  <Factory size={22} strokeWidth={2.25} />
                </div>

                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-rose-400">
                    PlasticCorp Mill
                  </p>

                  <p className="text-sm font-extrabold leading-tight text-white">
                    Manufacturer Admin
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white md:hidden"
                onClick={onClose}
                aria-label="Close navigation"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/80 px-3.5 py-2.5 text-[11px] leading-relaxed text-slate-300">
              <span className="font-extrabold text-rose-400">
                Dahej & Nagothane Complex
              </span>

              <span className="mt-0.5 block font-mono text-[10px] text-slate-400 font-bold">
                EXECUTIVE CONTROL CONSOLE
              </span>
            </div>
          </div>

          {/* Manufacturer Navigation */}
          <nav className="flex-1 space-y-1.5 overflow-y-auto px-3 py-4">
            {manufacturerNav.map((item) => {
              const Icon = item.icon;
              const active = view === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => go(item.id)}
                  aria-current={active ? 'page' : undefined}
                  className={clsx(
                    'flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left transition font-semibold',
                    active
                      ? 'bg-rose-600 text-white shadow-md'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white',
                  )}
                >
                  <Icon
                    size={18}
                    className="shrink-0"
                  />

                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold">
                      {item.label}
                    </span>

                    <span className="hidden truncate text-[11px] text-slate-300 font-medium lg:block">
                      {item.hint}
                    </span>
                  </span>
                </button>
              );
            })}

            <div className="my-3 border-t border-slate-800" />

            {/* Existing Order Console */}
            <button
              type="button"
              onClick={() => go('manufacturer-orders')}
              aria-current={
                view === 'manufacturer-orders'
                  ? 'page'
                  : undefined
              }
              className={clsx(
                'flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left transition font-semibold',
                view === 'manufacturer-orders'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white',
              )}
            >
              <Factory size={18} />

              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold">
                  Order Console
                </span>

                <span className="hidden text-[11px] text-slate-400 lg:block">
                  Production & Credit
                </span>
              </span>

              {pendingCreditCount > 0 && (
                <span className="rounded-full bg-amber-500 px-2 py-0.5 font-mono text-[10px] font-extrabold text-slate-950 shadow-xs">
                  {pendingCreditCount}
                </span>
              )}
            </button>
          </nav>

          {/* Manufacturer Footer */}
          <div className="border-t border-slate-800 px-4 py-4">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-rose-400">
                System Mode
              </p>

              <p className="mt-0.5 text-xs text-white font-bold">
                Enterprise Light Portal
              </p>

              <p className="mt-1 font-mono text-[10px] text-emerald-400 font-bold">
                ₹100 Cr Credit Realm
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                logout();
              }}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm font-bold text-slate-200 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition shadow-sm"
            >
              <LogOut size={15} />
              Sign out
            </button>
          </div>
        </aside>
      </>
    );
  }

  /*
   * ============================================================
   * DEALER SIDEBAR
   * ============================================================
   */

  return (
    <>
      <div
        className={clsx(
          'fixed inset-0 z-40 bg-mill-950/50 transition-opacity md:hidden',
          mobileOpen
            ? 'opacity-100'
            : 'pointer-events-none opacity-0',
        )}
        onClick={onClose}
        aria-hidden={!mobileOpen}
      />

      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-50 flex w-[min(18.5rem,88vw)] flex-col border-r border-white/10 bg-mill-950 text-mill-50 transition-transform md:static md:z-0 md:w-[13.5rem] md:translate-x-0 lg:w-[17rem]',
          mobileOpen
            ? 'translate-x-0'
            : 'pointer-events-none -translate-x-full md:pointer-events-auto md:translate-x-0',
        )}
      >
        <div className="border-b border-white/10 px-4 py-5 lg:px-5 lg:py-6">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-kiln-500 text-mill-950">
                <Factory size={22} strokeWidth={2.25} />
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-kiln-400">
                  Bharat Plastics
                </p>

                <p className="text-sm font-semibold leading-tight">
                  West indent desk
                </p>
              </div>
            </div>

            <button
              type="button"
              className="rounded-md p-2 text-mill-100 hover:bg-white/10 md:hidden"
              onClick={onClose}
              aria-label="Close navigation"
            >
              <X size={18} />
            </button>
          </div>

          <p className="mt-4 rounded-md bg-white/5 px-3 py-2 text-[11px] leading-relaxed text-mill-200">
            {dealer.tradeName}

            <span className="mt-1 block font-mono text-[10px] text-kiln-400">
              {dealer.partnerCode}
            </span>
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
                onClick={() => go(item.id)}
                aria-current={active ? 'page' : undefined}
                className={clsx(
                  'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition',
                  active
                    ? 'bg-white/10 text-white shadow-inner'
                    : 'text-mill-200 hover:bg-white/5 hover:text-white',
                )}
              >
                <Icon
                  size={18}
                  className="shrink-0"
                />

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">
                    {item.label}
                  </span>

                  <span className="hidden truncate text-[11px] text-mill-200/70 lg:block">
                    {item.hint}
                  </span>
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
          <p className="text-[11px] uppercase tracking-wider text-mill-200/80">
            Credit headroom
          </p>

          <p className="mt-1 font-mono text-sm text-white">
            {formatInr(Math.max(0, availableCredit))}
          </p>

          <button
            type="button"
            onClick={() => {
              onClose();
              logout();
            }}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-mill-100 hover:bg-white/10"
          >
            <LogOut size={15} />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}

export function MobileTabBar() {
  const { role, view, setView } = usePortal();

  if (role === 'manufacturer') {
    const items: {
      id: PortalView;
      label: string;
      icon: typeof LayoutDashboard;
    }[] = [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: LayoutDashboard,
      },
      {
        id: 'sales',
        label: 'Sales',
        icon: BarChart3,
      },
      {
        id: 'dealers',
        label: 'Dealers',
        icon: Users,
      },
      {
        id: 'aging',
        label: 'Aging',
        icon: Clock3,
      },
      {
        id: 'manufacturer-orders',
        label: 'Orders',
        icon: Factory,
      },
    ];

    return (
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-2 py-2 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur md:hidden">
        <div className="grid grid-cols-5 gap-1">
          {items.map((item) => {
            const Icon = item.icon;
            const active = view === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setView(item.id)}
                className={clsx(
                  'flex min-w-0 flex-col items-center gap-1 rounded-xl px-1 py-2 text-[10px] font-bold transition',
                  active
                    ? 'bg-rose-50 text-rose-600'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900',
                )}
              >
                <Icon size={18} />
                <span className="truncate">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    );
  }

  const items = NAV.slice(0, 5);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-2 py-2 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur md:hidden">
      <div className="grid grid-cols-5 gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = view === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setView(item.id)}
              className={clsx(
                'flex min-w-0 flex-col items-center gap-1 rounded-xl px-1 py-2 text-[10px] font-bold transition',
                active
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900',
              )}
            >
              <Icon size={18} />
              <span className="truncate">
                {item.short}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  CATALOG_PRODUCTS,
  DEMO_DEALER,
  GST_RATE,
  priceCartLine,
  summarizeCart,
  trackerIndexForStatus,
  volumeUnitPrice,
  type CartLine,
  type Dealer,
  type LedgerRow,
  type MasterbatchColor,
  type Order,
  type OrderLine,
  type PolymerProduct,
  type PortalView,
} from '../types/portal';

const AUTH_EMAIL = 'dealer@bharatplastics.in';
const AUTH_PASSWORD = 'password123';

interface PortalContextValue {
  dealer: Dealer;
  products: PolymerProduct[];
  isAuthenticated: boolean;
  authError: string | null;
  view: PortalView;
  setView: (view: PortalView) => void;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  cart: CartLine[];
  addToCart: (productId: string, quantityMt: number, color: MasterbatchColor) => string | null;
  updateCartQty: (lineId: string, quantityMt: number) => void;
  removeCartLine: (lineId: string) => void;
  clearCart: () => void;
  orders: Order[];
  ledger: LedgerRow[];
  ledgerBalance: number;
  availableCredit: number;
  placeOrder: (mode: 'process' | 'credit-review') => { ok: boolean; message: string; orderId?: string };
}

const PortalContext = createContext<PortalContextValue | null>(null);

function seedOrders(): Order[] {
  const mkLine = (
    productId: string,
    color: MasterbatchColor,
    quantityMt: number,
  ): OrderLine => {
    const product = CATALOG_PRODUCTS.find((item) => item.id === productId)!;
    const priced = volumeUnitPrice(product.pricePerMt, quantityMt);
    const line: CartLine = {
      lineId: `${productId}-${color}`,
      productId: product.id,
      polymer: product.polymer,
      grade: product.grade,
      sku: product.sku,
      color,
      quantityMt,
      listPricePerMt: product.pricePerMt,
      discountedPricePerMt: priced.discountedPricePerMt,
      volumeDiscountPct: priced.volumeDiscountPct,
    };
    const totals = priceCartLine(line);
    return {
      productId: product.id,
      polymer: product.polymer,
      grade: product.grade,
      sku: product.sku,
      color,
      quantityMt,
      listPricePerMt: product.pricePerMt,
      discountedPricePerMt: priced.discountedPricePerMt,
      volumeDiscountPct: priced.volumeDiscountPct,
      lineSubtotal: totals.taxableValue,
      gstAmount: totals.gstAmount,
      lineTotal: totals.lineTotal,
    };
  };

  const wrap = (
    id: string,
    poNumber: string,
    placedAt: string,
    status: Order['status'],
    lines: OrderLine[],
    plant: string,
    creditReview = false,
  ): Order => {
    const materialSubtotal = lines.reduce((sum, line) => sum + line.quantityMt * line.listPricePerMt, 0);
    const taxableValue = lines.reduce((sum, line) => sum + line.lineSubtotal, 0);
    const gstAmount = lines.reduce((sum, line) => sum + line.gstAmount, 0);
    return {
      id,
      poNumber,
      placedAt,
      status,
      trackerStep: trackerIndexForStatus(status),
      lines,
      materialSubtotal,
      volumeDiscount: materialSubtotal - taxableValue,
      taxableValue,
      gstAmount,
      grandTotal: taxableValue + gstAmount,
      creditReview,
      plant,
      shipTo: 'WGPD Warehouse, Chakan MIDC, Pune 410501',
    };
  };

  return [
    wrap(
      'ORD-2026-1184',
      'PO-WGPD-4418',
      '2026-09-12T09:40:00+05:30',
      'In Transit',
      [mkLine('pol-hdpe-h10', 'White', 8), mkLine('pol-lldpe-l30', 'Natural', 4)],
      'Dahej Compounding Plant',
    ),
    wrap(
      'ORD-2026-1171',
      'PO-WGPD-4390',
      '2026-09-08T16:05:00+05:30',
      'Quality Hold',
      [mkLine('pol-pp-p20', 'Ultramarine Blue', 6.5)],
      'Nagothane Polymer Unit',
    ),
    wrap(
      'ORD-2026-1156',
      'PO-WGPD-4362',
      '2026-08-29T11:20:00+05:30',
      'Delivered',
      [mkLine('pol-pvc-v40', 'Olive Green', 12)],
      'Kota Vinyl Complex',
    ),
    wrap(
      'ORD-2026-1142',
      'PO-WGPD-4328',
      '2026-08-21T14:10:00+05:30',
      'Ready to Dispatch',
      [mkLine('pol-hdpe-h10', 'Black', 3), mkLine('pol-pp-p20', 'Natural', 2)],
      'Dahej Compounding Plant',
    ),
    wrap(
      'ORD-2026-1120',
      'PO-WGPD-4281',
      '2026-08-11T10:00:00+05:30',
      'In Production',
      [mkLine('pol-lldpe-l30', 'UV-Stabilized Grey', 7.25)],
      'Jamnagar Film Resin Line',
    ),
  ];
}

function seedLedger(): LedgerRow[] {
  const rows: Omit<LedgerRow, 'runningBalance'>[] = [
    {
      id: 'led-01',
      invoiceNo: 'BP-2026-38',
      date: '2026-08-04',
      particulars: 'Tax invoice — PVC V40 10 MT (Kota)',
      entryType: 'Debit',
      amount: 580000,
      settlementType: 'Adjustment',
      utr: '—',
    },
    {
      id: 'led-02',
      invoiceNo: 'BP-2026-39',
      date: '2026-08-12',
      particulars: 'NEFT collection — HDFC Pune CMS',
      entryType: 'Credit',
      amount: 650000,
      settlementType: 'NEFT',
      utr: 'HDFC2608124418291',
    },
    {
      id: 'led-03',
      invoiceNo: 'BP-2026-41',
      date: '2026-08-22',
      particulars: 'Tax invoice — HDPE H10 3 MT + PP P20 2 MT',
      entryType: 'Debit',
      amount: 631350,
      settlementType: 'Adjustment',
      utr: '—',
    },
    {
      id: 'led-04',
      invoiceNo: 'BP-2026-42',
      date: '2026-08-28',
      particulars: 'RTGS collection — ICICI Chakan',
      entryType: 'Credit',
      amount: 500000,
      settlementType: 'RTGS',
      utr: 'ICIC2608289912044',
    },
    {
      id: 'led-05',
      invoiceNo: 'BP-2026-43',
      date: '2026-09-02',
      particulars: 'Tax invoice — LLDPE L30 7.25 MT (Jamnagar)',
      entryType: 'Debit',
      amount: 420000,
      settlementType: 'Adjustment',
      utr: '—',
    },
    {
      id: 'led-06',
      invoiceNo: 'BP-2026-44',
      date: '2026-09-09',
      particulars: 'Tax invoice — PP P20 6.5 MT blue masterbatch',
      entryType: 'Debit',
      amount: 679163,
      settlementType: 'Adjustment',
      utr: '—',
    },
    {
      id: 'led-07',
      invoiceNo: 'BP-2026-45',
      date: '2026-09-14',
      particulars: 'IMPS part settlement — Axis Bank Camp',
      entryType: 'Credit',
      amount: 320000,
      settlementType: 'IMPS',
      utr: 'UTIB2609143301187',
    },
  ];

  let running = 0;
  return rows.map((row) => {
    running += row.entryType === 'Debit' ? row.amount : -row.amount;
    return { ...row, runningBalance: running };
  });
}

function withRunningBalance(rows: LedgerRow[]): LedgerRow[] {
  let running = 0;
  return rows.map((row) => {
    running += row.entryType === 'Debit' ? row.amount : -row.amount;
    return { ...row, runningBalance: running };
  });
}

export function PortalProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [view, setView] = useState<PortalView>('dashboard');
  const [cart, setCart] = useState<CartLine[]>([]);
  const [orders, setOrders] = useState<Order[]>(seedOrders);
  const [ledger, setLedger] = useState<LedgerRow[]>(seedLedger);
  const [orderSeq, setOrderSeq] = useState(1185);
  const [invoiceSeq, setInvoiceSeq] = useState(46);

  const ledgerBalance = useMemo(() => {
    return ledger.reduce((sum, row) => sum + (row.entryType === 'Debit' ? row.amount : -row.amount), 0);
  }, [ledger]);

  const availableCredit = DEMO_DEALER.creditLimitInr - ledgerBalance;

  const login = useCallback((email: string, password: string) => {
    const ok =
      email.trim().toLowerCase() === AUTH_EMAIL && password === AUTH_PASSWORD;
    if (!ok) {
      setAuthError('Access denied. Use the dealer credentials issued by Bharat Plastics Credit Control.');
      return false;
    }
    setAuthError(null);
    setIsAuthenticated(true);
    setView('dashboard');
    return true;
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setAuthError(null);
    setView('dashboard');
  }, []);

  const addToCart = useCallback((productId: string, quantityMt: number, color: MasterbatchColor) => {
    const product = CATALOG_PRODUCTS.find((item) => item.id === productId);
    if (!product) return 'Grade not found in the live mill catalogue.';
    if (!Number.isFinite(quantityMt) || quantityMt < product.moqMt) {
      return `Minimum order is ${product.moqMt} MT for ${product.polymer} ${product.grade}.`;
    }
    const existingQty = cart
      .filter((line) => line.productId === productId)
      .reduce((sum, line) => sum + line.quantityMt, 0);
    if (existingQty + quantityMt > product.availableStockMt) {
      return `Only ${product.availableStockMt} MT of ${product.sku} is allocated to West region.`;
    }

    setCart((prev) => {
      const existing = prev.find((line) => line.productId === productId && line.color === color);
      const nextQty = (existing?.quantityMt ?? 0) + quantityMt;
      const priced = volumeUnitPrice(product.pricePerMt, nextQty);
      const nextLine: CartLine = {
        lineId: existing?.lineId ?? `${productId}-${color}-${Date.now()}`,
        productId: product.id,
        polymer: product.polymer,
        grade: product.grade,
        sku: product.sku,
        color,
        quantityMt: nextQty,
        listPricePerMt: product.pricePerMt,
        discountedPricePerMt: priced.discountedPricePerMt,
        volumeDiscountPct: priced.volumeDiscountPct,
      };
      if (existing) {
        return prev.map((line) => (line.lineId === existing.lineId ? nextLine : line));
      }
      return [...prev, nextLine];
    });
    return null;
  }, [cart]);

  const updateCartQty = useCallback((lineId: string, quantityMt: number) => {
    setCart((prev) =>
      prev.map((line) => {
        if (line.lineId !== lineId) return line;
        const product = CATALOG_PRODUCTS.find((item) => item.id === line.productId);
        const clamped = Math.max(1, Math.min(quantityMt, product?.availableStockMt ?? quantityMt));
        const priced = volumeUnitPrice(line.listPricePerMt, clamped);
        return {
          ...line,
          quantityMt: clamped,
          discountedPricePerMt: priced.discountedPricePerMt,
          volumeDiscountPct: priced.volumeDiscountPct,
        };
      }),
    );
  }, []);

  const removeCartLine = useCallback((lineId: string) => {
    setCart((prev) => prev.filter((line) => line.lineId !== lineId));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const placeOrder = useCallback(
    (mode: 'process' | 'credit-review') => {
      if (cart.length === 0) {
        return { ok: false, message: 'Cart is empty. Add polymer tonnage from the catalogue.' };
      }
      const summary = summarizeCart(cart);
      const projected = summary.grandTotal + ledgerBalance;
      const overLimit = projected > DEMO_DEALER.creditLimitInr;

      if (mode === 'process' && overLimit) {
        return {
          ok: false,
          message: 'Processing is blocked. Exposure exceeds the sanctioned credit limit of ₹15,00,000.',
        };
      }

      const lines: OrderLine[] = cart.map((line) => {
        const priced = priceCartLine(line);
        return {
          productId: line.productId,
          polymer: line.polymer,
          grade: line.grade,
          sku: line.sku,
          color: line.color,
          quantityMt: line.quantityMt,
          listPricePerMt: line.listPricePerMt,
          discountedPricePerMt: line.discountedPricePerMt,
          volumeDiscountPct: line.volumeDiscountPct,
          lineSubtotal: priced.taxableValue,
          gstAmount: priced.gstAmount,
          lineTotal: priced.lineTotal,
        };
      });

      const id = `ORD-2026-${orderSeq}`;
      const invoiceNo = `BP-2026-${invoiceSeq}`;
      const creditReview = mode === 'credit-review' || overLimit;
      const status = creditReview ? 'Credit Review Pending' : 'In Production';
      const order: Order = {
        id,
        poNumber: `PO-WGPD-${4300 + orderSeq}`,
        placedAt: new Date().toISOString(),
        status,
        trackerStep: trackerIndexForStatus(status),
        lines,
        materialSubtotal: summary.listValue,
        volumeDiscount: summary.volumeDiscount,
        taxableValue: summary.taxableValue,
        gstAmount: summary.gstAmount,
        grandTotal: summary.grandTotal,
        creditReview,
        plant: CATALOG_PRODUCTS.find((p) => p.id === cart[0].productId)?.plant ?? 'Dahej Compounding Plant',
        shipTo: 'WGPD Warehouse, Chakan MIDC, Pune 410501',
      };

      setOrders((prev) => [order, ...prev]);
      setOrderSeq((n) => n + 1);

      if (!creditReview) {
        const debit: LedgerRow = {
          id: `led-${invoiceNo}`,
          invoiceNo,
          date: new Date().toISOString().slice(0, 10),
          particulars: `Tax invoice — ${lines.map((l) => `${l.polymer} ${l.grade} ${l.quantityMt} MT`).join(', ')}`,
          entryType: 'Debit',
          amount: Math.round(summary.grandTotal),
          settlementType: 'Adjustment',
          utr: '—',
          runningBalance: 0,
        };
        setLedger((prev) => withRunningBalance([...prev, debit]));
        setInvoiceSeq((n) => n + 1);
      }

      setCart([]);
      setView('orders');
      return {
        ok: true,
        orderId: id,
        message: creditReview
          ? `Order ${id} flagged as Credit Review Pending. Mill scheduling is on hold until Credit Control releases the limit.`
          : `Order ${id} accepted. GST @ ${(GST_RATE * 100).toFixed(0)}% posted to ledger ${invoiceNo}.`,
      };
    },
    [cart, invoiceSeq, ledgerBalance, orderSeq],
  );

  const value = useMemo<PortalContextValue>(
    () => ({
      dealer: DEMO_DEALER,
      products: CATALOG_PRODUCTS,
      isAuthenticated,
      authError,
      view,
      setView,
      login,
      logout,
      cart,
      addToCart,
      updateCartQty,
      removeCartLine,
      clearCart,
      orders,
      ledger,
      ledgerBalance,
      availableCredit,
      placeOrder,
    }),
    [
      addToCart,
      authError,
      availableCredit,
      cart,
      clearCart,
      isAuthenticated,
      ledger,
      ledgerBalance,
      login,
      logout,
      orders,
      placeOrder,
      removeCartLine,
      updateCartQty,
      view,
    ],
  );

  return <PortalContext.Provider value={value}>{children}</PortalContext.Provider>;
}

export function usePortal() {
  const ctx = useContext(PortalContext);
  if (!ctx) {
    throw new Error('usePortal must be used inside PortalProvider');
  }
  return ctx;
}

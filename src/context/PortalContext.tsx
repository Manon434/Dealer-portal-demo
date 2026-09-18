import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  CATALOG_PRODUCTS,
  DEMO_DEALER,
  GST_RATE,
  TRACKER_STAGES,
  priceCartLine,
  statusFromPipeline,
  summarizeCart,
  trackerIndexForPipeline,
  volumeUnitPrice,
  type CartLine,
  type Dealer,
  type LedgerRow,
  type MasterbatchColor,
  type Order,
  type OrderLine,
  type PipelineStage,
  type PolymerProduct,
  type PortalView,
  type UserRole,
} from '../types/portal';

const DEALER_EMAIL = 'dealer@bharatplastics.in';
const MILL_EMAIL = 'manufacturer@plasticcorp.in';
const AUTH_PASSWORD = 'password123';
const STORAGE_KEY = 'bharat-plastics-portal-v5';

interface PortalContextValue {
  role: UserRole | null;
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
  advancePipeline: (orderId: string, stage: PipelineStage, markDelivered?: boolean) => void;
  approveCredit: (orderId: string) => { ok: boolean; message: string };
}

const PortalContext = createContext<PortalContextValue | null>(null);

function dealerStamp(ledgerBalance: number, grandTotal: number) {
  return {
    dealerId: DEMO_DEALER.id,
    dealerName: DEMO_DEALER.legalName,
    dealerCode: DEMO_DEALER.partnerCode,
    dealerGstin: DEMO_DEALER.gstin,
    creditLimitInr: DEMO_DEALER.creditLimitInr,
    ledgerBalanceAtPlacement: ledgerBalance,
    exposureAtPlacement: ledgerBalance + grandTotal,
  };
}

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
    pipelineStage: PipelineStage,
    lines: OrderLine[],
    plant: string,
    options?: { creditReview?: boolean; delivered?: boolean },
  ): Order => {
    const creditReview = options?.creditReview ?? false;
    const delivered = options?.delivered ?? false;
    const materialSubtotal = lines.reduce((sum, line) => sum + line.quantityMt * line.listPricePerMt, 0);
    const taxableValue = lines.reduce((sum, line) => sum + line.lineSubtotal, 0);
    const gstAmount = lines.reduce((sum, line) => sum + line.gstAmount, 0);
    const grandTotal = taxableValue + gstAmount;
    return {
      id,
      poNumber,
      placedAt,
      status: statusFromPipeline(pipelineStage, creditReview, delivered),
      pipelineStage,
      trackerStep: trackerIndexForPipeline(pipelineStage, creditReview, delivered),
      lines,
      materialSubtotal,
      volumeDiscount: materialSubtotal - taxableValue,
      taxableValue,
      gstAmount,
      grandTotal,
      creditReview,
      plant,
      shipTo: 'WGPD Warehouse, Chakan MIDC, Pune 410501',
      ...dealerStamp(280_000_000, grandTotal),
    };
  };

  return [
    // ── Awaiting Credit Approval (5 orders) ──────────────────────────────────
    wrap(
      'ORD-2026-1188',
      'PO-WGPD-4490',
      '2026-09-16T11:05:00+05:30',
      'Raw Material Mixing',
      [mkLine('pol-hdpe-h10', 'White', 1200)],
      'Dahej Compounding Plant',
      { creditReview: true },
    ),
    wrap(
      'ORD-2026-1192',
      'PO-WGPD-4511',
      '2026-09-17T08:30:00+05:30',
      'Raw Material Mixing',
      [mkLine('pol-pp-p20', 'Natural', 2800), mkLine('pol-hdpe-h10', 'Black', 1600)],
      'Dahej Compounding Plant',
      { creditReview: true },
    ),
    wrap(
      'ORD-2026-1195',
      'PO-WGPD-4538',
      '2026-09-17T11:15:00+05:30',
      'Raw Material Mixing',
      [mkLine('pol-pvc-v40', 'Olive Green', 4200)],
      'Kota Vinyl Complex',
      { creditReview: true },
    ),
    wrap(
      'ORD-2026-1198',
      'PO-WGPD-4562',
      '2026-09-17T14:40:00+05:30',
      'Raw Material Mixing',
      [mkLine('pol-lldpe-l30', 'UV-Stabilized Grey', 3500), mkLine('pol-pp-p20', 'Ultramarine Blue', 2200)],
      'Jamnagar Film Resin Line',
      { creditReview: true },
    ),
    wrap(
      'ORD-2026-1201',
      'PO-WGPD-4589',
      '2026-09-18T09:00:00+05:30',
      'Raw Material Mixing',
      [mkLine('pol-hdpe-h10', 'White', 5000), mkLine('pol-lldpe-l30', 'Natural', 1800)],
      'Nagothane Polymer Unit',
      { creditReview: true },
    ),

    // ── Active Production Pipeline ────────────────────────────────────────────
    wrap(
      'ORD-2026-1184',
      'PO-WGPD-4418',
      '2026-09-12T09:40:00+05:30',
      'Out for Delivery',
      [mkLine('pol-hdpe-h10', 'White', 2500), mkLine('pol-lldpe-l30', 'Natural', 1500)],
      'Dahej Compounding Plant',
    ),
    wrap(
      'ORD-2026-1171',
      'PO-WGPD-4390',
      '2026-09-08T16:05:00+05:30',
      'Quality Assurance Check',
      [mkLine('pol-pp-p20', 'Ultramarine Blue', 1800)],
      'Nagothane Polymer Unit',
    ),
    wrap(
      'ORD-2026-1156',
      'PO-WGPD-4362',
      '2026-08-29T11:20:00+05:30',
      'Out for Delivery',
      [mkLine('pol-pvc-v40', 'Olive Green', 3200)],
      'Kota Vinyl Complex',
      { delivered: true },
    ),
    wrap(
      'ORD-2026-1142',
      'PO-WGPD-4328',
      '2026-08-21T14:10:00+05:30',
      'Waiting for Transport',
      [mkLine('pol-hdpe-h10', 'Black', 850), mkLine('pol-pp-p20', 'Natural', 650)],
      'Dahej Compounding Plant',
    ),
    wrap(
      'ORD-2026-1120',
      'PO-WGPD-4281',
      '2026-08-11T10:00:00+05:30',
      'Extrusion & Molding',
      [mkLine('pol-lldpe-l30', 'UV-Stabilized Grey', 2100)],
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
      particulars: 'Tax invoice — PVC V40 180 MT (Kota)',
      entryType: 'Debit',
      amount: 15732000,
      settlementType: 'Adjustment',
      utr: '—',
    },
    {
      id: 'led-02',
      invoiceNo: 'BP-2026-39',
      date: '2026-08-12',
      particulars: 'NEFT collection — HDFC Pune CMS',
      entryType: 'Credit',
      amount: 12500000,
      settlementType: 'NEFT',
      utr: 'HDFC2608124418291',
    },
    {
      id: 'led-03',
      invoiceNo: 'BP-2026-41',
      date: '2026-08-22',
      particulars: 'Tax invoice — HDPE H10 45 MT + PP P20 35 MT',
      entryType: 'Debit',
      amount: 9461250,
      settlementType: 'Adjustment',
      utr: '—',
    },
    {
      id: 'led-04',
      invoiceNo: 'BP-2026-42',
      date: '2026-08-28',
      particulars: 'RTGS collection — ICICI Chakan',
      entryType: 'Credit',
      amount: 8000000,
      settlementType: 'RTGS',
      utr: 'ICIC2608289912044',
    },
    {
      id: 'led-05',
      invoiceNo: 'BP-2026-43',
      date: '2026-09-02',
      particulars: 'Tax invoice — LLDPE L30 110 MT (Jamnagar)',
      entryType: 'Debit',
      amount: 11550000,
      settlementType: 'Adjustment',
      utr: '—',
    },
    {
      id: 'led-06',
      invoiceNo: 'BP-2026-44',
      date: '2026-09-09',
      particulars: 'Tax invoice — PP P20 95 MT blue masterbatch',
      entryType: 'Debit',
      amount: 9381250,
      settlementType: 'Adjustment',
      utr: '—',
    },
    {
      id: 'led-07',
      invoiceNo: 'BP-2026-45',
      date: '2026-09-14',
      particulars: 'IMPS part settlement — Axis Bank Camp',
      entryType: 'Credit',
      amount: 5000000,
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

interface PersistedState {
  orders: Order[];
  ledger: LedgerRow[];
  orderSeq: number;
  invoiceSeq: number;
}

function loadPersisted(): PersistedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedState;
    if (!Array.isArray(parsed.orders) || !Array.isArray(parsed.ledger)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function postInvoice(
  order: Order,
  invoiceNo: string,
): LedgerRow {
  return {
    id: `led-${invoiceNo}`,
    invoiceNo,
    date: new Date().toISOString().slice(0, 10),
    particulars: `Tax invoice — ${order.lines.map((l) => `${l.polymer} ${l.grade} ${l.quantityMt} MT`).join(', ')}`,
    entryType: 'Debit',
    amount: Math.round(order.grandTotal),
    settlementType: 'Adjustment',
    utr: '—',
    runningBalance: 0,
  };
}

export function PortalProvider({ children }: { children: ReactNode }) {
  const persisted = useMemo(() => (typeof window === 'undefined' ? null : loadPersisted()), []);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [view, setView] = useState<PortalView>('dashboard');
  const [cart, setCart] = useState<CartLine[]>([]);
  const [orders, setOrders] = useState<Order[]>(() => persisted?.orders ?? seedOrders());
  const [ledger, setLedger] = useState<LedgerRow[]>(() => persisted?.ledger ?? seedLedger());
  const [orderSeq, setOrderSeq] = useState(() => persisted?.orderSeq ?? 1202);
  const [invoiceSeq, setInvoiceSeq] = useState(() => persisted?.invoiceSeq ?? 46);

  // Save to localStorage whenever state changes
  useEffect(() => {
    const payload: PersistedState = { orders, ledger, orderSeq, invoiceSeq };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [invoiceSeq, ledger, orderSeq, orders]);

  // Cross-tab sync: when dealer places an order in Tab A,
  // the manufacturer dashboard in Tab B picks it up instantly.
  useEffect(() => {
    const onStorageChange = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY || !e.newValue) return;
      try {
        const incoming = JSON.parse(e.newValue) as PersistedState;
        if (!Array.isArray(incoming.orders) || !Array.isArray(incoming.ledger)) return;
        setOrders(incoming.orders);
        setLedger(incoming.ledger);
        setOrderSeq(incoming.orderSeq);
        setInvoiceSeq(incoming.invoiceSeq);
      } catch {
        // ignore malformed data
      }
    };
    window.addEventListener('storage', onStorageChange);
    return () => window.removeEventListener('storage', onStorageChange);
  }, []);

  const ledgerBalance = useMemo(() => {
    return ledger.reduce((sum, row) => sum + (row.entryType === 'Debit' ? row.amount : -row.amount), 0);
  }, [ledger]);

  const availableCredit = DEMO_DEALER.creditLimitInr - ledgerBalance;

  const login = useCallback((email: string, password: string) => {
    const normalised = email.trim().toLowerCase();
    if (password !== AUTH_PASSWORD) {
      setAuthError('Access denied. Password does not match the issued mailbox.');
      return false;
    }
    if (normalised === DEALER_EMAIL) {
      setRole('dealer');
      setAuthError(null);
      setIsAuthenticated(true);
      setView('dashboard');
      return true;
    }
    if (normalised === MILL_EMAIL) {
      setRole('manufacturer');
      setAuthError(null);
      setIsAuthenticated(true);
      setView('dashboard');
      return true;
    }
    setAuthError('Unknown mailbox. Use the dealer indent desk or mill operations credentials.');
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setRole(null);
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
      const pipelineStage: PipelineStage = 'Raw Material Mixing';
      const order: Order = {
        id,
        poNumber: `PO-WGPD-${4300 + orderSeq}`,
        placedAt: new Date().toISOString(),
        status: statusFromPipeline(pipelineStage, creditReview),
        pipelineStage,
        trackerStep: trackerIndexForPipeline(pipelineStage, creditReview),
        lines,
        materialSubtotal: summary.listValue,
        volumeDiscount: summary.volumeDiscount,
        taxableValue: summary.taxableValue,
        gstAmount: summary.gstAmount,
        grandTotal: summary.grandTotal,
        creditReview,
        plant: CATALOG_PRODUCTS.find((p) => p.id === cart[0].productId)?.plant ?? 'Dahej Compounding Plant',
        shipTo: 'WGPD Warehouse, Chakan MIDC, Pune 410501',
        ...dealerStamp(ledgerBalance, summary.grandTotal),
      };

      setOrders((prev) => [order, ...prev]);
      setOrderSeq((n) => n + 1);

      if (!creditReview) {
        setLedger((prev) => withRunningBalance([...prev, postInvoice(order, invoiceNo)]));
        setInvoiceSeq((n) => n + 1);
      }

      setCart([]);
      setView('orders');
      return {
        ok: true,
        orderId: id,
        message: creditReview
          ? `Order ${id} flagged as Credit Review Pending. Mill scheduling is on hold until Credit Control releases the limit.`
          : `Order ${id} accepted. GST @ ${(GST_RATE * 100).toFixed(0)}% posted to ledger ${invoiceNo}. Mill queue updated.`,
      };
    },
    [cart, invoiceSeq, ledgerBalance, orderSeq],
  );

  const advancePipeline = useCallback((orderId: string, stage: PipelineStage, markDelivered = false) => {
    if (!TRACKER_STAGES.includes(stage)) return;
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        if (order.creditReview) return order;
        const isDelivered = markDelivered;
        return {
          ...order,
          pipelineStage: stage,
          trackerStep: trackerIndexForPipeline(stage, false, isDelivered),
          status: statusFromPipeline(stage, false, isDelivered),
          delivered: isDelivered,
        };
      }),
    );
  }, []);

  const approveCredit = useCallback(
    (orderId: string) => {
      const target = orders.find((order) => order.id === orderId);
      if (!target) return { ok: false, message: 'Order not found in the mill queue.' };
      if (!target.creditReview) return { ok: false, message: `${orderId} is already released to the mixing floor.` };

      const invoiceNo = `BP-2026-${invoiceSeq}`;
      const stage: PipelineStage = 'Raw Material Mixing';
      const released: Order = {
        ...target,
        creditReview: false,
        pipelineStage: stage,
        trackerStep: trackerIndexForPipeline(stage, false),
        status: statusFromPipeline(stage, false),
      };

      setOrders((prev) => prev.map((order) => (order.id === orderId ? released : order)));
      setLedger((prev) => withRunningBalance([...prev, postInvoice(released, invoiceNo)]));
      setInvoiceSeq((n) => n + 1);
      return {
        ok: true,
        message: `${orderId} approved. Credit released and job pushed to Raw Material Mixing.`,
      };
    },
    [invoiceSeq, orders],
  );

  const value = useMemo<PortalContextValue>(
    () => ({
      role,
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
      advancePipeline,
      approveCredit,
    }),
    [
      addToCart,
      advancePipeline,
      approveCredit,
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
      role,
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

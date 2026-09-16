export type PortalView = 'dashboard' | 'catalog' | 'checkout' | 'orders' | 'ledger';

export type MasterbatchColor =
  | 'Natural'
  | 'White'
  | 'Black'
  | 'Ultramarine Blue'
  | 'Olive Green'
  | 'Signal Red'
  | 'UV-Stabilized Grey';

export type OrderStatus =
  | 'In Production'
  | 'Quality Hold'
  | 'Ready to Dispatch'
  | 'In Transit'
  | 'Delivered'
  | 'Credit Review Pending';

export type SettlementType = 'NEFT' | 'RTGS' | 'IMPS' | 'Cheque' | 'Adjustment';

export type LedgerEntryType = 'Credit' | 'Debit';

export interface Dealer {
  id: string;
  legalName: string;
  tradeName: string;
  partnerCode: string;
  gstin: string;
  pan: string;
  city: string;
  state: string;
  pincode: string;
  email: string;
  mobile: string;
  territory: string;
  creditLimitInr: number;
  relationshipManager: string;
  plantAllocation: string;
}

export interface PolymerProduct {
  id: string;
  polymer: string;
  grade: string;
  sku: string;
  description: string;
  applications: string;
  pricePerMt: number;
  availableStockMt: number;
  moqMt: number;
  mfi: string;
  density: string;
  plant: string;
}

export interface CartLine {
  lineId: string;
  productId: string;
  polymer: string;
  grade: string;
  sku: string;
  color: MasterbatchColor;
  quantityMt: number;
  listPricePerMt: number;
  discountedPricePerMt: number;
  volumeDiscountPct: number;
}

export interface OrderLine {
  productId: string;
  polymer: string;
  grade: string;
  sku: string;
  color: MasterbatchColor;
  quantityMt: number;
  listPricePerMt: number;
  discountedPricePerMt: number;
  volumeDiscountPct: number;
  lineSubtotal: number;
  gstAmount: number;
  lineTotal: number;
}

export interface Order {
  id: string;
  poNumber: string;
  placedAt: string;
  status: OrderStatus;
  trackerStep: number;
  lines: OrderLine[];
  materialSubtotal: number;
  volumeDiscount: number;
  taxableValue: number;
  gstAmount: number;
  grandTotal: number;
  creditReview: boolean;
  plant: string;
  shipTo: string;
}

export interface LedgerRow {
  id: string;
  invoiceNo: string;
  date: string;
  particulars: string;
  entryType: LedgerEntryType;
  amount: number;
  settlementType: SettlementType;
  utr: string;
  runningBalance: number;
}

export const GST_RATE = 0.18;
export const VOLUME_DISCOUNT_THRESHOLD_MT = 5;
export const VOLUME_DISCOUNT_RATE = 0.1;
export const DEFAULT_CREDIT_LIMIT_INR = 1_500_000;

export const TRACKER_STAGES = [
  'Raw Material Mixing',
  'Extrusion & Molding',
  'Quality Assurance Check',
  'Waiting for Transport',
  'Out for Delivery',
] as const;

export const MASTERBATCH_OPTIONS: MasterbatchColor[] = [
  'Natural',
  'White',
  'Black',
  'Ultramarine Blue',
  'Olive Green',
  'Signal Red',
  'UV-Stabilized Grey',
];

export const CATALOG_PRODUCTS: PolymerProduct[] = [
  {
    id: 'pol-hdpe-h10',
    polymer: 'HDPE',
    grade: 'H10',
    sku: 'BP-HDPE-H10',
    description: 'Blow-moulding HDPE with high ESCR for jerry cans and lube containers.',
    applications: 'Jerrycans, IBCs, industrial drums',
    pricePerMt: 112500,
    availableStockMt: 286,
    moqMt: 1,
    mfi: '0.35 g/10 min',
    density: '0.954 g/cm³',
    plant: 'Dahej Compounding Plant',
  },
  {
    id: 'pol-pp-p20',
    polymer: 'PP',
    grade: 'P20',
    sku: 'BP-PP-P20',
    description: 'Injection-moulding polypropylene copolymer for crates and furniture.',
    applications: 'Crates, household, appliance housings',
    pricePerMt: 98750,
    availableStockMt: 194,
    moqMt: 1,
    mfi: '12 g/10 min',
    density: '0.905 g/cm³',
    plant: 'Nagothane Polymer Unit',
  },
  {
    id: 'pol-lldpe-l30',
    polymer: 'LLDPE',
    grade: 'L30',
    sku: 'BP-LLDPE-L30',
    description: 'Film-grade LLDPE for liners, stretch wrap and agricultural mulch.',
    applications: 'Liners, stretch film, agri mulch',
    pricePerMt: 105000,
    availableStockMt: 241,
    moqMt: 1,
    mfi: '1.0 g/10 min',
    density: '0.918 g/cm³',
    plant: 'Jamnagar Film Resin Line',
  },
  {
    id: 'pol-pvc-v40',
    polymer: 'PVC',
    grade: 'V40',
    sku: 'BP-PVC-V40',
    description: 'K-67 suspension PVC for pipes, fittings and wire insulation.',
    applications: 'uPVC pipes, conduits, profiles',
    pricePerMt: 87400,
    availableStockMt: 318,
    moqMt: 1,
    mfi: 'K-value 67',
    density: '1.40 g/cm³',
    plant: 'Kota Vinyl Complex',
  },
];

export const DEMO_DEALER: Dealer = {
  id: 'dlr-pun-0142',
  legalName: 'Western Ghats Polymer Distributors Pvt. Ltd.',
  tradeName: 'WGPD — Pune Hub',
  partnerCode: 'BPD-PUN-0142',
  gstin: '27AABCU9603R1ZV',
  pan: 'AABCU9603R',
  city: 'Pune',
  state: 'Maharashtra',
  pincode: '411014',
  email: 'dealer@bharatplastics.in',
  mobile: '+91 98220 44118',
  territory: 'West — MH / Goa / North KA',
  creditLimitInr: DEFAULT_CREDIT_LIMIT_INR,
  relationshipManager: 'Anjali Deshpande',
  plantAllocation: 'Dahej + Nagothane',
};

export function formatInr(amount: number, fractionDigits = 0): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: fractionDigits,
  }).format(amount);
}

export function formatMt(mt: number, digits = 2): string {
  return `${mt.toLocaleString('en-IN', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })} MT`;
}

export function volumeUnitPrice(listPricePerMt: number, quantityMt: number): {
  discountedPricePerMt: number;
  volumeDiscountPct: number;
} {
  const qualifies = quantityMt > VOLUME_DISCOUNT_THRESHOLD_MT;
  return {
    discountedPricePerMt: qualifies ? listPricePerMt * (1 - VOLUME_DISCOUNT_RATE) : listPricePerMt,
    volumeDiscountPct: qualifies ? VOLUME_DISCOUNT_RATE * 100 : 0,
  };
}

export function priceCartLine(line: Pick<CartLine, 'quantityMt' | 'listPricePerMt' | 'discountedPricePerMt'>) {
  const listValue = line.quantityMt * line.listPricePerMt;
  const taxableValue = line.quantityMt * line.discountedPricePerMt;
  const volumeDiscount = listValue - taxableValue;
  const gstAmount = taxableValue * GST_RATE;
  const lineTotal = taxableValue + gstAmount;
  return { listValue, taxableValue, volumeDiscount, gstAmount, lineTotal };
}

export function summarizeCart(lines: CartLine[]) {
  return lines.reduce(
    (acc, line) => {
      const priced = priceCartLine(line);
      acc.listValue += priced.listValue;
      acc.volumeDiscount += priced.volumeDiscount;
      acc.taxableValue += priced.taxableValue;
      acc.gstAmount += priced.gstAmount;
      acc.grandTotal += priced.lineTotal;
      acc.totalMt += line.quantityMt;
      return acc;
    },
    {
      listValue: 0,
      volumeDiscount: 0,
      taxableValue: 0,
      gstAmount: 0,
      grandTotal: 0,
      totalMt: 0,
    },
  );
}

export function formatDateIn(iso: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso));
}

export function trackerIndexForStatus(status: OrderStatus): number {
  switch (status) {
    case 'Credit Review Pending':
      return 0;
    case 'In Production':
      return 1;
    case 'Quality Hold':
      return 2;
    case 'Ready to Dispatch':
      return 3;
    case 'In Transit':
      return 4;
    case 'Delivered':
      return 5;
    default:
      return 0;
  }
}

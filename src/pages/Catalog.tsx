import { useMemo, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { usePortal } from '../context/PortalContext';
import {
  MASTERBATCH_OPTIONS,
  VOLUME_DISCOUNT_THRESHOLD_MT,
  formatInr,
  formatMt,
  type MasterbatchColor,
} from '../types/portal';

export function Catalog() {
  const { products, addToCart, setView } = usePortal();
  const [qty, setQty] = useState<Record<string, number>>({
    'pol-hdpe-h10': 6,
    'pol-pp-p20': 2,
    'pol-lldpe-l30': 4,
    'pol-pvc-v40': 8,
  });
  const [color, setColor] = useState<Record<string, MasterbatchColor>>({
    'pol-hdpe-h10': 'White',
    'pol-pp-p20': 'Ultramarine Blue',
    'pol-lldpe-l30': 'Natural',
    'pol-pvc-v40': 'Olive Green',
  });
  const [flash, setFlash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const matrix = useMemo(() => products, [products]);

  const add = (productId: string) => {
    const message = addToCart(productId, qty[productId] ?? 1, color[productId] ?? 'Natural');
    if (message) {
      setError(message);
      setFlash(null);
      return;
    }
    setError(null);
    const product = products.find((item) => item.id === productId);
    setFlash(`${product?.sku} · ${formatMt(qty[productId] ?? 1)} · ${color[productId]} added to indent.`);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-kiln-500">Buying matrix</p>
          <h1 className="mt-1 text-2xl font-semibold">Industrial polymer catalogue</h1>
          <p className="mt-1 text-sm text-mill-800/80">
            Prices are ex-works per Metric Ton. 10% volume discount applies when a single polymer exceeds{' '}
            {VOLUME_DISCOUNT_THRESHOLD_MT} MT. GST is levied at checkout.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setView('checkout')}
          className="rounded-lg bg-mill-900 px-4 py-2 text-sm font-semibold text-white"
        >
          Open checkout
        </button>
      </header>

      {flash && (
        <p className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <CheckCircle2 size={16} /> {flash}
        </p>
      )}
      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>
      )}

      <div className="grid gap-4 xl:grid-cols-2">
        {matrix.map((product) => {
          const quantity = qty[product.id] ?? 1;
          const discounted = quantity > VOLUME_DISCOUNT_THRESHOLD_MT;
          return (
            <article key={product.id} className="rounded-xl border border-mill-200 bg-white p-5 shadow-panel">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-xs text-kiln-500">{product.sku}</p>
                  <h2 className="text-xl font-semibold">
                    {product.polymer}{' '}
                    <span className="text-mill-800/70">Grade {product.grade}</span>
                  </h2>
                  <p className="mt-1 text-sm text-mill-800/80">{product.description}</p>
                </div>
                <span className="rounded-md bg-mill-100 px-2 py-1 font-mono text-xs">
                  {formatMt(product.availableStockMt, 0)} stock
                </span>
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
                <div>
                  <dt className="text-[11px] uppercase tracking-wide text-mill-800/60">List / MT</dt>
                  <dd className="font-mono font-semibold">{formatInr(product.pricePerMt)}</dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-wide text-mill-800/60">MFI / K</dt>
                  <dd>{product.mfi}</dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-wide text-mill-800/60">Density</dt>
                  <dd>{product.density}</dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-wide text-mill-800/60">Plant</dt>
                  <dd>{product.plant.split(' ')[0]}</dd>
                </div>
              </dl>
              <p className="mt-2 text-xs text-mill-800/70">Applications: {product.applications}</p>

              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <label className="text-sm">
                  Required tonnage (MT)
                  <input
                    type="number"
                    min={product.moqMt}
                    max={product.availableStockMt}
                    step={0.25}
                    value={quantity}
                    onChange={(e) =>
                      setQty((prev) => ({ ...prev, [product.id]: Number(e.target.value) }))
                    }
                    className="mt-1 w-full rounded-lg border border-mill-200 px-3 py-2 font-mono outline-none ring-kiln-500 focus:ring-2"
                  />
                </label>
                <label className="text-sm md:col-span-2">
                  Colour masterbatch
                  <select
                    value={color[product.id]}
                    onChange={(e) =>
                      setColor((prev) => ({ ...prev, [product.id]: e.target.value as MasterbatchColor }))
                    }
                    className="mt-1 w-full rounded-lg border border-mill-200 bg-white px-3 py-2 outline-none ring-kiln-500 focus:ring-2"
                  >
                    {MASTERBATCH_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm">
                  {discounted ? (
                    <span className="font-medium text-emerald-700">
                      Volume slab active — 10% off {formatInr(product.pricePerMt)} →{' '}
                      {formatInr(product.pricePerMt * 0.9)} / MT
                    </span>
                  ) : (
                    <span className="text-mill-800/70">
                      Add more than {VOLUME_DISCOUNT_THRESHOLD_MT} MT of this polymer to unlock 10% off list.
                    </span>
                  )}
                </p>
                <button
                  type="button"
                  onClick={() => add(product.id)}
                  className="rounded-lg bg-kiln-500 px-4 py-2 text-sm font-semibold text-mill-950 hover:bg-kiln-400"
                >
                  Add to Cart
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

'use client';

import { useTransition, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBatch } from '../actions';

type Harvest = {
  id: string;
  productTypeCode: string;
  quantityKg: number;
  harvestDate: string;
  farmId: string;
};

type ProductType = { id: string; code: string; nameFr: string };

export function CreateBatchForm({
  harvests,
  productTypes,
}: {
  harvests: Harvest[];
  productTypes: ProductType[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  function toggleHarvest(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const selectedTotal = harvests
    .filter((h) => selectedIds.has(h.id))
    .reduce((sum, h) => sum + Number(h.quantityKg), 0);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (selectedIds.size === 0) {
      setError('Sélectionnez au moins une récolte.');
      return;
    }
    const fd = new FormData(e.currentTarget);
    setError(null);

    startTransition(async () => {
      const res = await createBatch({
        productTypeCode: fd.get('productTypeCode') as string,
        harvestIds:      Array.from(selectedIds),
        totalQuantityKg: parseFloat(fd.get('totalQuantityKg') as string),
        processingDate:  fd.get('processingDate') as string,
      });
      if (res.error) {
        setError(res.error);
      } else {
        router.push('/fr/cooperative-member/batches');
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl space-y-6 rounded-lg border bg-white p-6 shadow-sm"
    >
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Type de produit <span className="text-red-500">*</span>
        </label>
        <select
          name="productTypeCode"
          required
          className="w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">— Sélectionner un type —</option>
          {productTypes.map((pt) => (
            <option key={pt.id} value={pt.code}>
              {pt.nameFr} ({pt.code})
            </option>
          ))}
        </select>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-gray-700">
          Récoltes à inclure <span className="text-red-500">*</span>
          {selectedIds.size > 0 && (
            <span className="ml-2 text-xs text-green-700">
              ({selectedIds.size} sélectionnée(s) — {selectedTotal.toFixed(2)} kg)
            </span>
          )}
        </p>
        {harvests.length === 0 ? (
          <p className="text-sm text-gray-400">
            Aucune récolte disponible. Saisissez des récoltes d&apos;abord.
          </p>
        ) : (
          <div className="max-h-48 space-y-2 overflow-y-auto rounded border p-3">
            {harvests.map((h) => (
              <label
                key={h.id}
                className="flex cursor-pointer items-center gap-3 rounded px-2 py-1 hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={selectedIds.has(h.id)}
                  onChange={() => toggleHarvest(h.id)}
                  className="h-4 w-4 rounded border-gray-300 text-green-600"
                />
                <span className="text-sm">
                  <span className="font-medium">{h.productTypeCode}</span>
                  {' — '}
                  {Number(h.quantityKg).toFixed(2)} kg
                  {' · '}
                  <span className="text-gray-500">{h.harvestDate}</span>
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Quantité totale (kg) <span className="text-red-500">*</span>
          </label>
          <input
            name="totalQuantityKg"
            type="number"
            min="0.1"
            step="0.01"
            required
            value={selectedTotal > 0 ? selectedTotal.toFixed(2) : undefined}
            onChange={() => {}}
            placeholder="ex: 3800.75"
            className="w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {selectedTotal > 0 && (
            <p className="mt-1 text-xs text-green-600">
              Auto-calculé depuis les récoltes sélectionnées
            </p>
          )}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Date de traitement <span className="text-red-500">*</span>
          </label>
          <input
            name="processingDate"
            type="date"
            required
            className="w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded bg-green-700 px-6 py-2 text-sm font-medium text-white hover:bg-green-800 disabled:opacity-50"
        >
          {pending ? 'Création…' : '📦 Créer le lot'}
        </button>
        <a
          href="/fr/cooperative-member/batches"
          className="rounded border px-6 py-2 text-sm text-gray-600 hover:bg-gray-50"
        >
          Annuler
        </a>
      </div>
    </form>
  );
}

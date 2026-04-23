'use client';

import { useTransition, useState } from 'react';
import { useRouter } from 'next/navigation';
import { logHarvest } from '../actions';

type Farm = { id: string; name: string; regionCode: string };
type ProductType = { id: string; code: string; nameFr: string };

export function LogHarvestForm({
  farms,
  productTypes,
}: {
  farms: Farm[];
  productTypes: ProductType[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setError(null);

    startTransition(async () => {
      const res = await logHarvest({
        farmId:          fd.get('farmId')          as string,
        productTypeCode: fd.get('productTypeCode') as string,
        quantityKg:      parseFloat(fd.get('quantityKg') as string),
        harvestDate:     fd.get('harvestDate')     as string,
        campaignYear:    fd.get('campaignYear')    as string,
        method:          fd.get('method')          as string,
      });
      if (res.error) {
        setError(res.error);
      } else {
        router.push('/fr/cooperative-member/harvests');
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
          Ferme <span className="text-red-500">*</span>
        </label>
        <select
          name="farmId"
          required
          className="w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">— Sélectionner une ferme —</option>
          {farms.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name} ({f.regionCode})
            </option>
          ))}
        </select>
      </div>

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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Quantité (kg) <span className="text-red-500">*</span>
          </label>
          <input
            name="quantityKg"
            type="number"
            min="0.1"
            max="1000000"
            step="0.1"
            required
            placeholder="ex: 1250.5"
            className="w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Date de récolte <span className="text-red-500">*</span>
          </label>
          <input
            name="harvestDate"
            type="date"
            required
            className="w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Année de campagne <span className="text-red-500">*</span>
          </label>
          <input
            name="campaignYear"
            type="text"
            required
            placeholder="2025/2026"
            pattern="\d{4}/\d{4}"
            title="Format: AAAA/AAAA (ex: 2025/2026)"
            className="w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Méthode de récolte <span className="text-red-500">*</span>
          </label>
          <input
            name="method"
            type="text"
            required
            minLength={2}
            maxLength={100}
            placeholder="ex: cueillette manuelle"
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
          {pending ? 'Enregistrement…' : '🌿 Enregistrer la récolte'}
        </button>
        <a
          href="/fr/cooperative-member/harvests"
          className="rounded border px-6 py-2 text-sm text-gray-600 hover:bg-gray-50"
        >
          Annuler
        </a>
      </div>
    </form>
  );
}

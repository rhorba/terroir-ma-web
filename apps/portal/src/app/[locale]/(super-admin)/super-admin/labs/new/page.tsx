'use client';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createLab } from '../actions';
import { PageHeader } from '@/components/admin/page-header';

export default function NewLabPage() {
  const [name, setName] = useState('');
  const [onssa, setOnssa] = useState('');
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError('Le nom est requis.');
      return;
    }
    setError('');
    startTransition(async () => {
      try {
        await createLab(name.trim(), onssa.trim() || undefined);
        router.push('../../labs');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      }
    });
  }

  return (
    <div className="max-w-lg">
      <PageHeader title="Nouveau laboratoire" />
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Nom *</label>
          <input
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nom du laboratoire"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            N° Accréditation ONSSA
          </label>
          <input
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
            value={onssa}
            onChange={(e) => setOnssa(e.target.value)}
            placeholder="Optionnel"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isPending}
            className="rounded bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
          >
            {isPending ? 'Enregistrement...' : 'Enregistrer'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded border px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}

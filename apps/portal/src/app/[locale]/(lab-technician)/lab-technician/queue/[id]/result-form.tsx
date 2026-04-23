'use client';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { recordResult } from './actions';

type LabTestParameter = {
  name: string;
  unit: string;
  minValue?: number;
  maxValue?: number;
  values?: string[];
};

export function ResultForm({
  labTestId,
  parameters,
}: {
  labTestId: string;
  parameters: LabTestParameter[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const testValues: Record<string, number | string> = {};
    for (const p of parameters) {
      const raw = fd.get(p.name) as string;
      testValues[p.name] = p.values ? raw : Number(raw);
    }

    startTransition(async () => {
      await recordResult(labTestId, {
        testValues,
        technicianName: (fd.get('technicianName') as string) || undefined,
        laboratoryName: (fd.get('laboratoryName') as string) || undefined,
      });
      router.push('/fr/lab-technician/queue');
    });
  }

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">Saisir les résultats</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {parameters.length > 0 && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {parameters.map((p) => (
              <div key={p.name}>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  {p.name}{' '}
                  <span className="text-gray-400">({p.unit})</span>
                  {(p.minValue !== undefined || p.maxValue !== undefined) && (
                    <span className="ml-1 text-xs text-gray-400">
                      [{p.minValue ?? '—'} – {p.maxValue ?? '—'}]
                    </span>
                  )}
                </label>
                {p.values ? (
                  <select
                    name={p.name}
                    required
                    className="w-full rounded border px-3 py-2 text-sm"
                  >
                    <option value="">Sélectionner…</option>
                    {p.values.map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="number"
                    name={p.name}
                    required
                    step="any"
                    min={p.minValue}
                    max={p.maxValue}
                    className="w-full rounded border px-3 py-2 text-sm"
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {parameters.length === 0 && (
          <p className="rounded bg-amber-50 p-3 text-sm text-amber-700">
            Aucun paramètre défini pour ce type de produit. Soumission libre.
          </p>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Nom du technicien
            </label>
            <input
              type="text"
              name="technicianName"
              placeholder="Prénom Nom"
              className="w-full rounded border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Nom du laboratoire
            </label>
            <input
              type="text"
              name="laboratoryName"
              placeholder="Laboratoire ONSSA Agadir"
              className="w-full rounded border px-3 py-2 text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="rounded bg-blue-700 px-4 py-2 text-white hover:bg-blue-800 disabled:opacity-50"
        >
          {isPending ? 'Envoi…' : 'Enregistrer les résultats'}
        </button>
      </form>
    </div>
  );
}

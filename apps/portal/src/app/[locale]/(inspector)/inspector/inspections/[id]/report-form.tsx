'use client';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { fileReport } from '../actions';

export function ReportForm({ inspectionId }: { inspectionId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const passed = fd.get('passed') === 'true';

    startTransition(async () => {
      await fileReport(inspectionId, {
        passed,
        reportSummary: fd.get('reportSummary') as string,
        detailedObservations: (fd.get('detailedObservations') as string) || undefined,
        nonConformities: (fd.get('nonConformities') as string) || undefined,
      });
      router.push('/fr/inspector/inspections');
    });
  }

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">Déposer le rapport</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <fieldset className="flex gap-6">
          <legend className="mb-2 text-sm font-medium text-gray-700">Résultat de l&apos;inspection</legend>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="passed" value="true" required className="accent-green-700" />
            <span className="text-sm">✅ Conforme</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="passed" value="false" className="accent-red-600" />
            <span className="text-sm">❌ Non conforme</span>
          </label>
        </fieldset>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Résumé du rapport <span className="text-red-500">*</span>
          </label>
          <textarea
            name="reportSummary"
            required
            minLength={20}
            rows={3}
            placeholder="Résumé des observations (min 20 caractères)"
            className="w-full rounded border px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Observations détaillées
          </label>
          <textarea
            name="detailedObservations"
            rows={4}
            placeholder="Observations complètes en Markdown (optionnel)"
            className="w-full rounded border px-3 py-2 text-sm font-mono"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Non-conformités</label>
          <textarea
            name="nonConformities"
            rows={2}
            placeholder="Liste des non-conformités constatées (optionnel)"
            className="w-full rounded border px-3 py-2 text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="rounded bg-amber-700 px-4 py-2 text-white hover:bg-amber-800 disabled:opacity-50"
        >
          {isPending ? 'Envoi…' : 'Soumettre le rapport'}
        </button>
      </form>
    </div>
  );
}

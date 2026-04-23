'use client';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { submitTest } from './actions';

export default function SubmitTestPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    startTransition(async () => {
      await submitTest({
        batchId: fd.get('batchId') as string,
        laboratoryId: (fd.get('laboratoryId') as string) || undefined,
        expectedResultDate: (fd.get('expectedResultDate') as string) || undefined,
      });
      router.push('/fr/lab-technician/queue');
    });
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Soumettre un nouveau test</h1>
      <div className="max-w-lg rounded-lg border bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Identifiant du lot (UUID) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="batchId"
              required
              pattern="[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}"
              placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              className="w-full rounded border px-3 py-2 font-mono text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Identifiant du laboratoire (UUID, optionnel)
            </label>
            <input
              type="text"
              name="laboratoryId"
              pattern="[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}"
              placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              className="w-full rounded border px-3 py-2 font-mono text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Date de résultat attendue (optionnel)
            </label>
            <input
              type="date"
              name="expectedResultDate"
              className="w-full rounded border px-3 py-2 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="rounded bg-blue-700 px-4 py-2 text-white hover:bg-blue-800 disabled:opacity-50"
          >
            {isPending ? 'Soumission…' : 'Soumettre le test'}
          </button>
        </form>
      </div>
    </div>
  );
}

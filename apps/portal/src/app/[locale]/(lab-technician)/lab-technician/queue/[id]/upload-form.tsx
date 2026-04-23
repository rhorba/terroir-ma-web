'use client';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { uploadReport } from './actions';

export function UploadForm({ labTestId }: { labTestId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    startTransition(async () => {
      await uploadReport(labTestId, fd);
      router.refresh();
    });
  }

  return (
    <div className="mt-6 rounded-lg border bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">Joindre le rapport PDF</h2>
      <form onSubmit={handleSubmit} className="flex items-end gap-4">
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Rapport PDF (max 20 Mo)
          </label>
          <input
            type="file"
            name="file"
            accept="application/pdf"
            required
            className="w-full rounded border px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="rounded bg-gray-700 px-4 py-2 text-white hover:bg-gray-800 disabled:opacity-50"
        >
          {isPending ? 'Envoi…' : 'Téléverser'}
        </button>
      </form>
    </div>
  );
}

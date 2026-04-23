'use client';

import { useTransition, useState } from 'react';
import { useRouter } from 'next/navigation';
import { denyCertification } from '../actions';

export function DenyForm({ certificationId }: { certificationId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const reason = (fd.get('reason') as string).trim();

    if (reason.length < 10) {
      setError('Le motif doit comporter au moins 10 caractères.');
      return;
    }
    setError(null);

    startTransition(async () => {
      const res = await denyCertification(certificationId, reason);
      if (res.error) {
        setError(res.error);
      } else {
        router.push('/fr/certification-body/certifications');
      }
    });
  }

  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-6">
      <h2 className="mb-4 text-base font-semibold text-red-800">Refuser la certification</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Motif du refus <span className="text-red-500">*</span>
          </label>
          <textarea
            name="reason"
            required
            minLength={10}
            rows={4}
            placeholder="Expliquez les raisons du refus (min. 10 caractères)…"
            className="w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
          />
        </div>

        {error && <p className="text-sm text-red-700">{error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="rounded bg-red-700 px-6 py-2 text-sm font-medium text-white hover:bg-red-800 disabled:opacity-50"
        >
          {pending ? 'Traitement…' : '❌ Refuser la certification'}
        </button>
      </form>
    </div>
  );
}

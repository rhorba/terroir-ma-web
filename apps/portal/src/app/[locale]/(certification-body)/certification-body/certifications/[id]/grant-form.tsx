'use client';

import { useTransition, useState } from 'react';
import { useRouter } from 'next/navigation';
import { grantCertification } from '../actions';

export function GrantForm({ certificationId }: { certificationId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const validFrom  = fd.get('validFrom')  as string;
    const validUntil = fd.get('validUntil') as string;
    setError(null);

    startTransition(async () => {
      const res = await grantCertification(certificationId, validFrom, validUntil);
      if (res.error) {
        setError(res.error);
      } else {
        router.push('/fr/certification-body/certifications');
      }
    });
  }

  return (
    <div className="rounded-lg border border-green-200 bg-green-50 p-6">
      <h2 className="mb-4 text-base font-semibold text-green-800">Accorder la certification</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Valide du <span className="text-red-500">*</span>
            </label>
            <input
              name="validFrom"
              type="date"
              required
              className="w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {"Valide jusqu'au"} <span className="text-red-500">*</span>
            </label>
            <input
              name="validUntil"
              type="date"
              required
              className="w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="rounded bg-green-700 px-6 py-2 text-sm font-medium text-white hover:bg-green-800 disabled:opacity-50"
        >
          {pending ? 'Traitement…' : '✅ Accorder la certification'}
        </button>
      </form>
    </div>
  );
}

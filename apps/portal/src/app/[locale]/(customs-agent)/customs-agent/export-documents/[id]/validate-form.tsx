'use client';

import { useState, useTransition } from 'react';
import { validateDocument } from './actions';

export function ValidateForm({ docId }: { docId: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleValidate() {
    setError(null);
    startTransition(async () => {
      try {
        await validateDocument(docId);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Erreur inattendue');
      }
    });
  }

  return (
    <div className="rounded-lg border border-green-200 bg-green-50 p-6">
      <h2 className="mb-3 text-base font-semibold text-green-800">
        Valider le dédouanement
      </h2>
      <p className="mb-4 text-sm text-green-700">
        Approuver ce document confirme la clearance douanière pour l&apos;exportation.
      </p>
      {error && (
        <p className="mb-3 rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}
      <button
        onClick={handleValidate}
        disabled={isPending}
        className="rounded bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800 disabled:opacity-50"
      >
        {isPending ? 'Validation…' : 'Valider le dédouanement'}
      </button>
    </div>
  );
}

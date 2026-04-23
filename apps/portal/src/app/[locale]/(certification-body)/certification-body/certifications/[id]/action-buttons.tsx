'use client';

import { useTransition, useState } from 'react';
import { useRouter } from 'next/navigation';
import { startReview, startFinalReview, revokeCertification } from '../actions';

interface ActionButtonsProps {
  certificationId: string;
  currentStatus: string;
}

export function ActionButtons({ certificationId, currentStatus }: ActionButtonsProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showRevokeForm, setShowRevokeForm] = useState(false);

  function run(action: () => Promise<{ error?: string }>) {
    setError(null);
    startTransition(async () => {
      const res = await action();
      if (res.error) setError(res.error);
      else router.refresh();
    });
  }

  function handleRevoke(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const reason = (fd.get('revokeReason') as string).trim();
    if (reason.length < 5) {
      setError('Motif trop court.');
      return;
    }
    run(() => revokeCertification(certificationId, reason));
    setShowRevokeForm(false);
  }

  return (
    <div className="space-y-4">
      {currentStatus === 'SUBMITTED' && (
        <button
          onClick={() => run(() => startReview(certificationId))}
          disabled={pending}
          className="rounded bg-purple-700 px-6 py-2 text-sm font-medium text-white hover:bg-purple-800 disabled:opacity-50"
        >
          {pending ? 'Traitement…' : "🔍 Démarrer l'examen documentaire"}
        </button>
      )}

      {currentStatus === 'LAB_RESULTS_RECEIVED' && (
        <button
          onClick={() => run(() => startFinalReview(certificationId))}
          disabled={pending}
          className="rounded bg-purple-700 px-6 py-2 text-sm font-medium text-white hover:bg-purple-800 disabled:opacity-50"
        >
          {pending ? 'Traitement…' : "🔬 Démarrer l'examen final"}
        </button>
      )}

      {(currentStatus === 'GRANTED' || currentStatus === 'RENEWED') && (
        <div>
          {!showRevokeForm ? (
            <button
              onClick={() => setShowRevokeForm(true)}
              className="rounded border border-gray-400 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Révoquer la certification
            </button>
          ) : (
            <form
              onSubmit={handleRevoke}
              className="space-y-3 rounded-lg border bg-white p-4 shadow-sm"
            >
              <p className="text-sm font-medium text-gray-700">Motif de révocation</p>
              <textarea
                name="revokeReason"
                required
                rows={3}
                placeholder="Raison de la révocation…"
                className="w-full rounded border px-3 py-2 text-sm"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={pending}
                  className="rounded bg-gray-800 px-4 py-2 text-sm text-white hover:bg-gray-900 disabled:opacity-50"
                >
                  {pending ? 'Traitement…' : 'Confirmer la révocation'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowRevokeForm(false)}
                  className="rounded border px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                >
                  Annuler
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

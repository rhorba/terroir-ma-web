'use client';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { rejectCooperative } from '../actions';

export function RejectCooperativeForm({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleReject() {
    if (!reason.trim()) return;
    startTransition(async () => {
      await rejectCooperative(id, reason.trim());
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded border border-red-300 bg-white px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
      >
        Rejeter
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-semibold">Rejeter la coopérative</h3>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Motif de rejet
            </label>
            <textarea
              className="w-full rounded border border-gray-300 p-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-400"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Précisez la raison du rejet..."
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100"
              >
                Annuler
              </button>
              <button
                onClick={handleReject}
                disabled={isPending || !reason.trim()}
                className="rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {isPending ? 'Rejet...' : 'Confirmer le rejet'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

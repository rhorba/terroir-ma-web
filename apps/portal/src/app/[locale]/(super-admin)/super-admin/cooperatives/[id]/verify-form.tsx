'use client';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { verifyCooperative } from '../actions';

export function VerifyCooperativeForm({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleVerify() {
    if (!confirm('Confirmer la vérification de cette coopérative ?')) return;
    startTransition(async () => {
      await verifyCooperative(id);
      router.refresh();
    });
  }

  return (
    <button
      onClick={handleVerify}
      disabled={isPending}
      className="rounded bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
    >
      {isPending ? 'Vérification...' : 'Vérifier'}
    </button>
  );
}

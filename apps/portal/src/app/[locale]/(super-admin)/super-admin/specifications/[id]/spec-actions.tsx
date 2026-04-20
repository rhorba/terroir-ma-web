'use client';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { deactivateProductType } from '../actions';

export function SpecActions({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleDeactivate() {
    if (!confirm('Désactiver cette spécification ?')) return;
    startTransition(async () => {
      await deactivateProductType(id);
      router.push('../../specifications');
    });
  }

  return (
    <button
      onClick={handleDeactivate}
      disabled={isPending}
      className="rounded border border-red-300 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
    >
      {isPending ? '...' : 'Désactiver'}
    </button>
  );
}

'use client';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { accreditLab, revokeLab } from '../actions';

export function LabActions({
  id,
  isAccredited,
}: {
  id: string;
  isAccredited: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handle = (fn: () => Promise<void>) => {
    startTransition(async () => {
      await fn();
      router.refresh();
    });
  };

  if (isAccredited) {
    return (
      <button
        onClick={() => handle(() => revokeLab(id))}
        disabled={isPending}
        className="rounded border border-red-300 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
      >
        {isPending ? '...' : "Révoquer l'accréditation"}
      </button>
    );
  }
  return (
    <button
      onClick={() => handle(() => accreditLab(id))}
      disabled={isPending}
      className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
    >
      {isPending ? '...' : 'Accréditer'}
    </button>
  );
}

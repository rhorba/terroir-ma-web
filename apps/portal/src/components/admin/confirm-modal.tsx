'use client';
import { useState } from 'react';

export function ConfirmModal({
  trigger,
  title,
  children,
  action,
}: {
  trigger: React.ReactNode;
  title: string;
  children?: React.ReactNode;
  action: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <span onClick={() => setOpen(true)} className="cursor-pointer">{trigger}</span>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-semibold">{title}</h3>
            {children}
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100"
              >
                Annuler
              </button>
              {action}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

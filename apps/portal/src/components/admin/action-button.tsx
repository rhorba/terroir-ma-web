'use client';
import { useFormStatus } from 'react-dom';

export function ActionButton({
  label,
  pendingLabel = 'En cours...',
  variant = 'primary',
  disabled,
}: {
  label: string;
  pendingLabel?: string;
  variant?: 'primary' | 'danger' | 'secondary';
  disabled?: boolean;
}) {
  const { pending } = useFormStatus();
  const cls = {
    primary:   'bg-green-600 hover:bg-green-700 text-white',
    danger:    'bg-red-600 hover:bg-red-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
  }[variant];
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className={`rounded px-3 py-1.5 text-sm font-medium disabled:opacity-50 ${cls}`}
    >
      {pending ? pendingLabel : label}
    </button>
  );
}

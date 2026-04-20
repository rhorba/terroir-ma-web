const COLORS: Record<string, string> = {
  pending:    'bg-yellow-100 text-yellow-800',
  active:     'bg-green-100 text-green-800',
  suspended:  'bg-red-100 text-red-800',
  revoked:    'bg-gray-200 text-gray-700',
  accredited: 'bg-blue-100 text-blue-800',
  passed:     'bg-green-100 text-green-800',
  failed:     'bg-red-100 text-red-800',
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${COLORS[status] ?? 'bg-gray-100 text-gray-700'}`}
    >
      {status}
    </span>
  );
}

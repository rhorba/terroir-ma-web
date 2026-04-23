import { apiFetch } from '@/lib/api-server';
import { PageHeader } from '@/components/admin/page-header';
import { DataTable } from '@/components/admin/data-table';
import { StatusBadge } from '@/components/admin/status-badge';
import Link from 'next/link';

type LabTest = {
  id: string;
  batchId: string;
  productTypeCode: string;
  status: string;
  submittedAt: string;
  expectedResultDate: string | null;
  reportFileName: string | null;
};

type PagedLabTests = {
  success: boolean;
  data: LabTest[];
  meta: { page: number; limit: number; total: number };
};

const STATUSES = [
  { value: '', label: 'Tous' },
  { value: 'submitted', label: 'Soumis' },
  { value: 'in_progress', label: 'En cours' },
  { value: 'completed', label: 'Complétés' },
  { value: 'cancelled', label: 'Annulés' },
];

export default async function LabTestQueuePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? 1));
  const status = params.status ?? '';

  const qs = new URLSearchParams({ page: String(page), limit: '20' });
  if (status) qs.set('status', status);

  let result: PagedLabTests = { success: true, data: [], meta: { page: 1, limit: 20, total: 0 } };
  try {
    result = await apiFetch<PagedLabTests>(`/api/v1/lab-tests?${qs}`);
  } catch {
    // backend unavailable in dev
  }

  return (
    <div>
      <PageHeader title="File d'attente" subtitle={`${result.meta.total} test(s)`} />

      <div className="mb-4 flex gap-2 flex-wrap">
        {STATUSES.map((s) => (
          <Link
            key={s.value}
            href={`?status=${s.value}&page=1`}
            className={`rounded-full px-3 py-1 text-sm border ${
              status === s.value
                ? 'bg-blue-700 text-white border-blue-700'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            {s.label}
          </Link>
        ))}
      </div>

      <DataTable
        head={['Lot (batchId)', 'Type produit', 'Statut', 'Soumis le', 'Résultat attendu', 'Rapport', '']}
        isEmpty={result.data.length === 0}
        empty="Aucun test dans la file."
      >
        {result.data.map((t) => (
          <tr key={t.id} className="hover:bg-gray-50">
            <td className="px-4 py-3 font-mono text-xs">{t.batchId.slice(0, 8)}…</td>
            <td className="px-4 py-3 text-sm">{t.productTypeCode}</td>
            <td className="px-4 py-3">
              <StatusBadge status={t.status} />
            </td>
            <td className="px-4 py-3 text-sm">
              {new Date(t.submittedAt).toLocaleDateString('fr-MA')}
            </td>
            <td className="px-4 py-3 text-sm">{t.expectedResultDate ?? '—'}</td>
            <td className="px-4 py-3 text-sm">
              {t.reportFileName ? (
                <span className="text-green-700">✓ {t.reportFileName}</span>
              ) : (
                <span className="text-gray-400">—</span>
              )}
            </td>
            <td className="px-4 py-3">
              <Link
                href={`/fr/lab-technician/queue/${t.id}`}
                className="text-blue-700 hover:underline text-sm"
              >
                Voir →
              </Link>
            </td>
          </tr>
        ))}
      </DataTable>

      <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
        <span>{result.meta.total} résultats</span>
        <div className="flex gap-2">
          {page > 1 && (
            <Link
              href={`?status=${status}&page=${page - 1}`}
              className="rounded border px-3 py-1 hover:bg-gray-50"
            >
              Précédent
            </Link>
          )}
          {page * 20 < result.meta.total && (
            <Link
              href={`?status=${status}&page=${page + 1}`}
              className="rounded border px-3 py-1 hover:bg-gray-50"
            >
              Suivant
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

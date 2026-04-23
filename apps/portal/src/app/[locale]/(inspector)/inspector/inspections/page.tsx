import { apiFetch } from '@/lib/api-server';
import { PageHeader } from '@/components/admin/page-header';
import { DataTable } from '@/components/admin/data-table';
import { StatusBadge } from '@/components/admin/status-badge';
import Link from 'next/link';

type Inspection = {
  id: string;
  certificationId: string;
  status: string;
  scheduledDate: string;
  passed: boolean | null;
  createdAt: string;
};

type PagedInspections = {
  success: boolean;
  data: Inspection[];
  meta: { page: number; limit: number; total: number };
};

export default async function InspectionsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? 1));

  let result: PagedInspections = { success: true, data: [], meta: { page: 1, limit: 20, total: 0 } };
  try {
    result = await apiFetch<PagedInspections>(
      `/api/v1/inspections/my?page=${page}&limit=20`,
    );
  } catch {
    // backend unavailable in dev
  }

  return (
    <div>
      <PageHeader
        title="Mes Inspections"
        subtitle={`${result.meta.total} inspection(s)`}
      />

      <DataTable
        head={['Certification', 'Statut', 'Date planifiée', 'Résultat', 'Créée le', '']}
        isEmpty={result.data.length === 0}
        empty="Aucune inspection assignée."
      >
        {result.data.map((i) => (
          <tr key={i.id} className="hover:bg-gray-50">
            <td className="px-4 py-3 font-mono text-xs">{i.certificationId.slice(0, 8)}…</td>
            <td className="px-4 py-3">
              <StatusBadge status={i.status} />
            </td>
            <td className="px-4 py-3">
              {new Date(i.scheduledDate).toLocaleDateString('fr-MA')}
            </td>
            <td className="px-4 py-3">
              {i.passed === null ? '—' : i.passed ? '✅ Conforme' : '❌ Non conforme'}
            </td>
            <td className="px-4 py-3 text-gray-500">
              {new Date(i.createdAt).toLocaleDateString('fr-MA')}
            </td>
            <td className="px-4 py-3">
              <Link
                href={`/fr/inspector/inspections/${i.id}`}
                className="text-amber-700 hover:underline text-sm"
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
            <Link href={`?page=${page - 1}`} className="rounded border px-3 py-1 hover:bg-gray-50">
              Précédent
            </Link>
          )}
          {page * 20 < result.meta.total && (
            <Link href={`?page=${page + 1}`} className="rounded border px-3 py-1 hover:bg-gray-50">
              Suivant
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

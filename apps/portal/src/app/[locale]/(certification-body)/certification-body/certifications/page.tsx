import { apiFetch } from '@/lib/api-server';
import { PageHeader } from '@/components/admin/page-header';
import { StatusBadge } from '@/components/admin/status-badge';
import Link from 'next/link';

type Certification = {
  id: string;
  certificationNumber: string | null;
  cooperativeName: string;
  productTypeCode: string;
  regionCode: string;
  currentStatus: string;
  requestedAt: string;
};

type PagedResult = {
  data: Certification[];
  meta: { page: number; limit: number; total: number };
};

export default async function CertificationsListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr ?? '1', 10));

  let result: PagedResult = { data: [], meta: { page: 1, limit: 20, total: 0 } };
  try {
    result = await apiFetch<PagedResult>(
      `/api/v1/certifications/pending?page=${page}&limit=20`,
    );
  } catch {
    return <p className="text-red-600">Backend indisponible.</p>;
  }

  const { data: certs, meta } = result;
  const totalPages = Math.ceil(meta.total / meta.limit);

  return (
    <div>
      <PageHeader
        title="Demandes de certification"
        subtitle={`${meta.total} demande(s) en attente`}
      />

      <div className="mt-6 overflow-x-auto rounded-lg border bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {['N° Certification', 'Coopérative', 'Type', 'Région', 'Statut', 'Déposé le', ''].map(
                (h) => (
                  <th key={h} className="px-4 py-3 text-left font-medium text-gray-700">
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y">
            {certs.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                  Aucune demande en attente.
                </td>
              </tr>
            )}
            {certs.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-xs">
                  {c.certificationNumber ?? c.id.slice(0, 8) + '…'}
                </td>
                <td className="px-4 py-3">{c.cooperativeName}</td>
                <td className="px-4 py-3">{c.productTypeCode}</td>
                <td className="px-4 py-3">{c.regionCode}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={c.currentStatus} />
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {new Date(c.requestedAt).toLocaleDateString('fr-MA')}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/fr/certification-body/certifications/${c.id}`}
                    className="font-medium text-purple-700 hover:underline"
                  >
                    Examiner →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-gray-500">
            Page {meta.page} / {totalPages}
          </span>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={`?page=${page - 1}`}
                className="rounded border px-3 py-1 hover:bg-gray-50"
              >
                ← Précédent
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={`?page=${page + 1}`}
                className="rounded border px-3 py-1 hover:bg-gray-50"
              >
                Suivant →
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

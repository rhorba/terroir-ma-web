import { apiFetch } from '@/lib/api-server';
import { PageHeader } from '@/components/admin/page-header';
import { StatusBadge } from '@/components/admin/status-badge';
import Link from 'next/link';

type ExportDocument = {
  id: string;
  status: string;
  destinationCountry: string;
  consigneeName: string;
  hsCode: string;
  quantityKg: number;
  onssaReference: string | null;
  createdAt: string;
};

type PagedResult = {
  data: ExportDocument[];
  meta: { page: number; limit: number; total: number };
};

export default async function ExportDocumentsListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr ?? '1', 10));

  let result: PagedResult = { data: [], meta: { page: 1, limit: 20, total: 0 } };
  try {
    result = await apiFetch<PagedResult>(
      `/api/v1/export-documents?page=${page}&limit=20`,
    );
  } catch {
    return <p className="text-red-600">Backend indisponible.</p>;
  }

  const { data: docs, meta } = result;
  const totalPages = Math.ceil(meta.total / meta.limit);

  return (
    <div>
      <PageHeader
        title="Documents d'exportation"
        subtitle={`${meta.total} document(s)`}
        action={
          <Link
            href="export-documents/new"
            className="rounded bg-slate-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700"
          >
            + Générer un document
          </Link>
        }
      />

      <div className="mt-6 overflow-x-auto rounded-lg border bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {['ID', 'Destinataire', 'Pays', 'Code HS', 'Qté (kg)', 'Réf. ONSSA', 'Statut', 'Créé le', ''].map(
                (h) => (
                  <th key={h} className="px-4 py-3 text-left font-medium text-gray-700">
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y">
            {docs.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-gray-400">
                  Aucun document d&apos;exportation.
                </td>
              </tr>
            )}
            {docs.map((d) => (
              <tr key={d.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-xs text-gray-500">
                  {d.id.slice(0, 8)}…
                </td>
                <td className="px-4 py-3">{d.consigneeName}</td>
                <td className="px-4 py-3">{d.destinationCountry}</td>
                <td className="px-4 py-3 font-mono text-xs">{d.hsCode}</td>
                <td className="px-4 py-3 text-right">
                  {Number(d.quantityKg).toLocaleString('fr-MA')}
                </td>
                <td className="px-4 py-3">{d.onssaReference ?? '—'}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={d.status} />
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {new Date(d.createdAt).toLocaleDateString('fr-MA')}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`export-documents/${d.id}`}
                    className="font-medium text-slate-700 hover:underline"
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
              <Link href={`?page=${page - 1}`} className="rounded border px-3 py-1 hover:bg-gray-50">
                ← Précédent
              </Link>
            )}
            {page < totalPages && (
              <Link href={`?page=${page + 1}`} className="rounded border px-3 py-1 hover:bg-gray-50">
                Suivant →
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

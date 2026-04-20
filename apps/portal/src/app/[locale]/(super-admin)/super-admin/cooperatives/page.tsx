import { apiFetch } from '@/lib/api-server';
import { PageHeader } from '@/components/admin/page-header';
import { StatusBadge } from '@/components/admin/status-badge';
import { DataTable } from '@/components/admin/data-table';
import Link from 'next/link';

type Cooperative = {
  id: string;
  name: string;
  ice: string;
  regionCode: string;
  city: string;
  status: string;
  createdAt: string;
};

type PagedResult = {
  data: Cooperative[];
  total: number;
  page: number;
  limit: number;
};

const TABS = [
  { label: 'En attente', value: 'pending' },
  { label: 'Actives', value: 'active' },
  { label: 'Suspendues', value: 'suspended' },
  { label: 'Toutes', value: '' },
];

export default async function CooperativesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const params = await searchParams;
  const status = params.status ?? 'pending';
  const page = Number(params.page ?? 1);
  const query = new URLSearchParams({ page: String(page), limit: '20' });
  if (status) query.set('status', status);

  const result = await apiFetch<PagedResult>(`/api/v1/cooperatives?${query}`);

  return (
    <div>
      <PageHeader title="Coopératives" subtitle={`${result.total} coopératives au total`} />

      <div className="mb-4 flex gap-1 border-b border-gray-200">
        {TABS.map((t) => (
          <Link
            key={t.value}
            href={`?status=${t.value}`}
            className={`px-4 py-2 text-sm font-medium ${
              status === t.value
                ? 'border-b-2 border-green-600 text-green-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      <DataTable
        head={['Nom', 'ICE', 'Région', 'Ville', 'Statut', 'Créée le', 'Actions']}
        isEmpty={result.data.length === 0}
        empty="Aucune coopérative dans cette catégorie."
      >
        {result.data.map((coop) => (
          <tr key={coop.id} className="hover:bg-gray-50">
            <td className="px-4 py-3 font-medium">{coop.name}</td>
            <td className="px-4 py-3 font-mono text-xs">{coop.ice}</td>
            <td className="px-4 py-3">{coop.regionCode}</td>
            <td className="px-4 py-3">{coop.city}</td>
            <td className="px-4 py-3">
              <StatusBadge status={coop.status} />
            </td>
            <td className="px-4 py-3 text-gray-500">
              {new Date(coop.createdAt).toLocaleDateString('fr-MA')}
            </td>
            <td className="px-4 py-3">
              <Link
                href={`cooperatives/${coop.id}`}
                className="text-sm text-green-700 hover:underline"
              >
                Voir
              </Link>
            </td>
          </tr>
        ))}
      </DataTable>

      <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
        <span>{result.total} résultats</span>
        <div className="flex gap-2">
          {page > 1 && (
            <Link
              href={`?status=${status}&page=${page - 1}`}
              className="rounded border px-3 py-1 hover:bg-gray-50"
            >
              Précédent
            </Link>
          )}
          {page * 20 < result.total && (
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

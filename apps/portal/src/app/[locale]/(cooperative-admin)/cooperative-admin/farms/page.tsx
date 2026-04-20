import { apiFetch } from '@/lib/api-server';
import { getCooperativeId } from '@/lib/auth-utils';
import { PageHeader } from '@/components/admin/page-header';
import { DataTable } from '@/components/admin/data-table';
import Link from 'next/link';

type Farm = {
  id: string;
  name: string;
  regionCode: string;
  commune: string | null;
  areaHectares: number;
  cropTypes: string[];
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
};

type PagedFarms = { data: Farm[]; total: number; page: number; limit: number };

export default async function FarmsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const cooperativeId = await getCooperativeId();
  if (!cooperativeId) return <p className="text-red-600">Coopérative introuvable.</p>;

  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? 1));

  const result = await apiFetch<PagedFarms>(
    `/api/v1/cooperatives/${cooperativeId}/farms?page=${page}&limit=20`,
  );

  return (
    <div>
      <PageHeader
        title="Fermes"
        subtitle={`${result.total} fermes enregistrées`}
        action={
          <Link
            href="farms/new"
            className="rounded bg-green-700 px-4 py-2 text-sm text-white hover:bg-green-800"
          >
            + Ajouter
          </Link>
        }
      />

      <DataTable
        head={['Nom', 'Région', 'Commune', 'Surface (ha)', 'Cultures', 'GPS', 'Ajoutée le']}
        isEmpty={result.data.length === 0}
        empty="Aucune ferme enregistrée."
      >
        {result.data.map((f) => (
          <tr key={f.id} className="hover:bg-gray-50">
            <td className="px-4 py-3 font-medium">{f.name}</td>
            <td className="px-4 py-3">{f.regionCode}</td>
            <td className="px-4 py-3 text-gray-500">{f.commune ?? '—'}</td>
            <td className="px-4 py-3">{Number(f.areaHectares).toFixed(2)} ha</td>
            <td className="px-4 py-3 text-xs">{f.cropTypes.join(', ') || '—'}</td>
            <td className="px-4 py-3 font-mono text-xs">
              {f.latitude != null && f.longitude != null
                ? `${Number(f.latitude).toFixed(4)}, ${Number(f.longitude).toFixed(4)}`
                : '—'}
            </td>
            <td className="px-4 py-3 text-gray-500">
              {new Date(f.createdAt).toLocaleDateString('fr-MA')}
            </td>
          </tr>
        ))}
      </DataTable>

      <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
        <span>{result.total} résultats</span>
        <div className="flex gap-2">
          {page > 1 && (
            <Link
              href={`?page=${page - 1}`}
              className="rounded border px-3 py-1 hover:bg-gray-50"
            >
              Précédent
            </Link>
          )}
          {page * 20 < result.total && (
            <Link
              href={`?page=${page + 1}`}
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

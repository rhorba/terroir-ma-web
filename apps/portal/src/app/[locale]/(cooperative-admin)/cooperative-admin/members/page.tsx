import { apiFetch } from '@/lib/api-server';
import { getCooperativeId } from '@/lib/auth-utils';
import { PageHeader } from '@/components/admin/page-header';
import { DataTable } from '@/components/admin/data-table';
import { StatusBadge } from '@/components/admin/status-badge';
import Link from 'next/link';

type Member = {
  id: string;
  fullName: string;
  cin: string;
  phone: string;
  email: string | null;
  role: string;
  isActive: boolean;
  createdAt: string;
};

type PagedMembers = {
  success: boolean;
  data: Member[];
  meta: { page: number; limit: number; total: number };
};

export default async function MembersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const cooperativeId = await getCooperativeId();
  if (!cooperativeId) return <p className="text-red-600">Coopérative introuvable.</p>;

  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? 1));

  const result = await apiFetch<PagedMembers>(
    `/api/v1/cooperatives/${cooperativeId}/members?page=${page}&limit=20`,
  );

  return (
    <div>
      <PageHeader
        title="Membres"
        subtitle={`${result.meta.total} membres`}
        action={
          <Link
            href="members/new"
            className="rounded bg-green-700 px-4 py-2 text-sm text-white hover:bg-green-800"
          >
            + Ajouter
          </Link>
        }
      />

      <DataTable
        head={['Nom', 'CIN', 'Téléphone', 'Email', 'Rôle', 'Statut', 'Ajouté le']}
        isEmpty={result.data.length === 0}
        empty="Aucun membre enregistré."
      >
        {result.data.map((m) => (
          <tr key={m.id} className="hover:bg-gray-50">
            <td className="px-4 py-3 font-medium">{m.fullName}</td>
            <td className="px-4 py-3 font-mono text-xs">{m.cin}</td>
            <td className="px-4 py-3">{m.phone}</td>
            <td className="px-4 py-3 text-gray-500">{m.email ?? '—'}</td>
            <td className="px-4 py-3 capitalize">{m.role}</td>
            <td className="px-4 py-3">
              <StatusBadge status={m.isActive ? 'active' : 'inactive'} />
            </td>
            <td className="px-4 py-3 text-gray-500">
              {new Date(m.createdAt).toLocaleDateString('fr-MA')}
            </td>
          </tr>
        ))}
      </DataTable>

      <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
        <span>{result.meta.total} résultats</span>
        <div className="flex gap-2">
          {page > 1 && (
            <Link
              href={`?page=${page - 1}`}
              className="rounded border px-3 py-1 hover:bg-gray-50"
            >
              Précédent
            </Link>
          )}
          {page * 20 < result.meta.total && (
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

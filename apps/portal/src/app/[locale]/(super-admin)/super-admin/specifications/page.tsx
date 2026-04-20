import { apiFetch } from '@/lib/api-server';
import { PageHeader } from '@/components/admin/page-header';
import { StatusBadge } from '@/components/admin/status-badge';
import { DataTable } from '@/components/admin/data-table';
import Link from 'next/link';

type ProductType = {
  id: string;
  code: string;
  nameFr: string;
  nameAr: string;
  certificationType: string;
  regionCode: string;
  isActive: boolean;
  validityDays?: number | null;
  hsCode?: string | null;
};

type PagedResult = { data: ProductType[]; total: number };

export default async function SpecificationsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const result = await apiFetch<PagedResult>(
    `/api/v1/product-types?page=${page}&limit=20`,
  );
  const specs = result.data ?? [];

  return (
    <div>
      <PageHeader
        title="Spécifications SDOQ"
        subtitle={`${result.total} types de produits`}
        action={
          <Link
            href="specifications/new"
            className="rounded bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700"
          >
            + Nouvelle spécification
          </Link>
        }
      />
      <DataTable
        head={['Code', 'Nom (FR)', 'Type', 'Région', 'HS Code', 'Validité (j)', 'Statut', 'Actions']}
        isEmpty={specs.length === 0}
        empty="Aucune spécification enregistrée."
      >
        {specs.map((s) => (
          <tr key={s.id} className="hover:bg-gray-50">
            <td className="px-4 py-3 font-mono text-xs">{s.code}</td>
            <td className="px-4 py-3 font-medium">{s.nameFr}</td>
            <td className="px-4 py-3">
              <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-800">
                {s.certificationType}
              </span>
            </td>
            <td className="px-4 py-3">{s.regionCode}</td>
            <td className="px-4 py-3 font-mono text-xs">{s.hsCode ?? '—'}</td>
            <td className="px-4 py-3">{s.validityDays ?? '—'}</td>
            <td className="px-4 py-3">
              <StatusBadge status={s.isActive ? 'active' : 'suspended'} />
            </td>
            <td className="px-4 py-3">
              <Link
                href={`specifications/${s.id}`}
                className="text-sm text-green-700 hover:underline"
              >
                Modifier
              </Link>
            </td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
}

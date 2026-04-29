import { apiFetch } from '@/lib/api-server';
import { PageHeader } from '@/components/admin/page-header';
import { DataTable } from '@/components/admin/data-table';
import Link from 'next/link';

type AuditEntry = {
  id: string;
  action: string;
  userId: string;
  entityType: string;
  entityId: string;
  createdAt: string;
};

type PagedAudit = {
  data: AuditEntry[];
  total: number;
  page: number;
  limit: number;
};

export default async function AuditLogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; from?: string; to?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const query = new URLSearchParams({ page: String(page), limit: '30' });
  if (params.from) query.set('from', params.from);
  if (params.to) query.set('to', params.to);

  const result = await apiFetch<PagedAudit>(`/api/v1/admin/audit-logs?${query}`);
  const logs = result?.data ?? [];
  const total = result?.total ?? 0;

  return (
    <div>
      <PageHeader title="Journal d'audit" subtitle={`${total} entrées`} />

      <form method="GET" className="mb-4 flex gap-3 text-sm">
        <div className="flex items-center gap-1">
          <label className="text-gray-500">Du</label>
          <input
            type="date"
            name="from"
            defaultValue={params.from}
            className="rounded border border-gray-300 px-2 py-1 text-sm"
          />
        </div>
        <div className="flex items-center gap-1">
          <label className="text-gray-500">Au</label>
          <input
            type="date"
            name="to"
            defaultValue={params.to}
            className="rounded border border-gray-300 px-2 py-1 text-sm"
          />
        </div>
        <button
          type="submit"
          className="rounded bg-gray-800 px-3 py-1 text-sm text-white hover:bg-gray-700"
        >
          Filtrer
        </button>
      </form>

      <DataTable
        head={['Action', 'Utilisateur', 'Entité', 'Entité ID', 'Date']}
        isEmpty={logs.length === 0}
        empty="Aucune entrée dans la plage sélectionnée."
      >
        {logs.map((log) => (
          <tr key={log.id} className="hover:bg-gray-50">
            <td className="px-4 py-3 font-mono text-xs">{log.action}</td>
            <td className="max-w-[120px] truncate px-4 py-3 font-mono text-xs">
              {log.userId}
            </td>
            <td className="px-4 py-3">{log.entityType}</td>
            <td className="px-4 py-3 font-mono text-xs">{log.entityId?.slice(0, 8)}…</td>
            <td className="whitespace-nowrap px-4 py-3 text-gray-500">
              {new Date(log.createdAt).toLocaleString('fr-MA')}
            </td>
          </tr>
        ))}
      </DataTable>

      <div className="mt-4 flex gap-2 text-sm">
        {page > 1 && (
          <Link href={`?page=${page - 1}`} className="rounded border px-3 py-1 hover:bg-gray-50">
            Précédent
          </Link>
        )}
        {page * 30 < total && (
          <Link href={`?page=${page + 1}`} className="rounded border px-3 py-1 hover:bg-gray-50">
            Suivant
          </Link>
        )}
      </div>
    </div>
  );
}

import { apiFetch } from '@/lib/api-server';
import { PageHeader } from '@/components/admin/page-header';
import { StatusBadge } from '@/components/admin/status-badge';
import { DataTable } from '@/components/admin/data-table';
import Link from 'next/link';

type Lab = {
  id: string;
  name: string;
  onssaAccreditationNumber?: string | null;
  isAccredited: boolean;
  createdAt: string;
};

export default async function LabsPage() {
  const labs = (await apiFetch<Lab[]>('/api/v1/labs')) ?? [];

  return (
    <div>
      <PageHeader
        title="Laboratoires"
        subtitle={`${labs.length} laboratoires enregistrés`}
        action={
          <Link
            href="labs/new"
            className="rounded bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700"
          >
            + Nouveau laboratoire
          </Link>
        }
      />
      <DataTable
        head={['Nom', 'N° Accréditation ONSSA', 'Statut', 'Enregistré le', 'Actions']}
        isEmpty={labs.length === 0}
        empty="Aucun laboratoire enregistré."
      >
        {labs.map((lab) => (
          <tr key={lab.id} className="hover:bg-gray-50">
            <td className="px-4 py-3 font-medium">{lab.name}</td>
            <td className="px-4 py-3 font-mono text-xs">
              {lab.onssaAccreditationNumber ?? '—'}
            </td>
            <td className="px-4 py-3">
              <StatusBadge status={lab.isAccredited ? 'accredited' : 'pending'} />
            </td>
            <td className="px-4 py-3 text-gray-500">
              {new Date(lab.createdAt).toLocaleDateString('fr-MA')}
            </td>
            <td className="px-4 py-3">
              <Link
                href={`labs/${lab.id}`}
                className="text-sm text-green-700 hover:underline"
              >
                Gérer
              </Link>
            </td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
}

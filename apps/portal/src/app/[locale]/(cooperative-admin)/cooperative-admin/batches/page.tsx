import { apiFetch } from '@/lib/api-server';
import { getCooperativeId } from '@/lib/auth-utils';
import { PageHeader } from '@/components/admin/page-header';
import { DataTable } from '@/components/admin/data-table';
import { StatusBadge } from '@/components/admin/status-badge';
import Link from 'next/link';

type Batch = {
  id: string;
  batchNumber?: string;
  campaignYear: string;
  harvestDate: string;
  status: string;
  totalWeightKg: number;
  createdAt: string;
};

export default async function BatchesPage() {
  const cooperativeId = await getCooperativeId();
  if (!cooperativeId) return <p className="text-red-600">Coopérative introuvable.</p>;

  const batches = await apiFetch<Batch[]>(
    `/api/v1/batches/cooperative/${cooperativeId}`,
  );

  return (
    <div>
      <PageHeader
        title="Lots de production"
        subtitle={`${batches.length} lots`}
      />
      <DataTable
        head={['Référence', 'Campagne', 'Date récolte', 'Poids (kg)', 'Statut', 'Actions']}
        isEmpty={batches.length === 0}
        empty="Aucun lot de production enregistré."
      >
        {batches.map((b) => (
          <tr key={b.id} className="hover:bg-gray-50">
            <td className="px-4 py-3 font-mono text-xs">
              {b.batchNumber ?? b.id.slice(0, 8)}
            </td>
            <td className="px-4 py-3">{b.campaignYear}</td>
            <td className="px-4 py-3">
              {b.harvestDate
                ? new Date(b.harvestDate).toLocaleDateString('fr-MA')
                : '—'}
            </td>
            <td className="px-4 py-3">{b.totalWeightKg} kg</td>
            <td className="px-4 py-3">
              <StatusBadge status={b.status} />
            </td>
            <td className="px-4 py-3">
              <Link
                href={`batches/${b.id}`}
                className="text-sm text-green-700 hover:underline"
              >
                Voir détail
              </Link>
            </td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
}

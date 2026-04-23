import { apiFetch } from '@/lib/api-server';
import { getCooperativeId } from '@/lib/auth-utils';
import { PageHeader } from '@/components/admin/page-header';
import { StatusBadge } from '@/components/admin/status-badge';
import Link from 'next/link';

type Batch = {
  id: string;
  batchNumber: string;
  productTypeCode: string;
  status: string;
  totalQuantityKg: number;
  processingDate: string;
};

export default async function BatchesPage() {
  const cooperativeId = await getCooperativeId();

  if (!cooperativeId) {
    return <p className="text-gray-500">Coopérative non configurée dans la session.</p>;
  }

  let batches: Batch[] = [];
  try {
    batches = await apiFetch<Batch[]>(`/api/v1/batches/cooperative/${cooperativeId}`);
    if (!Array.isArray(batches)) batches = [];
  } catch {
    return <p className="text-red-600">Backend indisponible.</p>;
  }

  return (
    <div>
      <PageHeader
        title="Mes Lots"
        subtitle={`${batches.length} lot(s) enregistré(s)`}
        action={
          <Link
            href="/fr/cooperative-member/batches/new"
            className="rounded bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
          >
            + Créer un lot
          </Link>
        }
      />

      <div className="mt-6 overflow-x-auto rounded-lg border bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {['N° Lot', 'Type produit', 'Statut', 'Quantité (kg)', 'Date traitement'].map(
                (h) => (
                  <th key={h} className="px-4 py-3 text-left font-medium text-gray-700">
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y">
            {batches.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                  Aucun lot créé. Commencez par créer un lot à partir de vos récoltes.
                </td>
              </tr>
            )}
            {batches.map((b) => (
              <tr key={b.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-xs">{b.batchNumber}</td>
                <td className="px-4 py-3">{b.productTypeCode}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={b.status} />
                </td>
                <td className="px-4 py-3">{Number(b.totalQuantityKg).toFixed(2)}</td>
                <td className="px-4 py-3">{b.processingDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

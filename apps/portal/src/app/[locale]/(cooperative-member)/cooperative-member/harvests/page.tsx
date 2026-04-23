import { apiFetch } from '@/lib/api-server';
import { getCooperativeId } from '@/lib/auth-utils';
import { PageHeader } from '@/components/admin/page-header';
import Link from 'next/link';

type Harvest = {
  id: string;
  farmId: string;
  productTypeCode: string;
  quantityKg: number;
  harvestDate: string;
  campaignYear: string;
  method: string;
};

export default async function HarvestsPage() {
  const cooperativeId = await getCooperativeId();

  if (!cooperativeId) {
    return <p className="text-gray-500">Coopérative non configurée dans la session.</p>;
  }

  let harvests: Harvest[] = [];
  try {
    harvests = await apiFetch<Harvest[]>(`/api/v1/harvests/cooperative/${cooperativeId}`);
    if (!Array.isArray(harvests)) harvests = [];
  } catch {
    return <p className="text-red-600">Backend indisponible.</p>;
  }

  return (
    <div>
      <PageHeader
        title="Mes Récoltes"
        subtitle={`${harvests.length} récolte(s) enregistrée(s)`}
        action={
          <Link
            href="/fr/cooperative-member/harvests/new"
            className="rounded bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
          >
            + Saisir une récolte
          </Link>
        }
      />

      <div className="mt-6 overflow-x-auto rounded-lg border bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {['Ferme', 'Type produit', 'Quantité (kg)', 'Date récolte', 'Campagne', 'Méthode'].map(
                (h) => (
                  <th key={h} className="px-4 py-3 text-left font-medium text-gray-700">
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y">
            {harvests.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                  Aucune récolte enregistrée. Commencez par saisir une récolte.
                </td>
              </tr>
            )}
            {harvests.map((h) => (
              <tr key={h.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-xs">{h.farmId.slice(0, 8)}…</td>
                <td className="px-4 py-3">{h.productTypeCode}</td>
                <td className="px-4 py-3">{Number(h.quantityKg).toFixed(2)}</td>
                <td className="px-4 py-3">{h.harvestDate}</td>
                <td className="px-4 py-3">{h.campaignYear}</td>
                <td className="px-4 py-3 text-gray-500">{h.method}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

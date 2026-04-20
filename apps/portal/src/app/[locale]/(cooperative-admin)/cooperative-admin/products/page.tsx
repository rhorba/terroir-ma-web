import { apiFetch } from '@/lib/api-server';
import { getCooperativeId } from '@/lib/auth-utils';
import { PageHeader } from '@/components/admin/page-header';
import { DataTable } from '@/components/admin/data-table';
import { StatusBadge } from '@/components/admin/status-badge';

type Product = {
  id: string;
  name: string;
  sdoqType: string;
  regionCode: string;
  status: string;
  createdAt: string;
};

export default async function ProductsPage() {
  const cooperativeId = await getCooperativeId();
  if (!cooperativeId) return <p className="text-red-600">Coopérative introuvable.</p>;

  const products = await apiFetch<Product[]>(
    `/api/v1/products/cooperative/${cooperativeId}`,
  );

  return (
    <div>
      <PageHeader
        title="Produits"
        subtitle={`${products.length} produits enregistrés`}
      />
      <DataTable
        head={['Nom', 'Type SDOQ', 'Région', 'Statut', 'Enregistré le']}
        isEmpty={products.length === 0}
        empty="Aucun produit enregistré pour cette coopérative."
      >
        {products.map((p) => (
          <tr key={p.id} className="hover:bg-gray-50">
            <td className="px-4 py-3 font-medium">{p.name}</td>
            <td className="px-4 py-3">{p.sdoqType}</td>
            <td className="px-4 py-3">{p.regionCode}</td>
            <td className="px-4 py-3">
              <StatusBadge status={p.status} />
            </td>
            <td className="px-4 py-3 text-gray-500">
              {new Date(p.createdAt).toLocaleDateString('fr-MA')}
            </td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
}

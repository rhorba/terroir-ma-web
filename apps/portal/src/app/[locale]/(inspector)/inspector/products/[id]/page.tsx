import { apiFetch } from '@/lib/api-server';
import { PageHeader } from '@/components/admin/page-header';
import { StatusBadge } from '@/components/admin/status-badge';

type Product = {
  id: string;
  name: string;
  productTypeCode: string;
  description: string | null;
  status: string;
  cooperativeId: string;
  createdAt: string;
};

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</p>
      <div className="mt-1 text-sm font-semibold text-gray-800">{value}</div>
    </div>
  );
}

export default async function InspectorProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let product: Product | null = null;
  try {
    product = await apiFetch<Product>(`/api/v1/products/${id}`);
  } catch {
    return <p className="text-red-600">Produit introuvable.</p>;
  }

  return (
    <div>
      <PageHeader title={product.name} subtitle={`Code type : ${product.productTypeCode}`} />

      <div className="mb-8 grid grid-cols-2 gap-4 rounded-lg border bg-white p-6 shadow-sm md:grid-cols-4">
        <Stat label="Statut" value={<StatusBadge status={product.status} />} />
        <Stat label="Type produit" value={product.productTypeCode} />
        <Stat label="Coopérative" value={product.cooperativeId.slice(0, 8) + '…'} />
        <Stat label="Enregistré le" value={new Date(product.createdAt).toLocaleDateString('fr-MA')} />
      </div>

      {product.description && (
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-400">
            Description
          </h2>
          <p className="text-sm text-gray-700">{product.description}</p>
        </div>
      )}
    </div>
  );
}

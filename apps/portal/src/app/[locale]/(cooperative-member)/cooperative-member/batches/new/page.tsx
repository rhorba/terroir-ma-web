import { getCooperativeId } from '@/lib/auth-utils';
import { apiFetch } from '@/lib/api-server';
import { PageHeader } from '@/components/admin/page-header';
import { CreateBatchForm } from './create-batch-form';

type Harvest = {
  id: string;
  productTypeCode: string;
  quantityKg: number;
  harvestDate: string;
  farmId: string;
};

type ProductType = { id: string; code: string; nameFr: string };
type ProductTypesResponse = { data: ProductType[] };

export default async function NewBatchPage() {
  const cooperativeId = await getCooperativeId();

  if (!cooperativeId) {
    return <p className="text-gray-500">Coopérative non configurée dans la session.</p>;
  }

  let harvests: Harvest[] = [];
  let productTypes: ProductType[] = [];

  try {
    const [harvestsData, ptRes] = await Promise.all([
      apiFetch<Harvest[]>(`/api/v1/harvests/cooperative/${cooperativeId}`),
      apiFetch<ProductTypesResponse>('/api/v1/product-types?limit=100'),
    ]);
    harvests     = Array.isArray(harvestsData) ? harvestsData : [];
    productTypes = ptRes.data ?? [];
  } catch {
    return (
      <p className="text-red-600">Impossible de charger les données. Backend indisponible.</p>
    );
  }

  return (
    <div>
      <PageHeader
        title="Créer un lot"
        subtitle="Regroupez des récoltes en un lot de production"
      />
      <div className="mt-6">
        <CreateBatchForm harvests={harvests} productTypes={productTypes} />
      </div>
    </div>
  );
}

import { getCooperativeId } from '@/lib/auth-utils';
import { apiFetch } from '@/lib/api-server';
import { PageHeader } from '@/components/admin/page-header';
import { LogHarvestForm } from './log-harvest-form';

type Farm = { id: string; name: string; regionCode: string };
type FarmsResponse = { data: Farm[] };
type ProductType = { id: string; code: string; nameFr: string };
type ProductTypesResponse = { data: ProductType[] };

export default async function NewHarvestPage() {
  const cooperativeId = await getCooperativeId();

  if (!cooperativeId) {
    return <p className="text-gray-500">Coopérative non configurée dans la session.</p>;
  }

  let farms: Farm[] = [];
  let productTypes: ProductType[] = [];

  try {
    const [farmsRes, ptRes] = await Promise.all([
      apiFetch<FarmsResponse>(`/api/v1/cooperatives/${cooperativeId}/farms?limit=100`),
      apiFetch<ProductTypesResponse>('/api/v1/product-types?limit=100'),
    ]);
    farms        = farmsRes.data  ?? [];
    productTypes = ptRes.data     ?? [];
  } catch {
    return (
      <p className="text-red-600">Impossible de charger les données. Backend indisponible.</p>
    );
  }

  return (
    <div>
      <PageHeader title="Saisir une récolte" subtitle="Enregistrez une nouvelle récolte" />
      <div className="mt-6">
        <LogHarvestForm farms={farms} productTypes={productTypes} />
      </div>
    </div>
  );
}

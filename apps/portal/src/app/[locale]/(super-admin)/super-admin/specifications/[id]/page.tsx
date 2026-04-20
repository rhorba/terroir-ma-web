import { apiFetch } from '@/lib/api-server';
import { PageHeader } from '@/components/admin/page-header';
import { StatusBadge } from '@/components/admin/status-badge';
import { updateProductType } from '../actions';
import { SpecActions } from './spec-actions';

type ProductType = {
  id: string;
  code: string;
  nameFr: string;
  nameAr: string;
  nameZgh?: string | null;
  certificationType: string;
  regionCode: string;
  isActive: boolean;
  validityDays?: number | null;
  hsCode?: string | null;
  onssaCategory?: string | null;
};

const inputCls =
  'w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500';

export default async function SpecDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await apiFetch<{ success: boolean; data: ProductType }>(
    `/api/v1/product-types/${id}`,
  );
  const s = res.data;

  const updateAction = updateProductType.bind(null, s.id);

  const editFields = [
    { name: 'nameFr', label: 'Nom FR', defaultValue: s.nameFr },
    { name: 'nameAr', label: 'Nom AR', defaultValue: s.nameAr },
    { name: 'nameZgh', label: 'Nom Amazigh', defaultValue: s.nameZgh ?? '' },
    { name: 'hsCode', label: 'Code HS', defaultValue: s.hsCode ?? '' },
    {
      name: 'validityDays',
      label: 'Validité (jours)',
      defaultValue: s.validityDays != null ? String(s.validityDays) : '',
    },
  ] as const;

  return (
    <div className="max-w-xl">
      <PageHeader
        title={s.nameFr}
        subtitle={`Code: ${s.code} · ${s.certificationType}`}
        action={s.isActive ? <SpecActions id={s.id} /> : undefined}
      />
      <div className="mb-6">
        <StatusBadge status={s.isActive ? 'active' : 'suspended'} />
      </div>

      <form action={updateAction} className="flex flex-col gap-4">
        {editFields.map(({ name, label, defaultValue }) => (
          <div key={name}>
            <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
            <input name={name} defaultValue={defaultValue} className={inputCls} />
          </div>
        ))}
        <div>
          <button
            type="submit"
            className="rounded bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
          >
            Enregistrer les modifications
          </button>
        </div>
      </form>
    </div>
  );
}

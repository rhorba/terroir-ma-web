import { apiFetch } from '@/lib/api-server';
import { PageHeader } from '@/components/admin/page-header';
import { StatusBadge } from '@/components/admin/status-badge';
import { VerifyCooperativeForm } from './verify-form';
import { RejectCooperativeForm } from './reject-form';

type Cooperative = {
  id: string;
  name: string;
  nameAr?: string | null;
  ice: string;
  ifNumber?: string | null;
  rcNumber?: string | null;
  email: string;
  phone: string;
  regionCode: string;
  city: string;
  presidentName: string;
  presidentCin: string;
  status: string;
  createdAt: string;
};

export default async function CooperativeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const c = await apiFetch<Cooperative>(`/api/v1/cooperatives/${id}`);

  const fields: [string, string | null | undefined][] = [
    ['ICE', c.ice],
    ['IF', c.ifNumber],
    ['RC', c.rcNumber],
    ['Email', c.email],
    ['Téléphone', c.phone],
    ['Région', c.regionCode],
    ['Ville', c.city],
    ['Président', c.presidentName],
    ['CIN Président', c.presidentCin],
  ];

  return (
    <div className="max-w-3xl">
      <PageHeader
        title={c.name}
        subtitle={c.nameAr ?? undefined}
        action={
          c.status === 'pending' ? (
            <div className="flex gap-2">
              <VerifyCooperativeForm id={c.id} />
              <RejectCooperativeForm id={c.id} />
            </div>
          ) : undefined
        }
      />
      <div className="mb-6">
        <StatusBadge status={c.status} />
      </div>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
        {fields.map(([label, value]) =>
          value ? (
            <div key={label}>
              <dt className="font-medium text-gray-500">{label}</dt>
              <dd className="mt-0.5 text-gray-900">{value}</dd>
            </div>
          ) : null,
        )}
      </dl>
    </div>
  );
}

import { apiFetch } from '@/lib/api-server';
import { PageHeader } from '@/components/admin/page-header';
import { StatusBadge } from '@/components/admin/status-badge';
import { LabActions } from './lab-actions';

type Lab = {
  id: string;
  name: string;
  onssaAccreditationNumber?: string | null;
  isAccredited: boolean;
  createdAt: string;
};

export default async function LabDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lab = await apiFetch<Lab>(`/api/v1/labs/${id}`);

  return (
    <div className="max-w-xl">
      <PageHeader
        title={lab.name}
        action={<LabActions id={lab.id} isAccredited={lab.isAccredited} />}
      />
      <div className="mb-6">
        <StatusBadge status={lab.isAccredited ? 'accredited' : 'pending'} />
      </div>
      <dl className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <dt className="font-medium text-gray-500">N° ONSSA</dt>
          <dd className="mt-0.5">{lab.onssaAccreditationNumber ?? '—'}</dd>
        </div>
        <div>
          <dt className="font-medium text-gray-500">Enregistré le</dt>
          <dd className="mt-0.5">{new Date(lab.createdAt).toLocaleDateString('fr-MA')}</dd>
        </div>
      </dl>
    </div>
  );
}

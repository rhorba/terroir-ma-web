import { apiFetch } from '@/lib/api-server';
import { PageHeader } from '@/components/admin/page-header';
import { StatusBadge } from '@/components/admin/status-badge';

type Batch = {
  id: string;
  batchNumber?: string;
  campaignYear: string;
  harvestDate: string;
  totalWeightKg: number;
  status: string;
  createdAt: string;
};

type ProcessingStep = {
  id: string;
  stepName: string;
  performedAt: string;
  notes: string | null;
  performedBy: string;
};

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</p>
      <div className="mt-1 text-sm font-semibold text-gray-800">{value}</div>
    </div>
  );
}

export default async function BatchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [batch, steps] = await Promise.all([
    apiFetch<Batch>(`/api/v1/batches/${id}`),
    apiFetch<ProcessingStep[]>(`/api/v1/batches/${id}/processing-steps`),
  ]);

  return (
    <div>
      <PageHeader
        title={`Lot ${batch.batchNumber ?? id.slice(0, 8)}`}
        subtitle={`Campagne ${batch.campaignYear}`}
      />

      <div className="mb-8 grid grid-cols-2 gap-4 rounded-lg border bg-white p-6 shadow-sm md:grid-cols-4">
        <Stat label="Statut" value={<StatusBadge status={batch.status} />} />
        <Stat label="Poids total" value={`${batch.totalWeightKg} kg`} />
        <Stat
          label="Date récolte"
          value={
            batch.harvestDate
              ? new Date(batch.harvestDate).toLocaleDateString('fr-MA')
              : '—'
          }
        />
        <Stat label="Créé le" value={new Date(batch.createdAt).toLocaleDateString('fr-MA')} />
      </div>

      <h2 className="mb-4 text-lg font-semibold">
        Étapes de traitement ({steps.length})
      </h2>

      {steps.length === 0 ? (
        <p className="text-gray-500">Aucune étape de traitement enregistrée.</p>
      ) : (
        <ol className="relative border-l border-green-200 pl-6">
          {steps.map((s, i) => (
            <li key={s.id} className="mb-6">
              <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-green-700 text-xs font-bold text-white">
                {i + 1}
              </span>
              <p className="font-medium">{s.stepName}</p>
              <p className="text-xs text-gray-500">
                {new Date(s.performedAt).toLocaleDateString('fr-MA')}
              </p>
              {s.notes && <p className="mt-1 text-sm text-gray-600">{s.notes}</p>}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

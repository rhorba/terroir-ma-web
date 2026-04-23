import { apiFetch } from '@/lib/api-server';
import { PageHeader } from '@/components/admin/page-header';
import { StatusBadge } from '@/components/admin/status-badge';

type Batch = {
  id: string;
  batchNumber?: string;
  campaignYear: string;
  totalQuantityKg: number;
  status: string;
  createdAt: string;
};

type ProcessingStep = {
  id: string;
  stepType: string;
  doneAt: string;
  notes: string | null;
};

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</p>
      <div className="mt-1 text-sm font-semibold text-gray-800">{value}</div>
    </div>
  );
}

export default async function InspectorBatchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let batch: Batch | null = null;
  let steps: ProcessingStep[] = [];

  try {
    [batch, steps] = await Promise.all([
      apiFetch<Batch>(`/api/v1/batches/${id}`),
      apiFetch<ProcessingStep[]>(`/api/v1/batches/${id}/processing-steps`),
    ]);
  } catch {
    return <p className="text-red-600">Lot introuvable.</p>;
  }

  return (
    <div>
      <PageHeader
        title={`Lot ${batch.batchNumber ?? id.slice(0, 8)}`}
        subtitle={`Campagne ${batch.campaignYear}`}
      />

      <div className="mb-8 grid grid-cols-2 gap-4 rounded-lg border bg-white p-6 shadow-sm md:grid-cols-4">
        <Stat label="Statut" value={<StatusBadge status={batch.status} />} />
        <Stat label="Poids total" value={`${batch.totalQuantityKg} kg`} />
        <Stat label="Campagne" value={batch.campaignYear} />
        <Stat label="Créé le" value={new Date(batch.createdAt).toLocaleDateString('fr-MA')} />
      </div>

      <h2 className="mb-4 text-lg font-semibold">
        Étapes de traitement ({steps.length})
      </h2>

      {steps.length === 0 ? (
        <p className="text-gray-500">Aucune étape enregistrée.</p>
      ) : (
        <ol className="relative border-l border-amber-200 pl-6">
          {steps.map((s, i) => (
            <li key={s.id} className="mb-6">
              <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-amber-700 text-xs font-bold text-white">
                {i + 1}
              </span>
              <p className="font-medium">{s.stepType}</p>
              <p className="text-xs text-gray-500">
                {new Date(s.doneAt).toLocaleDateString('fr-MA')}
              </p>
              {s.notes && <p className="mt-1 text-sm text-gray-600">{s.notes}</p>}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

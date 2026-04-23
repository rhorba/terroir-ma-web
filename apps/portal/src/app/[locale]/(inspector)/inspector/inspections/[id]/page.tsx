import { apiFetch } from '@/lib/api-server';
import { PageHeader } from '@/components/admin/page-header';
import { StatusBadge } from '@/components/admin/status-badge';
import Link from 'next/link';
import { ReportForm } from './report-form';

type Inspection = {
  id: string;
  certificationId: string;
  status: string;
  scheduledDate: string;
  farmIds: string[];
  passed: boolean | null;
  reportSummary: string | null;
  detailedObservations: string | null;
  nonConformities: string | null;
  inspectorName: string | null;
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

export default async function InspectionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let inspection: Inspection | null = null;
  try {
    inspection = await apiFetch<Inspection>(`/api/v1/inspections/${id}`);
  } catch {
    return <p className="text-red-600">Inspection introuvable.</p>;
  }

  const canReport = inspection.status === 'SCHEDULED' || inspection.status === 'IN_PROGRESS';

  return (
    <div>
      <PageHeader
        title={`Inspection — ${id.slice(0, 8)}…`}
        subtitle={`Certification: ${inspection.certificationId.slice(0, 8)}…`}
      />

      <div className="mb-8 grid grid-cols-2 gap-4 rounded-lg border bg-white p-6 shadow-sm md:grid-cols-4">
        <Stat label="Statut" value={<StatusBadge status={inspection.status} />} />
        <Stat label="Date planifiée" value={new Date(inspection.scheduledDate).toLocaleDateString('fr-MA')} />
        <Stat label="Inspecteur" value={inspection.inspectorName ?? '—'} />
        <Stat
          label="Résultat"
          value={
            inspection.passed === null ? '—' : inspection.passed ? '✅ Conforme' : '❌ Non conforme'
          }
        />
      </div>

      {inspection.farmIds.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-2 text-lg font-semibold">Fermes inspectées ({inspection.farmIds.length})</h2>
          <ul className="flex flex-wrap gap-2">
            {inspection.farmIds.map((fid) => (
              <li key={fid} className="rounded bg-amber-50 px-3 py-1 font-mono text-xs text-amber-800">
                {fid.slice(0, 8)}…
              </li>
            ))}
          </ul>
        </div>
      )}

      {inspection.reportSummary && (
        <div className="mb-8 rounded-lg border bg-green-50 p-6">
          <h2 className="mb-3 text-lg font-semibold">Rapport déposé</h2>
          <p className="text-sm font-medium text-gray-700">{inspection.reportSummary}</p>
          {inspection.detailedObservations && (
            <p className="mt-3 whitespace-pre-line text-sm text-gray-600">
              {inspection.detailedObservations}
            </p>
          )}
          {inspection.nonConformities && (
            <p className="mt-3 text-sm text-red-700">
              <span className="font-semibold">Non-conformités : </span>
              {inspection.nonConformities}
            </p>
          )}
        </div>
      )}

      <div className="mb-6">
        <Link
          href={`/fr/inspector/certifications/${inspection.certificationId}`}
          className="text-sm text-amber-700 hover:underline"
        >
          Voir la certification liée →
        </Link>
      </div>

      {canReport && <ReportForm inspectionId={inspection.id} />}
    </div>
  );
}

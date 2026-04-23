import { apiFetch } from '@/lib/api-server';
import { PageHeader } from '@/components/admin/page-header';
import { StatusBadge } from '@/components/admin/status-badge';
import Link from 'next/link';
import { GrantForm } from './grant-form';
import { DenyForm } from './deny-form';
import { ActionButtons } from './action-buttons';

type Certification = {
  id: string;
  certificationNumber: string | null;
  cooperativeName: string;
  productTypeCode: string;
  certificationType: string;
  regionCode: string;
  currentStatus: string;
  requestedAt: string;
  grantedAt: string | null;
  validFrom: string | null;
  validUntil: string | null;
  deniedAt: string | null;
  denialReason: string | null;
  revokedAt: string | null;
  revocationReason: string | null;
};

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</p>
      <div className="mt-1 text-sm font-semibold text-gray-800">{value}</div>
    </div>
  );
}

const GRANTED_STATUSES = ['GRANTED', 'RENEWED'];

export default async function CertificationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let cert: Certification | null = null;
  try {
    cert = await apiFetch<Certification>(`/api/v1/certifications/${id}`);
  } catch {
    return <p className="text-red-600">Certification introuvable ou backend indisponible.</p>;
  }

  if (!cert) return <p className="text-red-600">Certification introuvable.</p>;

  const isGranted = GRANTED_STATUSES.includes(cert.currentStatus);

  return (
    <div>
      <div className="mb-4">
        <Link
          href="/fr/certification-body/certifications"
          className="text-sm text-purple-700 hover:underline"
        >
          ← Retour à la liste
        </Link>
      </div>

      <PageHeader
        title={cert.certificationNumber ?? `Certification — ${id.slice(0, 8)}…`}
        subtitle={`${cert.cooperativeName} · ${cert.productTypeCode}`}
      />

      {/* Stat cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 rounded-lg border bg-white p-6 shadow-sm md:grid-cols-4">
        <Stat label="Statut"      value={<StatusBadge status={cert.currentStatus} />} />
        <Stat label="Type"        value={cert.certificationType} />
        <Stat label="Région"      value={cert.regionCode} />
        <Stat label="Coopérative" value={cert.cooperativeName} />
      </div>

      {/* Dates */}
      <div className="mb-6 grid grid-cols-2 gap-4 rounded-lg border bg-white p-6 shadow-sm md:grid-cols-4">
        <Stat label="Déposé le"        value={new Date(cert.requestedAt).toLocaleDateString('fr-MA')} />
        <Stat label="Accordé le"       value={cert.grantedAt ? new Date(cert.grantedAt).toLocaleDateString('fr-MA') : '—'} />
        <Stat label="Valide du"        value={cert.validFrom ?? '—'} />
        <Stat label="Valide jusqu'au"  value={cert.validUntil ?? '—'} />
      </div>

      {/* Denial info */}
      {cert.currentStatus === 'DENIED' && cert.denialReason && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-6">
          <h2 className="mb-2 text-base font-semibold text-red-800">Motif de refus</h2>
          <p className="text-sm text-red-700">{cert.denialReason}</p>
        </div>
      )}

      {/* Revocation info */}
      {cert.currentStatus === 'REVOKED' && cert.revocationReason && (
        <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-6">
          <h2 className="mb-2 text-base font-semibold text-gray-800">Motif de révocation</h2>
          <p className="text-sm text-gray-700">{cert.revocationReason}</p>
        </div>
      )}

      {/* Certificate section — GRANTED or RENEWED only */}
      {isGranted && cert.certificationNumber && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-6">
          <h2 className="mb-3 text-base font-semibold text-green-800">Certificat émis</h2>
          <p className="mb-1 font-mono text-sm font-bold text-green-900">{cert.certificationNumber}</p>
          <p className="mb-4 text-sm text-green-700">
            Valable du {cert.validFrom} au {cert.validUntil}
          </p>
          <a
            href={`/api/v1/certifications/${id}/certificate.pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
          >
            Télécharger le certificat PDF →
          </a>
        </div>
      )}

      {/* Action section — conditional by status */}
      <div className="space-y-6">
        {cert.currentStatus === 'UNDER_REVIEW' && (
          <>
            <GrantForm certificationId={id} />
            <DenyForm certificationId={id} />
          </>
        )}
        <ActionButtons certificationId={id} currentStatus={cert.currentStatus} />
      </div>
    </div>
  );
}

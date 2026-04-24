import { apiFetch } from '@/lib/api-server';
import { PageHeader } from '@/components/admin/page-header';
import { StatusBadge } from '@/components/admin/status-badge';
import { ValidateForm } from './validate-form';
import Link from 'next/link';

type ExportDocument = {
  id: string;
  certificationId: string;
  cooperativeId: string;
  destinationCountry: string;
  hsCode: string;
  onssaReference: string | null;
  quantityKg: number;
  consigneeName: string;
  consigneeCountry: string;
  status: string;
  validUntil: string | null;
  documentUrl: string | null;
  requestedBy: string;
  createdAt: string;
  updatedAt: string;
};

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</p>
      <div className="mt-1 text-sm font-semibold text-gray-800">{value}</div>
    </div>
  );
}

export default async function ExportDocumentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let doc: ExportDocument | null = null;
  try {
    doc = await apiFetch<ExportDocument>(`/api/v1/export-documents/${id}`);
  } catch {
    return <p className="text-red-600">Document introuvable ou backend indisponible.</p>;
  }

  if (!doc) return <p className="text-red-600">Document introuvable.</p>;

  return (
    <div>
      <div className="mb-4">
        <Link
          href="../export-documents"
          className="text-sm text-slate-700 hover:underline"
        >
          ← Retour à la liste
        </Link>
      </div>

      <PageHeader
        title={`Document d'export — ${id.slice(0, 8)}…`}
        subtitle={`${doc.consigneeName} · ${doc.destinationCountry}`}
      />

      {/* Identity */}
      <div className="mb-6 grid grid-cols-2 gap-4 rounded-lg border bg-white p-6 shadow-sm md:grid-cols-4">
        <Stat label="Statut"            value={<StatusBadge status={doc.status} />} />
        <Stat label="Destinataire"      value={doc.consigneeName} />
        <Stat label="Pays destination"  value={doc.destinationCountry} />
        <Stat label="Pays consignataire" value={doc.consigneeCountry} />
      </div>

      {/* Customs details */}
      <div className="mb-6 grid grid-cols-2 gap-4 rounded-lg border bg-white p-6 shadow-sm md:grid-cols-4">
        <Stat label="Code HS"         value={<span className="font-mono">{doc.hsCode}</span>} />
        <Stat label="Quantité (kg)"   value={Number(doc.quantityKg).toLocaleString('fr-MA')} />
        <Stat label="Réf. ONSSA"      value={doc.onssaReference ?? '—'} />
        <Stat label="Valide jusqu&apos;au" value={doc.validUntil ?? '—'} />
      </div>

      {/* PDF download */}
      <div className="mb-6 rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="mb-3 text-base font-semibold text-gray-800">Certificat d&apos;export</h2>
        <a
          href={`/api/v1/export-documents/${id}/certificate.pdf`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center rounded border px-3 py-2 text-sm font-medium text-slate-700 hover:bg-gray-50"
        >
          Télécharger le PDF →
        </a>
      </div>

      {/* Validate action — only when status is submitted */}
      {doc.status === 'submitted' && <ValidateForm docId={id} />}

      {doc.status === 'approved' && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-6">
          <p className="font-semibold text-green-800">
            Ce document a déjà été validé (dédouanement accordé).
          </p>
        </div>
      )}
    </div>
  );
}

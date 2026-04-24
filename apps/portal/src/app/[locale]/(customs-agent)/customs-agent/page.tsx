import { apiFetch } from '@/lib/api-server';
import { PageHeader } from '@/components/admin/page-header';
import Link from 'next/link';

type ExportDocument = {
  id: string;
  status: string;
};

type PagedResult = {
  data: ExportDocument[];
  meta: { page: number; limit: number; total: number };
};

export default async function CustomsAgentDashboard() {
  let total = 0;
  let submittedCount = 0;
  let approvedCount = 0;

  try {
    const result = await apiFetch<PagedResult>(
      '/api/v1/export-documents?page=1&limit=100',
    );
    total = result.meta.total;
    submittedCount = result.data.filter((d) => d.status === 'submitted').length;
    approvedCount = result.data.filter((d) => d.status === 'approved').length;
  } catch {
    // Backend unavailable — show zeros
  }

  const stats: { label: string; value: number; colorClass: string }[] = [
    { label: 'Total documents', value: total, colorClass: 'border-blue-200 text-blue-700' },
    { label: 'En attente de validation', value: submittedCount, colorClass: 'border-yellow-200 text-yellow-700' },
    { label: 'Validés', value: approvedCount, colorClass: 'border-green-200 text-green-700' },
  ];

  return (
    <div>
      <PageHeader
        title="Tableau de bord — Douanes"
        subtitle="Documents d'exportation ONSSA"
      />

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, colorClass }) => (
          <div key={label} className={`rounded-lg border bg-white p-6 shadow-sm ${colorClass}`}>
            <p className="text-sm text-gray-500">{label}</p>
            <p className={`mt-2 text-3xl font-bold`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <Link
          href="customs-agent/export-documents"
          className="inline-flex items-center rounded bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          Voir tous les documents →
        </Link>
      </div>
    </div>
  );
}

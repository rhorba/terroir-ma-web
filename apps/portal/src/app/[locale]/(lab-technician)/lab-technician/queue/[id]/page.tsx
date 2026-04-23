import { apiFetch } from '@/lib/api-server';
import { PageHeader } from '@/components/admin/page-header';
import { StatusBadge } from '@/components/admin/status-badge';
import { ResultForm } from './result-form';
import { UploadForm } from './upload-form';

type LabTest = {
  id: string;
  batchId: string;
  productTypeCode: string;
  laboratoryId: string | null;
  status: string;
  submittedAt: string;
  expectedResultDate: string | null;
  reportFileName: string | null;
};

type LabTestResult = {
  id: string;
  passed: boolean;
  testValues: Record<string, number | string>;
  failedParameters: string[];
  technicianName: string;
  laboratoryName: string | null;
  completedAt: string;
};

type LabTestParameter = {
  name: string;
  unit: string;
  minValue?: number;
  maxValue?: number;
  type?: string;
  values?: string[];
};

type ProductTypesResponse = {
  data: { id: string; code: string; nameFr: string; labTestParameters: LabTestParameter[] }[];
};

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</p>
      <div className="mt-1 text-sm font-semibold text-gray-800">{value}</div>
    </div>
  );
}

export default async function LabTestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let labTest: LabTest | null = null;
  let result: LabTestResult | null = null;
  let parameters: LabTestParameter[] = [];

  try {
    [labTest, result] = await Promise.all([
      apiFetch<LabTest>(`/api/v1/lab-tests/${id}`),
      apiFetch<LabTestResult>(`/api/v1/lab-tests/${id}/result`).catch(() => null),
    ]);

    if (labTest) {
      const ptRes = await apiFetch<ProductTypesResponse>('/api/v1/product-types?limit=100');
      const productType = ptRes.data.find((pt) => pt.code === labTest!.productTypeCode);
      parameters = productType?.labTestParameters ?? [];
    }
  } catch {
    return <p className="text-red-600">Test introuvable ou backend indisponible.</p>;
  }

  if (!labTest) return <p className="text-red-600">Test introuvable.</p>;

  const canSubmitResult = labTest.status === 'submitted' || labTest.status === 'in_progress';

  return (
    <div>
      <PageHeader
        title={`Test — ${id.slice(0, 8)}…`}
        subtitle={`Lot : ${labTest.batchId.slice(0, 8)}… · Type : ${labTest.productTypeCode}`}
      />

      <div className="mb-8 grid grid-cols-2 gap-4 rounded-lg border bg-white p-6 shadow-sm md:grid-cols-4">
        <Stat label="Statut" value={<StatusBadge status={labTest.status} />} />
        <Stat label="Soumis le" value={new Date(labTest.submittedAt).toLocaleDateString('fr-MA')} />
        <Stat label="Résultat attendu" value={labTest.expectedResultDate ?? '—'} />
        <Stat label="Rapport PDF" value={labTest.reportFileName ?? '—'} />
      </div>

      {parameters.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-3 text-lg font-semibold">Paramètres requis ({parameters.length})</h2>
          <div className="overflow-x-auto rounded-lg border bg-white shadow-sm">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Paramètre</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Unité</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Min</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Max</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Valeurs acceptées</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {parameters.map((p) => (
                  <tr key={p.name} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{p.name}</td>
                    <td className="px-4 py-3 text-gray-500">{p.unit}</td>
                    <td className="px-4 py-3">{p.minValue ?? '—'}</td>
                    <td className="px-4 py-3">{p.maxValue ?? '—'}</td>
                    <td className="px-4 py-3">{p.values?.join(', ') ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {result && (
        <div className="mb-8 rounded-lg border bg-green-50 p-6">
          <h2 className="mb-3 text-lg font-semibold">Résultat enregistré</h2>
          <div className="mb-3 flex items-center gap-3">
            <span className={`font-bold ${result.passed ? 'text-green-700' : 'text-red-700'}`}>
              {result.passed ? '✅ Conforme' : '❌ Non conforme'}
            </span>
            <span className="text-sm text-gray-500">
              par {result.technicianName} — {new Date(result.completedAt).toLocaleDateString('fr-MA')}
            </span>
          </div>
          {result.failedParameters.length > 0 && (
            <p className="text-sm text-red-700">
              <span className="font-semibold">Paramètres échoués : </span>
              {result.failedParameters.join(', ')}
            </p>
          )}
          <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-3">
            {Object.entries(result.testValues).map(([k, v]) => (
              <div key={k} className="rounded bg-white px-3 py-2 text-sm">
                <span className="font-medium">{k}:</span>{' '}
                <span className="text-gray-700">{String(v)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {canSubmitResult && !result && (
        <ResultForm labTestId={id} parameters={parameters} />
      )}

      {!labTest.reportFileName && (
        <UploadForm labTestId={id} />
      )}
    </div>
  );
}

import { apiFetch } from '@/lib/api-server';

type PagedLabTests = {
  success: boolean;
  data: { status: string }[];
  meta: { total: number };
};

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className={`rounded-lg border p-6 shadow-sm ${color}`}>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-gray-800">{value}</p>
    </div>
  );
}

export default async function LabTechnicianDashboard() {
  let result: PagedLabTests = { success: true, data: [], meta: { total: 0 } };
  try {
    result = await apiFetch<PagedLabTests>('/api/v1/lab-tests?page=1&limit=100');
  } catch {
    // backend unavailable in dev
  }

  const all = result.data;
  const submitted = all.filter((t) => t.status === 'submitted').length;
  const inProgress = all.filter((t) => t.status === 'in_progress').length;
  const completed = all.filter((t) => t.status === 'completed').length;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Tableau de bord — Laborantin</h1>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Total" value={result.meta.total} color="bg-white" />
        <StatCard label="Soumis" value={submitted} color="bg-yellow-50" />
        <StatCard label="En cours" value={inProgress} color="bg-blue-50" />
        <StatCard label="Complétés" value={completed} color="bg-green-50" />
      </div>
    </div>
  );
}

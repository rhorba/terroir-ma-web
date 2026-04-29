import { apiFetch } from '@/lib/api-server';

type PagedInspections = {
  data: { status: string }[];
  total: number;
};

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className={`rounded-lg border p-6 shadow-sm ${color}`}>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-gray-800">{value}</p>
    </div>
  );
}

export default async function InspectorDashboard() {
  let inspections: PagedInspections = { data: [], total: 0 };
  try {
    inspections = await apiFetch<PagedInspections>('/api/v1/inspections/my?page=1&limit=100');
  } catch {
    // API unavailable in dev without backend
  }

  const all = inspections.data;
  const scheduled = all.filter((i) => i.status === 'SCHEDULED').length;
  const inProgress = all.filter((i) => i.status === 'IN_PROGRESS').length;
  const completed = all.filter((i) => i.status === 'COMPLETED').length;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Tableau de bord — Inspecteur</h1>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Total" value={inspections.total} color="bg-white" />
        <StatCard label="Planifiées" value={scheduled} color="bg-amber-50" />
        <StatCard label="En cours" value={inProgress} color="bg-blue-50" />
        <StatCard label="Terminées" value={completed} color="bg-green-50" />
      </div>
    </div>
  );
}

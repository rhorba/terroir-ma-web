import { apiFetch } from '@/lib/api-server';

type Dashboard = {
  cooperatives: { total: number; pending: number; active: number; suspended: number };
  certifications: { granted: number; pending: number; denied: number; revoked: number };
  labTests: { passed: number; failed: number };
  notifications: { sent: number; failed: number };
};

export default async function SuperAdminHome() {
  let dash: Dashboard | null = null;
  try {
    dash = await apiFetch<Dashboard>('/api/v1/admin/dashboard');
  } catch {
    // backend offline — degrade gracefully
  }

  const cards = dash
    ? [
        {
          label: 'Coopératives en attente',
          value: dash.cooperatives.pending,
          color: 'bg-yellow-50 border-yellow-200',
        },
        {
          label: 'Coopératives actives',
          value: dash.cooperatives.active,
          color: 'bg-green-50 border-green-200',
        },
        {
          label: 'Certifications accordées',
          value: dash.certifications.granted,
          color: 'bg-blue-50 border-blue-200',
        },
        {
          label: 'Certifications en attente',
          value: dash.certifications.pending,
          color: 'bg-purple-50 border-purple-200',
        },
      ]
    : [];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Tableau de bord</h1>
      {cards.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {cards.map((c) => (
            <div key={c.label} className={`rounded-lg border p-4 ${c.color}`}>
              <p className="text-2xl font-bold text-gray-900">{c.value}</p>
              <p className="mt-1 text-sm text-gray-600">{c.label}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">
          Données de tableau de bord indisponibles (backend hors ligne).
        </p>
      )}
    </div>
  );
}

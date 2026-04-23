import { apiFetch } from '@/lib/api-server';
import { PageHeader } from '@/components/admin/page-header';

type PendingMeta = { meta: { total: number } };
type RegionRow = { granted: number; denied: number; revoked: number; total: number };
type Analytics = { data: { byRegion: RegionRow[] } };

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

export default async function CertificationBodyHome() {
  let pending = 0;
  let granted = 0;
  let denied = 0;
  let revoked = 0;

  try {
    const [pendingRes, analyticsRes] = await Promise.all([
      apiFetch<PendingMeta>('/api/v1/certifications/pending?page=1&limit=1'),
      apiFetch<Analytics>('/api/v1/certifications/analytics'),
    ]);
    pending = pendingRes.meta?.total ?? 0;
    const regions: RegionRow[] = analyticsRes.data?.byRegion ?? [];
    granted = regions.reduce((s, r) => s + (r.granted ?? 0), 0);
    denied  = regions.reduce((s, r) => s + (r.denied  ?? 0), 0);
    revoked = regions.reduce((s, r) => s + (r.revoked ?? 0), 0);
  } catch {
    // backend offline during dev — show zeros
  }

  return (
    <div>
      <PageHeader
        title="Tableau de bord"
        subtitle="Organisme de Certification — Terroir.ma"
      />
      <div className="mt-6 grid grid-cols-2 gap-6 md:grid-cols-4">
        <StatCard label="En attente"  value={pending} color="text-purple-700" />
        <StatCard label="Accordées"   value={granted} color="text-green-700"  />
        <StatCard label="Refusées"    value={denied}  color="text-red-700"    />
        <StatCard label="Révoquées"   value={revoked} color="text-gray-700"   />
      </div>
    </div>
  );
}

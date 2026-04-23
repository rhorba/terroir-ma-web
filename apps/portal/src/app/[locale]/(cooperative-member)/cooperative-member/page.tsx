import { apiFetch } from '@/lib/api-server';
import { getCooperativeId } from '@/lib/auth-utils';
import { PageHeader } from '@/components/admin/page-header';
import Link from 'next/link';

function StatCard({
  label,
  value,
  href,
  color,
}: {
  label: string;
  value: number;
  href: string;
  color: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-lg border bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
    >
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${color}`}>{value}</p>
      <p className="mt-1 text-xs text-gray-400">Voir →</p>
    </Link>
  );
}

export default async function CooperativeMemberHome() {
  const cooperativeId = await getCooperativeId();

  let harvestCount = 0;
  let batchCount = 0;

  if (cooperativeId) {
    try {
      const [harvests, batches] = await Promise.all([
        apiFetch<unknown[]>(`/api/v1/harvests/cooperative/${cooperativeId}`),
        apiFetch<unknown[]>(`/api/v1/batches/cooperative/${cooperativeId}`),
      ]);
      harvestCount = Array.isArray(harvests) ? harvests.length : 0;
      batchCount   = Array.isArray(batches)  ? batches.length  : 0;
    } catch {
      // backend offline — show zeros
    }
  }

  return (
    <div>
      <PageHeader title="Mon espace" subtitle="Membre coopérative — Terroir.ma" />
      <div className="mt-6 grid grid-cols-2 gap-6">
        <StatCard
          label="Mes récoltes"
          value={harvestCount}
          href="/fr/cooperative-member/harvests"
          color="text-green-700"
        />
        <StatCard
          label="Mes lots"
          value={batchCount}
          href="/fr/cooperative-member/batches"
          color="text-emerald-700"
        />
      </div>
    </div>
  );
}

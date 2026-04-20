import { apiFetch } from '@/lib/api-server';
import { getCooperativeId } from '@/lib/auth-utils';

async function safeCount(url: string): Promise<number> {
  try {
    const r = await apiFetch<unknown>(url);
    if (Array.isArray(r)) return r.length;
    if (r !== null && typeof r === 'object') {
      const obj = r as Record<string, unknown>;
      if ('meta' in obj && typeof obj.meta === 'object' && obj.meta !== null) {
        return Number((obj.meta as Record<string, unknown>).total ?? 0);
      }
      if ('total' in obj) return Number(obj.total);
    }
    return 0;
  } catch {
    return 0;
  }
}

export default async function CooperativeAdminHome() {
  const cooperativeId = await getCooperativeId();

  const [membersCount, farmsCount, productsCount, batchesCount] = cooperativeId
    ? await Promise.all([
        safeCount(`/api/v1/cooperatives/${cooperativeId}/members?limit=1`),
        safeCount(`/api/v1/cooperatives/${cooperativeId}/farms?limit=1`),
        apiFetch<unknown[]>(`/api/v1/products/cooperative/${cooperativeId}`)
          .then((d) => (Array.isArray(d) ? d.length : 0))
          .catch(() => 0),
        apiFetch<unknown[]>(`/api/v1/batches/cooperative/${cooperativeId}`)
          .then((d) => (Array.isArray(d) ? d.length : 0))
          .catch(() => 0),
      ])
    : [0, 0, 0, 0];

  const cards = [
    { label: 'Membres', count: membersCount, href: '/fr/cooperative-admin/members' },
    { label: 'Fermes', count: farmsCount, href: '/fr/cooperative-admin/farms' },
    { label: 'Produits', count: productsCount, href: '/fr/cooperative-admin/products' },
    { label: 'Lots', count: batchesCount, href: '/fr/cooperative-admin/batches' },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Tableau de bord — Coopérative</h1>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {cards.map((c) => (
          <a
            key={c.label}
            href={c.href}
            className="rounded-lg border bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <p className="text-3xl font-bold text-green-700">{c.count}</p>
            <p className="mt-1 text-sm text-gray-500">{c.label}</p>
          </a>
        ))}
      </div>
    </div>
  );
}


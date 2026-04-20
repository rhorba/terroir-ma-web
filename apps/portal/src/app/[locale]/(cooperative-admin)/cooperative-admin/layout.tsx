import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

const NAV = [
  { href: '/fr/cooperative-admin', label: 'Tableau de bord' },
  { href: '/fr/cooperative-admin/members', label: 'Membres' },
  { href: '/fr/cooperative-admin/farms', label: 'Fermes' },
  { href: '/fr/cooperative-admin/products', label: 'Produits' },
  { href: '/fr/cooperative-admin/batches', label: 'Lots de production' },
];

export default async function CooperativeAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect('/fr/login');

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 shrink-0 bg-green-900 p-4 text-white">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-green-400">
          Admin Coopérative
        </p>
        <p className="mb-6 truncate text-sm text-green-200">
          {session.user?.name ?? session.user?.email}
        </p>
        <nav className="flex flex-col gap-1">
          {NAV.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="rounded px-3 py-2 text-sm hover:bg-green-700"
            >
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}

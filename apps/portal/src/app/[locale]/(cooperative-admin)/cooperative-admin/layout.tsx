import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function CooperativeAdminLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const session = await auth();
  if (!session) redirect(`/${locale}/login`);

  const NAV = [
    { href: `/${locale}/cooperative-admin`, label: 'Tableau de bord' },
    { href: `/${locale}/cooperative-admin/members`, label: 'Membres' },
    { href: `/${locale}/cooperative-admin/farms`, label: 'Fermes' },
    { href: `/${locale}/cooperative-admin/products`, label: 'Produits' },
    { href: `/${locale}/cooperative-admin/batches`, label: 'Lots de production' },
  ];

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

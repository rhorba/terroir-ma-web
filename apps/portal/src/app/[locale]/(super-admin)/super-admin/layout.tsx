import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function SuperAdminLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const session = await auth();
  if (!session) redirect(`/${locale}/login`);

  const NAV = [
    { href: `/${locale}/super-admin/cooperatives`, label: 'Coopératives' },
    { href: `/${locale}/super-admin/labs`, label: 'Laboratoires' },
    { href: `/${locale}/super-admin/specifications`, label: 'Spécifications SDOQ' },
    { href: `/${locale}/super-admin/settings`, label: 'Paramètres' },
    { href: `/${locale}/super-admin/settings/audit-log`, label: "Journal d'audit" },
  ];

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 shrink-0 bg-gray-900 p-4 text-white">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Super Admin
        </p>
        <p className="mb-6 truncate text-sm text-gray-300">
          {session.user?.name ?? session.user?.email}
        </p>
        <nav className="flex flex-col gap-1">
          {NAV.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="rounded px-3 py-2 text-sm hover:bg-gray-700 hover:text-green-400"
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

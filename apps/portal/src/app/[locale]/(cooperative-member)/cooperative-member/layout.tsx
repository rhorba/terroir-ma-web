import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

const NAV = [
  { href: '/fr/cooperative-member', label: 'Mon espace' },
  { href: '/fr/cooperative-member/harvests', label: 'Mes Récoltes' },
  { href: '/fr/cooperative-member/batches', label: 'Mes Lots' },
];

export default async function CooperativeMemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect('/fr/login');

  return (
    <div className="flex min-h-screen">
      <aside className="w-56 shrink-0 bg-green-800 p-4 text-white">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-green-300">
          Membre
        </p>
        <p className="mb-6 truncate text-sm text-green-100">
          {session.user?.name ?? session.user?.email}
        </p>
        <nav className="flex flex-col gap-1">
          {NAV.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="rounded px-3 py-2 text-sm hover:bg-green-600"
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

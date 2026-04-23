import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

const NAV = [
  { href: '/fr/lab-technician', label: 'Tableau de bord' },
  { href: '/fr/lab-technician/queue', label: "File d'attente" },
  { href: '/fr/lab-technician/submit', label: 'Soumettre un test' },
];

export default async function LabTechnicianLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect('/fr/login');

  return (
    <div className="flex min-h-screen">
      <aside className="w-56 shrink-0 bg-blue-900 p-4 text-white">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-blue-300">
          Laborantin
        </p>
        <p className="mb-6 truncate text-sm text-blue-100">
          {session.user?.name ?? session.user?.email}
        </p>
        <nav className="flex flex-col gap-1">
          {NAV.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="rounded px-3 py-2 text-sm hover:bg-blue-700"
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

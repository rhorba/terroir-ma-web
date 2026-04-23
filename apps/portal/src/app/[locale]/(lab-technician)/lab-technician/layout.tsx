import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function LabTechnicianLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const session = await auth();
  if (!session) redirect(`/${locale}/login`);

  const NAV = [
    { href: `/${locale}/lab-technician`, label: 'Tableau de bord' },
    { href: `/${locale}/lab-technician/queue`, label: "File d'attente" },
    { href: `/${locale}/lab-technician/submit`, label: 'Soumettre un test' },
  ];

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

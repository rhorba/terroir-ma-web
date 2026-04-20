import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

const NAV = [
  { href: '/fr/certification-body/certifications', label: 'Certifications' },
  { href: '/fr/certification-body/qrcodes', label: 'QR Codes' },
  { href: '/fr/certification-body/export-documents', label: "Documents d'export" },
];

export default async function CertificationBodyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect('/fr/login');

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 shrink-0 bg-purple-900 p-4 text-white">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-purple-300">
          Organisme Certif.
        </p>
        <p className="mb-6 truncate text-sm text-purple-100">
          {session.user?.name ?? session.user?.email}
        </p>
        <nav className="flex flex-col gap-1">
          {NAV.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="rounded px-3 py-2 text-sm hover:bg-purple-700"
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

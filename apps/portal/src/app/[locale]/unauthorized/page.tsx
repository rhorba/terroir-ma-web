import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

export default async function UnauthorizedPage() {
  const t = await getTranslations('auth');

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="text-6xl font-bold text-red-500">403</span>
        <h1 className="text-xl font-semibold text-gray-800">
          {t('unauthorized')}
        </h1>
        <p className="text-sm text-gray-500">{t('unauthorized_desc')}</p>
        <Link
          href="/fr"
          className="mt-2 text-sm text-green-700 underline hover:text-green-900"
        >
          {t('backHome')}
        </Link>
      </div>
    </main>
  );
}

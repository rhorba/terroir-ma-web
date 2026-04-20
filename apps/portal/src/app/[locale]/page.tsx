import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('auth');
  return (
    <main className="flex min-h-screen items-center justify-center">
      <h1 className="text-2xl font-bold">Terroir.ma Portal — {t('login')}</h1>
    </main>
  );
}

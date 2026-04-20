import { signIn } from '@/auth';
import { getTranslations } from 'next-intl/server';

export default async function LoginPage() {
  const t = await getTranslations('auth');

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-6 rounded-lg border bg-white p-10 shadow-sm">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-2xl font-bold text-gray-900">Terroir.ma</h1>
          <p className="text-sm text-gray-500">
            Plateforme de certification — Law 25-06 SDOQ
          </p>
        </div>
        <form
          action={async () => {
            'use server';
            await signIn('keycloak');
          }}
        >
          <button
            type="submit"
            className="rounded-md bg-green-700 px-8 py-2.5 text-sm font-semibold text-white hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-600"
          >
            {t('login')}
          </button>
        </form>
      </div>
    </main>
  );
}

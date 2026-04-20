import { getTranslations } from 'next-intl/server';

interface VerifyPageProps {
  params: { uuid: string; locale: string };
}

interface CertificationVerification {
  certificationNumber?: string;
  cooperativeName?: string;
  productType?: string;
  region?: string;
}

async function fetchCertification(uuid: string): Promise<CertificationVerification | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';
  try {
    const res = await fetch(`${apiUrl}/verify/${uuid}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const body = await res.json();
    return (body?.data as CertificationVerification) ?? null;
  } catch {
    return null;
  }
}

export default async function VerifyPage({ params }: VerifyPageProps) {
  const t = await getTranslations('verify');
  const cert = await fetchCertification(params.uuid);

  if (!cert) {
    return (
      <main className="flex min-h-screen items-center justify-center p-8">
        <div className="max-w-md rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <h1 className="text-xl font-bold text-red-700">{t('not_found')}</h1>
          <p className="mt-2 text-red-600">{t('not_found_desc')}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <div className="max-w-md rounded-lg border border-green-200 bg-green-50 p-6">
        <h1 className="text-xl font-bold text-green-800">{t('title')}</h1>
        <dl className="mt-4 space-y-2 text-sm">
          <div>
            <dt className="font-medium text-gray-600">{t('cert_number')}</dt>
            <dd className="text-gray-900">{cert.certificationNumber ?? '—'}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-600">{t('cooperative')}</dt>
            <dd className="text-gray-900">{cert.cooperativeName ?? '—'}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-600">{t('product_type')}</dt>
            <dd className="text-gray-900">{cert.productType ?? '—'}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-600">{t('region')}</dt>
            <dd className="text-gray-900">{cert.region ?? '—'}</dd>
          </div>
        </dl>
      </div>
    </main>
  );
}

import { getTranslations } from 'next-intl/server';
import { fetchVerification, type CertificationStatus } from '@/lib/api-public';

interface VerifyPageProps {
  params: { uuid: string; locale: string };
}

function statusColor(status: CertificationStatus): string {
  if (status === 'GRANTED' || status === 'RENEWED') return 'bg-green-100 text-green-800';
  if (status === 'REVOKED' || status === 'DENIED') return 'bg-red-100 text-red-800';
  return 'bg-amber-100 text-amber-800';
}

export default async function VerifyPage({ params }: VerifyPageProps) {
  const t = await getTranslations('verify');
  const data = await fetchVerification(params.uuid, params.locale);
  const cert = data?.certification ?? null;

  if (!data || !cert) {
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
      <div className="max-w-md rounded-lg border border-green-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-bold text-green-800">{t('title')}</h1>

        {data.statusDisplay && (
          <span
            className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-semibold ${statusColor(cert.currentStatus)}`}
          >
            {data.statusDisplay}
          </span>
        )}

        <dl className="mt-4 space-y-3 text-sm">
          <div>
            <dt className="font-medium text-gray-500">{t('cert_number')}</dt>
            <dd className="mt-0.5 font-mono text-gray-900">{cert.certificationNumber ?? '—'}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">{t('cooperative')}</dt>
            <dd className="mt-0.5 text-gray-900">{cert.cooperativeName}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">{t('product_type')}</dt>
            <dd className="mt-0.5 text-gray-900">{cert.productTypeCode}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">{t('cert_type')}</dt>
            <dd className="mt-0.5 text-gray-900">{cert.certificationType}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">{t('region')}</dt>
            <dd className="mt-0.5 text-gray-900">{cert.regionCode}</dd>
          </div>
          {cert.validFrom && (
            <div>
              <dt className="font-medium text-gray-500">{t('valid_from')}</dt>
              <dd className="mt-0.5 text-gray-900">{cert.validFrom}</dd>
            </div>
          )}
          {cert.validUntil && (
            <div>
              <dt className="font-medium text-gray-500">{t('valid_until')}</dt>
              <dd className="mt-0.5 text-gray-900">{cert.validUntil}</dd>
            </div>
          )}
        </dl>

        {data.message && (
          <p className="mt-4 text-xs text-gray-400">{data.message}</p>
        )}
      </div>
    </main>
  );
}

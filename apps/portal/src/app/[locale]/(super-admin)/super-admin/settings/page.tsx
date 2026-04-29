import { apiFetch } from '@/lib/api-server';
import { PageHeader } from '@/components/admin/page-header';
import {
  updateCampaignSettings,
  updateCertificationSettings,
  updatePlatformSettings,
} from './actions';

type CampaignSettings = {
  currentCampaignYear: string;
  campaignStartMonth: number;
  campaignEndMonth: number;
};

type CertSettings = {
  defaultValidityDays: number;
  maxRenewalGraceDays: number;
};

type PlatformSettings = {
  maintenanceMode: boolean;
  supportEmail: string;
};

const inputCls =
  'w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500';
const saveCls =
  'rounded bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700';
const sectionCls = 'rounded-lg border border-gray-200 bg-white p-5 shadow-sm';

export default async function SettingsPage() {
  const [campaign, cert, platform] = await Promise.all([
    apiFetch<CampaignSettings>('/api/v1/admin/settings/campaign'),
    apiFetch<CertSettings>('/api/v1/admin/settings/certification'),
    apiFetch<PlatformSettings>('/api/v1/admin/settings/platform'),
  ]);

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader title="Paramètres système" />

      {/* Campaign settings */}
      <section className={sectionCls}>
        <h2 className="mb-4 text-base font-semibold">Campagne agricole</h2>
        <form action={updateCampaignSettings} className="flex flex-col gap-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Année de campagne
            </label>
            <input
              name="currentCampaignYear"
              defaultValue={campaign.currentCampaignYear}
              className={inputCls}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Mois début</label>
              <input
                type="number"
                name="campaignStartMonth"
                min={1}
                max={12}
                defaultValue={campaign.campaignStartMonth}
                className={inputCls}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Mois fin</label>
              <input
                type="number"
                name="campaignEndMonth"
                min={1}
                max={12}
                defaultValue={campaign.campaignEndMonth}
                className={inputCls}
              />
            </div>
          </div>
          <button type="submit" className={saveCls}>
            Enregistrer
          </button>
        </form>
      </section>

      {/* Certification settings */}
      <section className={sectionCls}>
        <h2 className="mb-4 text-base font-semibold">Certification</h2>
        <form action={updateCertificationSettings} className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Validité par défaut (jours)
              </label>
              <input
                type="number"
                name="defaultValidityDays"
                defaultValue={cert.defaultValidityDays}
                className={inputCls}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Délai de grâce renouvellement (jours)
              </label>
              <input
                type="number"
                name="maxRenewalGraceDays"
                defaultValue={cert.maxRenewalGraceDays}
                className={inputCls}
              />
            </div>
          </div>
          <button type="submit" className={saveCls}>
            Enregistrer
          </button>
        </form>
      </section>

      {/* Platform settings */}
      <section className={sectionCls}>
        <h2 className="mb-4 text-base font-semibold">Plateforme</h2>
        <form action={updatePlatformSettings} className="flex flex-col gap-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Email support</label>
            <input
              type="email"
              name="supportEmail"
              defaultValue={platform.supportEmail}
              className={inputCls}
            />
          </div>
          <div className="flex items-center gap-2">
            <input type="hidden" name="maintenanceMode" value="false" />
            <input
              type="checkbox"
              name="maintenanceMode"
              value="true"
              id="maintenance"
              defaultChecked={platform.maintenanceMode}
              className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <label htmlFor="maintenance" className="text-sm font-medium text-gray-700">
              Mode maintenance
            </label>
          </div>
          <button type="submit" className={saveCls}>
            Enregistrer
          </button>
        </form>
      </section>
    </div>
  );
}

'use server';
import { revalidatePath } from 'next/cache';
import { apiFetch } from '@/lib/api-server';

export async function updateCampaignSettings(formData: FormData): Promise<void> {
  await apiFetch('/api/v1/admin/settings/campaign', {
    method: 'PATCH',
    body: JSON.stringify({
      currentCampaignYear: formData.get('currentCampaignYear'),
      campaignStartMonth: Number(formData.get('campaignStartMonth')),
      campaignEndMonth: Number(formData.get('campaignEndMonth')),
    }),
  });
  revalidatePath('/[locale]/(super-admin)/super-admin/settings', 'page');
}

export async function updateCertificationSettings(formData: FormData): Promise<void> {
  await apiFetch('/api/v1/admin/settings/certification', {
    method: 'PATCH',
    body: JSON.stringify({
      defaultValidityDays: Number(formData.get('defaultValidityDays')),
      maxRenewalGraceDays: Number(formData.get('maxRenewalGraceDays')),
    }),
  });
  revalidatePath('/[locale]/(super-admin)/super-admin/settings', 'page');
}

export async function updatePlatformSettings(formData: FormData): Promise<void> {
  await apiFetch('/api/v1/admin/settings/platform', {
    method: 'PATCH',
    body: JSON.stringify({
      maintenanceMode: formData.get('maintenanceMode') === 'true',
      supportEmail: formData.get('supportEmail'),
    }),
  });
  revalidatePath('/[locale]/(super-admin)/super-admin/settings', 'page');
}

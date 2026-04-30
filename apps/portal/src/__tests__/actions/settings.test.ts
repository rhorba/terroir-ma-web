import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/api-server', () => ({ apiFetch: vi.fn() }));
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));

import {
  updateCampaignSettings,
  updateCertificationSettings,
  updatePlatformSettings,
} from '@/app/[locale]/(super-admin)/super-admin/settings/actions';
import { apiFetch } from '@/lib/api-server';
import { revalidatePath } from 'next/cache';

const mockApiFetch = vi.mocked(apiFetch);
const mockRevalidatePath = vi.mocked(revalidatePath);

function makeFormData(data: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [k, v] of Object.entries(data)) fd.append(k, v);
  return fd;
}

beforeEach(() => {
  vi.clearAllMocks();
  mockApiFetch.mockResolvedValue(undefined);
});

describe('updateCampaignSettings', () => {
  it('calls PATCH /api/v1/admin/settings/campaign', async () => {
    await updateCampaignSettings(
      makeFormData({ currentCampaignYear: '2025/2026', campaignStartMonth: '10', campaignEndMonth: '9' }),
    );
    expect(mockApiFetch).toHaveBeenCalledWith(
      '/api/v1/admin/settings/campaign',
      expect.objectContaining({ method: 'PATCH' }),
    );
  });

  it('passes all campaign fields in body', async () => {
    await updateCampaignSettings(
      makeFormData({ currentCampaignYear: '2025/2026', campaignStartMonth: '10', campaignEndMonth: '9' }),
    );
    const body = JSON.parse(
      (mockApiFetch.mock.calls[0][1] as RequestInit).body as string,
    );
    expect(body.currentCampaignYear).toBe('2025/2026');
    expect(body.campaignStartMonth).toBe(10);
    expect(body.campaignEndMonth).toBe(9);
  });

  it('revalidates settings page', async () => {
    await updateCampaignSettings(makeFormData({ currentCampaignYear: '2025/2026', campaignStartMonth: '10', campaignEndMonth: '9' }));
    expect(mockRevalidatePath).toHaveBeenCalledOnce();
  });

  it('throws when apiFetch fails', async () => {
    mockApiFetch.mockRejectedValue(new Error('Invalid year format'));
    await expect(
      updateCampaignSettings(makeFormData({ currentCampaignYear: 'bad', campaignStartMonth: '10', campaignEndMonth: '9' })),
    ).rejects.toThrow('Invalid year format');
  });
});

describe('updateCertificationSettings', () => {
  it('calls PATCH /api/v1/admin/settings/certification', async () => {
    await updateCertificationSettings(
      makeFormData({ defaultValidityDays: '365', maxRenewalGraceDays: '30' }),
    );
    expect(mockApiFetch).toHaveBeenCalledWith(
      '/api/v1/admin/settings/certification',
      expect.objectContaining({ method: 'PATCH' }),
    );
  });

  it('converts string values to numbers', async () => {
    await updateCertificationSettings(
      makeFormData({ defaultValidityDays: '730', maxRenewalGraceDays: '60' }),
    );
    const body = JSON.parse(
      (mockApiFetch.mock.calls[0][1] as RequestInit).body as string,
    );
    expect(body.defaultValidityDays).toBe(730);
    expect(body.maxRenewalGraceDays).toBe(60);
  });

  it('revalidates settings page', async () => {
    await updateCertificationSettings(
      makeFormData({ defaultValidityDays: '365', maxRenewalGraceDays: '30' }),
    );
    expect(mockRevalidatePath).toHaveBeenCalledOnce();
  });

  it('throws on apiFetch failure', async () => {
    mockApiFetch.mockRejectedValue(new Error('Validation error'));
    await expect(
      updateCertificationSettings(makeFormData({ defaultValidityDays: '0', maxRenewalGraceDays: '0' })),
    ).rejects.toThrow();
  });
});

describe('updatePlatformSettings', () => {
  it('calls PATCH /api/v1/admin/settings/platform', async () => {
    await updatePlatformSettings(
      makeFormData({ maintenanceMode: 'false', supportEmail: 'admin@terroir.ma' }),
    );
    expect(mockApiFetch).toHaveBeenCalledWith(
      '/api/v1/admin/settings/platform',
      expect.objectContaining({ method: 'PATCH' }),
    );
  });

  it('converts maintenanceMode "true" to boolean true', async () => {
    await updatePlatformSettings(
      makeFormData({ maintenanceMode: 'true', supportEmail: 'a@b.com' }),
    );
    const body = JSON.parse(
      (mockApiFetch.mock.calls[0][1] as RequestInit).body as string,
    );
    expect(body.maintenanceMode).toBe(true);
  });

  it('converts maintenanceMode "false" to boolean false', async () => {
    await updatePlatformSettings(
      makeFormData({ maintenanceMode: 'false', supportEmail: 'a@b.com' }),
    );
    const body = JSON.parse(
      (mockApiFetch.mock.calls[0][1] as RequestInit).body as string,
    );
    expect(body.maintenanceMode).toBe(false);
  });

  it('passes supportEmail in body', async () => {
    await updatePlatformSettings(
      makeFormData({ maintenanceMode: 'false', supportEmail: 'support@terroir.ma' }),
    );
    const body = JSON.parse(
      (mockApiFetch.mock.calls[0][1] as RequestInit).body as string,
    );
    expect(body.supportEmail).toBe('support@terroir.ma');
  });

  it('revalidates settings page', async () => {
    await updatePlatformSettings(
      makeFormData({ maintenanceMode: 'false', supportEmail: 'a@b.com' }),
    );
    expect(mockRevalidatePath).toHaveBeenCalledOnce();
  });
});

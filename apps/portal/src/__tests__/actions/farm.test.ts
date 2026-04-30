import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/api-server', () => ({ apiFetch: vi.fn() }));
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));
vi.mock('@/lib/auth-utils', () => ({ getCooperativeId: vi.fn() }));

import { mapFarm } from '@/app/[locale]/(cooperative-admin)/cooperative-admin/farms/actions';
import { apiFetch } from '@/lib/api-server';
import { revalidatePath } from 'next/cache';
import { getCooperativeId } from '@/lib/auth-utils';

const mockApiFetch = vi.mocked(apiFetch);
const mockRevalidatePath = vi.mocked(revalidatePath);
const mockGetCooperativeId = vi.mocked(getCooperativeId);

const baseFarm = {
  name: 'Ferme Atlas',
  regionCode: 'SOU',
  commune: 'Taroudant',
  areaHectares: 12.5,
  cropTypes: ['Argane', 'Figuier'],
  latitude: 30.47,
  longitude: -8.88,
};

beforeEach(() => {
  vi.clearAllMocks();
  mockApiFetch.mockResolvedValue(undefined);
  mockGetCooperativeId.mockResolvedValue('coop-uuid-abc');
});

describe('mapFarm', () => {
  it('calls apiFetch POST /api/v1/cooperatives/:coopId/farms', async () => {
    await mapFarm(baseFarm);
    expect(mockApiFetch).toHaveBeenCalledWith(
      '/api/v1/cooperatives/coop-uuid-abc/farms',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('sends the farm data in the request body', async () => {
    await mapFarm(baseFarm);
    const body = JSON.parse(
      (mockApiFetch.mock.calls[0][1] as RequestInit).body as string,
    );
    expect(body.name).toBe('Ferme Atlas');
    expect(body.regionCode).toBe('SOU');
    expect(body.areaHectares).toBe(12.5);
  });

  it('revalidates farms page on success', async () => {
    await mapFarm(baseFarm);
    expect(mockRevalidatePath).toHaveBeenCalledOnce();
  });

  it('throws when cooperativeId is null', async () => {
    mockGetCooperativeId.mockResolvedValue(null);
    await expect(mapFarm(baseFarm)).rejects.toThrow('No cooperative in session');
  });

  it('does not call apiFetch when cooperativeId is null', async () => {
    mockGetCooperativeId.mockResolvedValue(null);
    await expect(mapFarm(baseFarm)).rejects.toThrow();
    expect(mockApiFetch).not.toHaveBeenCalled();
  });

  it('throws when apiFetch fails', async () => {
    mockApiFetch.mockRejectedValue(new Error('API error'));
    await expect(mapFarm(baseFarm)).rejects.toThrow('API error');
  });

  it('works with minimal required fields only (no commune/gps)', async () => {
    await mapFarm({
      name: 'Ferme Simple',
      regionCode: 'MAR',
      areaHectares: 5,
      cropTypes: ['Olive'],
    });
    expect(mockApiFetch).toHaveBeenCalledTimes(1);
  });
});

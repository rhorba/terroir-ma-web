import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/api-server', () => ({ apiFetch: vi.fn() }));
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));

import { logHarvest } from '@/app/[locale]/(cooperative-member)/cooperative-member/harvests/actions';
import { apiFetch } from '@/lib/api-server';
import { revalidatePath } from 'next/cache';

const mockApiFetch = vi.mocked(apiFetch);
const mockRevalidatePath = vi.mocked(revalidatePath);

const basePayload = {
  farmId: 'farm-uuid-1',
  productTypeCode: 'ARGANE',
  quantityKg: 1250.5,
  harvestDate: '2025-10-15',
  campaignYear: '2025/2026',
  method: 'cueillette manuelle',
};

beforeEach(() => {
  vi.clearAllMocks();
  mockApiFetch.mockResolvedValue(undefined);
});

describe('logHarvest', () => {
  it('calls apiFetch POST /api/v1/harvests with the correct body', async () => {
    await logHarvest(basePayload);
    expect(mockApiFetch).toHaveBeenCalledWith(
      '/api/v1/harvests',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(basePayload),
      }),
    );
  });

  it('returns empty object on success', async () => {
    const result = await logHarvest(basePayload);
    expect(result).toEqual({});
  });

  it('revalidates harvests path on success', async () => {
    await logHarvest(basePayload);
    expect(mockRevalidatePath).toHaveBeenCalledWith('/fr/cooperative-member/harvests');
  });

  it('revalidates member dashboard path on success', async () => {
    await logHarvest(basePayload);
    expect(mockRevalidatePath).toHaveBeenCalledWith('/fr/cooperative-member');
  });

  it('returns error message when apiFetch throws an Error', async () => {
    mockApiFetch.mockRejectedValue(new Error('API 422: Validation failed'));
    const result = await logHarvest(basePayload);
    expect(result).toEqual({ error: 'API 422: Validation failed' });
  });

  it('returns generic error message for non-Error throws', async () => {
    mockApiFetch.mockRejectedValue('unexpected');
    const result = await logHarvest(basePayload);
    expect(result).toEqual({ error: 'Erreur serveur' });
  });

  it('does not revalidate when apiFetch fails', async () => {
    mockApiFetch.mockRejectedValue(new Error('fail'));
    await logHarvest(basePayload);
    expect(mockRevalidatePath).not.toHaveBeenCalled();
  });
});

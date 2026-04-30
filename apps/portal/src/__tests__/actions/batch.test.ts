import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/api-server', () => ({ apiFetch: vi.fn() }));
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));

import { createBatch } from '@/app/[locale]/(cooperative-member)/cooperative-member/batches/actions';
import { apiFetch } from '@/lib/api-server';
import { revalidatePath } from 'next/cache';

const mockApiFetch = vi.mocked(apiFetch);
const mockRevalidatePath = vi.mocked(revalidatePath);

const basePayload = {
  productTypeCode: 'ARGANE',
  harvestIds: ['h-1', 'h-2', 'h-3'],
  totalQuantityKg: 3800.75,
  processingDate: '2025-11-01',
};

beforeEach(() => {
  vi.clearAllMocks();
  mockApiFetch.mockResolvedValue(undefined);
});

describe('createBatch', () => {
  it('calls apiFetch POST /api/v1/batches with correct body', async () => {
    await createBatch(basePayload);
    expect(mockApiFetch).toHaveBeenCalledWith(
      '/api/v1/batches',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(basePayload),
      }),
    );
  });

  it('returns empty object on success', async () => {
    const result = await createBatch(basePayload);
    expect(result).toEqual({});
  });

  it('revalidates batches list path', async () => {
    await createBatch(basePayload);
    expect(mockRevalidatePath).toHaveBeenCalledWith('/fr/cooperative-member/batches');
  });

  it('revalidates member dashboard path', async () => {
    await createBatch(basePayload);
    expect(mockRevalidatePath).toHaveBeenCalledWith('/fr/cooperative-member');
  });

  it('returns error string when apiFetch throws an Error', async () => {
    mockApiFetch.mockRejectedValue(new Error('API 400: Bad request'));
    const result = await createBatch(basePayload);
    expect(result).toEqual({ error: 'API 400: Bad request' });
  });

  it('returns generic error for non-Error throws', async () => {
    mockApiFetch.mockRejectedValue(null);
    const result = await createBatch(basePayload);
    expect(result).toEqual({ error: 'Erreur serveur' });
  });

  it('does not revalidate on failure', async () => {
    mockApiFetch.mockRejectedValue(new Error('fail'));
    await createBatch(basePayload);
    expect(mockRevalidatePath).not.toHaveBeenCalled();
  });

  it('passes all harvest IDs in the request body', async () => {
    const harvestIds = ['a', 'b', 'c', 'd', 'e'];
    await createBatch({ ...basePayload, harvestIds });
    const body = JSON.parse(
      (mockApiFetch.mock.calls[0][1] as RequestInit).body as string,
    );
    expect(body.harvestIds).toEqual(harvestIds);
  });
});

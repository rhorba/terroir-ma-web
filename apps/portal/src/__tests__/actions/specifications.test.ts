import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/api-server', () => ({ apiFetch: vi.fn() }));
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));

import {
  createProductType,
  updateProductType,
  deactivateProductType,
} from '@/app/[locale]/(super-admin)/super-admin/specifications/actions';
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

describe('createProductType', () => {
  const baseData = {
    code: 'ARGANE',
    nameFr: 'Huile d\'Argan',
    nameAr: 'زيت الأركان',
    nameZgh: 'ⵣⵉⵜ ⵓⴽⵓⵔⵉ',
    certificationType: 'IGP',
    regionCode: 'SOU',
    hsCode: '1515.90',
    onssaCategory: 'Huiles végétales',
  };

  it('calls POST /api/v1/product-types', async () => {
    await createProductType(makeFormData(baseData));
    expect(mockApiFetch).toHaveBeenCalledWith(
      '/api/v1/product-types',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('includes required fields in body', async () => {
    await createProductType(makeFormData(baseData));
    const body = JSON.parse(
      (mockApiFetch.mock.calls[0][1] as RequestInit).body as string,
    );
    expect(body.code).toBe('ARGANE');
    expect(body.nameFr).toBe('Huile d\'Argan');
    expect(body.certificationType).toBe('IGP');
    expect(body.regionCode).toBe('SOU');
  });

  it('sets nameZgh to undefined when empty', async () => {
    await createProductType(makeFormData({ ...baseData, nameZgh: '' }));
    const body = JSON.parse(
      (mockApiFetch.mock.calls[0][1] as RequestInit).body as string,
    );
    expect(body.nameZgh).toBeUndefined();
  });

  it('sets labTestParameters to empty array', async () => {
    await createProductType(makeFormData(baseData));
    const body = JSON.parse(
      (mockApiFetch.mock.calls[0][1] as RequestInit).body as string,
    );
    expect(body.labTestParameters).toEqual([]);
  });

  it('keeps hsCode when provided', async () => {
    await createProductType(makeFormData({ ...baseData, hsCode: '1515.90' }));
    const body = JSON.parse(
      (mockApiFetch.mock.calls[0][1] as RequestInit).body as string,
    );
    expect(body.hsCode).toBe('1515.90');
  });

  it('sets hsCode to undefined when empty', async () => {
    await createProductType(makeFormData({ ...baseData, hsCode: '' }));
    const body = JSON.parse(
      (mockApiFetch.mock.calls[0][1] as RequestInit).body as string,
    );
    expect(body.hsCode).toBeUndefined();
  });

  it('keeps onssaCategory when provided', async () => {
    await createProductType(makeFormData({ ...baseData, onssaCategory: 'Huiles' }));
    const body = JSON.parse(
      (mockApiFetch.mock.calls[0][1] as RequestInit).body as string,
    );
    expect(body.onssaCategory).toBe('Huiles');
  });

  it('sets onssaCategory to undefined when empty', async () => {
    await createProductType(makeFormData({ ...baseData, onssaCategory: '' }));
    const body = JSON.parse(
      (mockApiFetch.mock.calls[0][1] as RequestInit).body as string,
    );
    expect(body.onssaCategory).toBeUndefined();
  });

  it('revalidates specifications page', async () => {
    await createProductType(makeFormData(baseData));
    expect(mockRevalidatePath).toHaveBeenCalledOnce();
  });

  it('throws when apiFetch fails', async () => {
    mockApiFetch.mockRejectedValue(new Error('Duplicate code'));
    await expect(createProductType(makeFormData(baseData))).rejects.toThrow('Duplicate code');
  });
});

describe('updateProductType', () => {
  const updateData = {
    nameFr: 'Argan Bio',
    nameAr: 'أركان بيو',
    nameZgh: '',
    hsCode: '1515.91',
    validityDays: '730',
  };

  it('calls PATCH /api/v1/product-types/:id', async () => {
    await updateProductType('pt-001', makeFormData(updateData));
    expect(mockApiFetch).toHaveBeenCalledWith(
      '/api/v1/product-types/pt-001',
      expect.objectContaining({ method: 'PATCH' }),
    );
  });

  it('converts validityDays to number', async () => {
    await updateProductType('pt-001', makeFormData(updateData));
    const body = JSON.parse(
      (mockApiFetch.mock.calls[0][1] as RequestInit).body as string,
    );
    expect(body.validityDays).toBe(730);
  });

  it('sets validityDays to undefined when empty', async () => {
    await updateProductType('pt-001', makeFormData({ ...updateData, validityDays: '' }));
    const body = JSON.parse(
      (mockApiFetch.mock.calls[0][1] as RequestInit).body as string,
    );
    expect(body.validityDays).toBeUndefined();
  });

  it('keeps nameZgh when non-empty in update', async () => {
    await updateProductType('pt-001', makeFormData({ ...updateData, nameZgh: 'ⵣⵉⵜ' }));
    const body = JSON.parse(
      (mockApiFetch.mock.calls[0][1] as RequestInit).body as string,
    );
    expect(body.nameZgh).toBe('ⵣⵉⵜ');
  });

  it('keeps hsCode when non-empty in update', async () => {
    await updateProductType('pt-001', makeFormData({ ...updateData, hsCode: '0804.10' }));
    const body = JSON.parse(
      (mockApiFetch.mock.calls[0][1] as RequestInit).body as string,
    );
    expect(body.hsCode).toBe('0804.10');
  });

  it('sets hsCode to undefined when empty in update', async () => {
    await updateProductType('pt-001', makeFormData({ ...updateData, hsCode: '' }));
    const body = JSON.parse(
      (mockApiFetch.mock.calls[0][1] as RequestInit).body as string,
    );
    expect(body.hsCode).toBeUndefined();
  });

  it('revalidates specifications page', async () => {
    await updateProductType('pt-001', makeFormData(updateData));
    expect(mockRevalidatePath).toHaveBeenCalledOnce();
  });

  it('throws when apiFetch fails', async () => {
    mockApiFetch.mockRejectedValue(new Error('Not found'));
    await expect(updateProductType('pt-bad', makeFormData(updateData))).rejects.toThrow('Not found');
  });
});

describe('deactivateProductType', () => {
  it('calls DELETE /api/v1/product-types/:id/deactivate', async () => {
    await deactivateProductType('pt-002');
    expect(mockApiFetch).toHaveBeenCalledWith(
      '/api/v1/product-types/pt-002/deactivate',
      expect.objectContaining({ method: 'DELETE' }),
    );
  });

  it('revalidates specifications page', async () => {
    await deactivateProductType('pt-002');
    expect(mockRevalidatePath).toHaveBeenCalledOnce();
  });

  it('throws when apiFetch fails', async () => {
    mockApiFetch.mockRejectedValue(new Error('Cannot deactivate'));
    await expect(deactivateProductType('pt-002')).rejects.toThrow('Cannot deactivate');
  });
});

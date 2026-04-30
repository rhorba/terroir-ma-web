import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/api-server', () => ({ apiFetch: vi.fn() }));
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));

import { fileReport } from '@/app/[locale]/(inspector)/inspector/inspections/actions';
import { apiFetch } from '@/lib/api-server';
import { revalidatePath } from 'next/cache';

const mockApiFetch = vi.mocked(apiFetch);
const mockRevalidatePath = vi.mocked(revalidatePath);

const basePayload = {
  passed: true,
  reportSummary: 'Inspection réussie — tous les critères sont conformes.',
  detailedObservations: 'Bonne hygiène, bonnes pratiques agricoles.',
  nonConformities: undefined,
};

beforeEach(() => {
  vi.clearAllMocks();
  mockApiFetch.mockResolvedValue(undefined);
});

describe('fileReport', () => {
  it('calls PATCH /api/v1/inspections/:id/report', async () => {
    await fileReport('insp-001', basePayload);
    expect(mockApiFetch).toHaveBeenCalledWith(
      '/api/v1/inspections/insp-001/report',
      expect.objectContaining({ method: 'PATCH' }),
    );
  });

  it('sends report payload in body', async () => {
    await fileReport('insp-001', basePayload);
    const body = JSON.parse(
      (mockApiFetch.mock.calls[0][1] as RequestInit).body as string,
    );
    expect(body.passed).toBe(true);
    expect(body.reportSummary).toBe('Inspection réussie — tous les critères sont conformes.');
  });

  it('revalidates inspector inspections path', async () => {
    await fileReport('insp-001', basePayload);
    expect(mockRevalidatePath).toHaveBeenCalledWith('/fr/inspector/inspections');
  });

  it('reports failed inspection correctly', async () => {
    await fileReport('insp-002', {
      passed: false,
      reportSummary: 'Non conforme',
      nonConformities: 'Pesticides hors limite',
    });
    const body = JSON.parse(
      (mockApiFetch.mock.calls[0][1] as RequestInit).body as string,
    );
    expect(body.passed).toBe(false);
    expect(body.nonConformities).toBe('Pesticides hors limite');
  });

  it('throws when apiFetch fails', async () => {
    mockApiFetch.mockRejectedValue(new Error('Not found'));
    await expect(fileReport('insp-003', basePayload)).rejects.toThrow('Not found');
  });
});

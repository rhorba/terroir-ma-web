import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/api-server', () => ({ apiFetch: vi.fn() }));
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));

import {
  grantCertification,
  denyCertification,
  startReview,
  startFinalReview,
  revokeCertification,
} from '@/app/[locale]/(certification-body)/certification-body/certifications/actions';
import { apiFetch } from '@/lib/api-server';
import { revalidatePath } from 'next/cache';

const mockApiFetch = vi.mocked(apiFetch);
const mockRevalidatePath = vi.mocked(revalidatePath);

beforeEach(() => {
  vi.clearAllMocks();
  mockApiFetch.mockResolvedValue(undefined);
});

describe('grantCertification', () => {
  it('calls PATCH /api/v1/certifications/:id/grant with dates', async () => {
    await grantCertification('cert-1', '2025-01-01', '2026-01-01');
    expect(mockApiFetch).toHaveBeenCalledWith(
      '/api/v1/certifications/cert-1/grant',
      expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({ validFrom: '2025-01-01', validUntil: '2026-01-01' }),
      }),
    );
  });

  it('returns empty object on success', async () => {
    expect(await grantCertification('cert-1', '2025-01-01', '2026-01-01')).toEqual({});
  });

  it('revalidates certifications list and detail', async () => {
    await grantCertification('cert-1', '2025-01-01', '2026-01-01');
    expect(mockRevalidatePath).toHaveBeenCalledWith('/fr/certification-body/certifications');
    expect(mockRevalidatePath).toHaveBeenCalledWith('/fr/certification-body/certifications/cert-1');
  });

  it('returns error message from Error instance', async () => {
    mockApiFetch.mockRejectedValue(new Error('API 409: Already granted'));
    const result = await grantCertification('cert-1', '2025-01-01', '2026-01-01');
    expect(result).toEqual({ error: 'API 409: Already granted' });
  });

  it('returns generic error for non-Error throws', async () => {
    mockApiFetch.mockRejectedValue('unexpected failure');
    const result = await grantCertification('cert-1', '2025-01-01', '2026-01-01');
    expect(result).toEqual({ error: 'Erreur serveur' });
  });
});

describe('denyCertification', () => {
  it('calls PATCH /api/v1/certifications/:id/deny with reason', async () => {
    await denyCertification('cert-2', 'Non conforme');
    expect(mockApiFetch).toHaveBeenCalledWith(
      '/api/v1/certifications/cert-2/deny',
      expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({ reason: 'Non conforme' }),
      }),
    );
  });

  it('returns empty object on success', async () => {
    expect(await denyCertification('cert-2', 'raison')).toEqual({});
  });

  it('returns error on failure', async () => {
    mockApiFetch.mockRejectedValue(new Error('fail'));
    expect(await denyCertification('cert-2', 'r')).toEqual({ error: 'fail' });
  });

  it('returns generic error for non-Error throws', async () => {
    mockApiFetch.mockRejectedValue(42);
    expect(await denyCertification('cert-2', 'r')).toEqual({ error: 'Erreur serveur' });
  });
});

describe('startReview', () => {
  it('calls POST /api/v1/certifications/:id/start-review', async () => {
    await startReview('cert-3', 'Some remarks');
    expect(mockApiFetch).toHaveBeenCalledWith(
      '/api/v1/certifications/cert-3/start-review',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('passes remarks in body', async () => {
    await startReview('cert-3', 'My remarks');
    const body = JSON.parse(
      (mockApiFetch.mock.calls[0][1] as RequestInit).body as string,
    );
    expect(body.remarks).toBe('My remarks');
  });

  it('returns empty object on success', async () => {
    expect(await startReview('cert-3')).toEqual({});
  });

  it('revalidates certification detail', async () => {
    await startReview('cert-3');
    expect(mockRevalidatePath).toHaveBeenCalledWith('/fr/certification-body/certifications/cert-3');
  });

  it('returns Error message on failure', async () => {
    mockApiFetch.mockRejectedValue(new Error('bad'));
    expect(await startReview('cert-3')).toEqual({ error: 'bad' });
  });

  it('returns generic error for non-Error throws', async () => {
    mockApiFetch.mockRejectedValue(undefined);
    expect(await startReview('cert-3')).toEqual({ error: 'Erreur serveur' });
  });
});

describe('startFinalReview', () => {
  it('calls POST /api/v1/certifications/:id/start-final-review', async () => {
    await startFinalReview('cert-4');
    expect(mockApiFetch).toHaveBeenCalledWith(
      '/api/v1/certifications/cert-4/start-final-review',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('returns empty object on success', async () => {
    expect(await startFinalReview('cert-4')).toEqual({});
  });

  it('returns Error message on failure', async () => {
    mockApiFetch.mockRejectedValue(new Error('denied'));
    expect(await startFinalReview('cert-4')).toEqual({ error: 'denied' });
  });

  it('returns generic error for non-Error throws', async () => {
    mockApiFetch.mockRejectedValue(null);
    expect(await startFinalReview('cert-4')).toEqual({ error: 'Erreur serveur' });
  });
});

describe('revokeCertification', () => {
  it('calls PATCH /api/v1/certifications/:id/revoke with reason', async () => {
    await revokeCertification('cert-5', 'Fraude détectée');
    expect(mockApiFetch).toHaveBeenCalledWith(
      '/api/v1/certifications/cert-5/revoke',
      expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({ reason: 'Fraude détectée' }),
      }),
    );
  });

  it('returns empty object on success', async () => {
    expect(await revokeCertification('cert-5', 'raison')).toEqual({});
  });

  it('revalidates both list and detail', async () => {
    await revokeCertification('cert-5', 'reason');
    expect(mockRevalidatePath).toHaveBeenCalledWith('/fr/certification-body/certifications');
    expect(mockRevalidatePath).toHaveBeenCalledWith('/fr/certification-body/certifications/cert-5');
  });

  it('returns Error message on failure', async () => {
    mockApiFetch.mockRejectedValue(new Error('revoke failed'));
    expect(await revokeCertification('cert-5', 'r')).toEqual({ error: 'revoke failed' });
  });

  it('returns generic error for non-Error throws', async () => {
    mockApiFetch.mockRejectedValue(0);
    expect(await revokeCertification('cert-5', 'r')).toEqual({ error: 'Erreur serveur' });
  });
});

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('@/lib/api-server', () => ({ apiFetch: vi.fn() }));
vi.mock('@/lib/auth-utils', () => ({ getAccessToken: vi.fn() }));
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));

import { recordResult, uploadReport } from '@/app/[locale]/(lab-technician)/lab-technician/queue/[id]/actions';
import { apiFetch } from '@/lib/api-server';
import { getAccessToken } from '@/lib/auth-utils';
import { revalidatePath } from 'next/cache';

const mockApiFetch = vi.mocked(apiFetch);
const mockGetAccessToken = vi.mocked(getAccessToken);
const mockRevalidatePath = vi.mocked(revalidatePath);

beforeEach(() => {
  vi.clearAllMocks();
  mockApiFetch.mockResolvedValue(undefined);
  mockGetAccessToken.mockResolvedValue('test-token');
  vi.stubGlobal('fetch', vi.fn());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('recordResult', () => {
  it('calls POST /api/v1/lab-tests/:id/results', async () => {
    await recordResult('lab-test-001', {
      testValues: { humidity: 12.5, acidity: 0.8 },
      technicianName: 'Dr. Hassan',
    });
    expect(mockApiFetch).toHaveBeenCalledWith(
      '/api/v1/lab-tests/lab-test-001/results',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('includes testValues and labTestId in body', async () => {
    await recordResult('test-id-abc', {
      testValues: { param1: 5, param2: 'ok' },
    });
    const body = JSON.parse(
      (mockApiFetch.mock.calls[0][1] as RequestInit).body as string,
    );
    expect(body.labTestId).toBe('test-id-abc');
    expect(body.testValues).toEqual({ param1: 5, param2: 'ok' });
  });

  it('includes optional technicianName and laboratoryName', async () => {
    await recordResult('test-id', {
      testValues: {},
      technicianName: 'Alice',
      laboratoryName: 'Lab Casablanca',
    });
    const body = JSON.parse(
      (mockApiFetch.mock.calls[0][1] as RequestInit).body as string,
    );
    expect(body.technicianName).toBe('Alice');
    expect(body.laboratoryName).toBe('Lab Casablanca');
  });

  it('revalidates lab queue on success', async () => {
    await recordResult('test-id', { testValues: {} });
    expect(mockRevalidatePath).toHaveBeenCalledWith('/fr/lab-technician/queue');
  });

  it('throws when apiFetch fails', async () => {
    mockApiFetch.mockRejectedValue(new Error('Already recorded'));
    await expect(recordResult('test-id', { testValues: {} })).rejects.toThrow('Already recorded');
  });
});

describe('uploadReport', () => {
  it('throws when file is missing from FormData', async () => {
    const formData = new FormData();
    await expect(uploadReport('test-id', formData)).rejects.toThrow('Fichier requis');
  });

  it('throws when file has zero size', async () => {
    const formData = new FormData();
    formData.append('file', new File([], 'empty.pdf', { type: 'application/pdf' }));
    await expect(uploadReport('test-id', formData)).rejects.toThrow('Fichier requis');
  });

  it('calls fetch with Authorization header when file is provided', async () => {
    const mockFetch = vi.mocked(global.fetch);
    mockFetch.mockResolvedValue({ ok: true } as Response);

    const formData = new FormData();
    formData.append('file', new File(['content'], 'report.pdf', { type: 'application/pdf' }));
    await uploadReport('lab-test-999', formData);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/lab-tests/lab-test-999/report'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ Authorization: 'Bearer test-token' }),
      }),
    );
  });

  it('throws when fetch returns non-ok status', async () => {
    const mockFetch = vi.mocked(global.fetch);
    mockFetch.mockResolvedValue({ ok: false, status: 413 } as Response);

    const formData = new FormData();
    formData.append('file', new File(['data'], 'big.pdf'));
    await expect(uploadReport('test-id', formData)).rejects.toThrow('Upload échoué: 413');
  });

  it('uses empty string for Authorization when getAccessToken returns null', async () => {
    mockGetAccessToken.mockResolvedValue(null as unknown as string);
    const mockFetch = vi.mocked(global.fetch);
    mockFetch.mockResolvedValue({ ok: true } as Response);

    const formData = new FormData();
    formData.append('file', new File(['content'], 'report.pdf'));
    await uploadReport('lab-test-null-token', formData);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer ' }),
      }),
    );
  });

  it('revalidates queue detail on success', async () => {
    const mockFetch = vi.mocked(global.fetch);
    mockFetch.mockResolvedValue({ ok: true } as Response);

    const formData = new FormData();
    formData.append('file', new File(['content'], 'report.pdf'));
    await uploadReport('my-test-id', formData);

    expect(mockRevalidatePath).toHaveBeenCalledWith('/fr/lab-technician/queue/my-test-id');
  });
});

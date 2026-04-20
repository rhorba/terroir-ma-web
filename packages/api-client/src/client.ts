import createClient from 'openapi-fetch';
import type { paths } from './generated/types.gen';

/**
 * Creates a typed openapi-fetch client configured for the Terroir.ma NestJS API.
 * Pass accessToken for authenticated endpoints; omit for public endpoints (e.g. /verify/:uuid).
 */
export const createApiClient = (accessToken?: string) =>
  createClient<paths>({
    baseUrl: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000',
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
  });

/**
 * Unwraps the NestJS response envelope { success, data, error, meta } → T.
 */
export const unwrap = <T>(res: { data?: { data?: T } }): T | undefined => res.data?.data;

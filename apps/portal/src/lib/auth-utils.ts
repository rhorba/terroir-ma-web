import { auth } from '@/auth';

/** Returns the Keycloak access token for the current server-side request. */
export async function getAccessToken(): Promise<string> {
  const session = await auth();
  if (!session?.accessToken) throw new Error('Not authenticated');
  return session.accessToken;
}

/** Returns the Keycloak realm roles for the current server-side request. */
export async function getRoles(): Promise<string[]> {
  const session = await auth();
  return (session?.user as { roles?: string[] })?.roles ?? [];
}

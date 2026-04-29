import NextAuth from 'next-auth';
import Keycloak from 'next-auth/providers/keycloak';

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    Keycloak({
      clientId: process.env.KEYCLOAK_CLIENT_ID!,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
      issuer: process.env.KEYCLOAK_ISSUER!,
      authorization: { params: { scope: 'openid email profile roles' } },
    }),
  ],
  callbacks: {
    jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token;
        // realm_access.roles is in the access token, not the ID token — decode it
        try {
          const payload = JSON.parse(
            Buffer.from(account.access_token!.split('.')[1], 'base64url').toString(),
          ) as { realm_access?: { roles?: string[] } };
          token.roles = payload?.realm_access?.roles ?? [];
        } catch {
          token.roles = [];
        }
        const prof = profile as { cooperative_id?: string };
        token.cooperativeId = prof?.cooperative_id ?? null;
      }
      return token;
    },
    session({ session, token }) {
      session.accessToken = token.accessToken as string;
      (session.user as { roles?: string[] }).roles = token.roles as string[];
      (session.user as { cooperativeId?: string | null }).cooperativeId =
        token.cooperativeId as string | null;
      return session;
    },
  },
});

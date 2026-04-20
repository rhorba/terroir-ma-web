import NextAuth from 'next-auth';
import Keycloak from 'next-auth/providers/keycloak';

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    Keycloak({
      clientId: process.env.KEYCLOAK_CLIENT_ID!,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
      issuer: process.env.KEYCLOAK_ISSUER!,
    }),
  ],
  callbacks: {
    jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token;
        const prof = profile as {
          realm_access?: { roles?: string[] };
          cooperative_id?: string;
        };
        token.roles = prof?.realm_access?.roles ?? [];
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

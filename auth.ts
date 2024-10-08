import NextAuth from "next-auth"
import Auth0 from "next-auth/providers/auth0"

interface Auth0ProfileRoles {
  roles: string[];
}
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Auth0],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        const Auth0ProfileRoles = profile?.['https://backend-api.com'] as Auth0ProfileRoles || { roles: [] };
        const userRole = Auth0ProfileRoles.roles;
        token.roles = userRole;
      }
      return token;
    },
    async session({ session, token }: { session: any, token: any }) {
      session.user.roles = token.roles;
      return session;
    },
    async authorized({ auth }: { auth: any }) {
      return !!auth && auth.user?.roles?.includes('ECOM_ADMIN_TEST');
    }
  }
})
import NextAuth from "next-auth"
import { JWT } from "next-auth/jwt"
import Auth0 from "next-auth/providers/auth0"
import { NAMESPACE } from "./lib/constant";

interface Auth0ProfileRoles {
  roles: string[];
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Auth0],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        const Auth0ProfileRoles = profile?.[NAMESPACE] as Auth0ProfileRoles || { roles: [] };
        const userRole = Auth0ProfileRoles.roles;
        token.roles = userRole;
      }
      return token;
    },
    async session({ session, token }: { session: any, token: JWT }) {
      session.user.roles = token.roles;
      return session;
    },
  }
})
import NextAuth from "next-auth"
import { JWT } from "next-auth/jwt"
import Auth0 from "next-auth/providers/auth0"
import { NAMESPACE, ROLE_HAVE_PERMISSION } from "./lib/constant";
import { NextRequest, NextResponse } from "next/server";

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
    async authorized({ request, auth }: { request: NextRequest, auth: any }) {
      if (auth) {
        if (auth?.user?.roles.includes(ROLE_HAVE_PERMISSION)) {
          return NextResponse.next();
        }
        return NextResponse.redirect(new URL('/no-permission', request.url));
      }
      return false;
    }
  }
})
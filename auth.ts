import NextAuth from "next-auth"
import { JWT } from "next-auth/jwt"
import Auth0 from "next-auth/providers/auth0"
import { ROLE_HAVE_PERMISSION, ROLES_CLAIM } from "./lib/constant";
import { NextRequest, NextResponse } from "next/server";

interface Auth0ProfileRoles {
  roles: string[];
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Auth0],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.roles = profile?.[ROLES_CLAIM];
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }: { session: any, token: JWT }) {
      session.user.roles = token.roles;
      session.accessToken = token.accessToken;
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
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';
import { ROLE_HAVE_PERMISSION, SIGN_IN_URL } from './lib/constant';

export default async function auth(req: NextRequest) {
  const authSecret = process.env.AUTH_SECRET || ""
  const token = await getToken({ req, secret: authSecret });

  if (!token) {
    return NextResponse.redirect(new URL(SIGN_IN_URL, req.url));
  }

  const userRoles: string[] = token.roles as string[] || [];
  if (!userRoles.includes(ROLE_HAVE_PERMISSION)) {
    return NextResponse.redirect(new URL('/no-permission', req.url));
  }

  return NextResponse.next();
}


export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|no-permission).*)"],
}

import type { Schema } from '@/amplify/data/resource'
import { generateServerClientUsingCookies } from '@aws-amplify/adapter-nextjs/data';
import { Amplify } from 'aws-amplify';
import outputs from "@/amplify_outputs.json";
import { cookies } from 'next/headers';
import { auth } from "@/auth"

Amplify.configure(outputs);

export const cookieBasedClient = generateServerClientUsingCookies<Schema>({
  config: outputs,
  cookies,
});

export async function getOIDCClient() {

  const session = await auth();

  return generateServerClientUsingCookies<Schema>({
    config: outputs,
    cookies,
    authMode: 'oidc',
    authToken: session?.accessToken,
  })

}

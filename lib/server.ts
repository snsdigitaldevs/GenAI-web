import type { Schema } from '@/amplify/data/resource'
import { generateServerClientUsingCookies } from '@aws-amplify/adapter-nextjs/data';
import { Amplify } from 'aws-amplify';
import outputs from "@/amplify_outputs.json";
import { cookies } from 'next/headers';

Amplify.configure(outputs);

export const cookieBasedClient = generateServerClientUsingCookies<Schema>({
  config: outputs,
  cookies,
});

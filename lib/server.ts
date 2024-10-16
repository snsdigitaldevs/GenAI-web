import type { Schema } from '@/amplify/data/resource'
import { generateServerClientUsingCookies, generateServerClientUsingReqRes } from '@aws-amplify/adapter-nextjs/data';
import { Amplify } from 'aws-amplify';
import outputs from "@/amplify_outputs.json";
import { auth } from "@/auth";

import { generateClient } from 'aws-amplify/data';


Amplify.configure(outputs, {
  ssr: true,
  Auth: {
    tokenProvider: {
      getTokens: async (forceRefresh) => {
        const session = await auth();
        return {
          accessToken: {
            payload: {},
            toString: () => session?.accessToken!,
          },
        }
      }
    }
  }
});

export const cookieBasedClient = generateClient<Schema>();


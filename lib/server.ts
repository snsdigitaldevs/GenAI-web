import {Amplify} from 'aws-amplify';
import {generateClient} from 'aws-amplify/data';
import outputs from "@/amplify_outputs.json";
import {auth} from "@/auth";
import type {Schema} from '@/amplify/data/resource'


Amplify.configure(outputs, {
  ssr: true,
  Auth: {
    tokenProvider: {
      getTokens: async (_) => {
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

export const dataClient = generateClient<Schema>({
  authMode: 'oidc'
});


import { a, defineData, type ClientSchema } from '@aws-amplify/backend';

const schema = a.schema({
  tasks: a.model({
      origin: a.string(),
      target: a.string(),
      status: a.string(),
    })
    .authorization(allow => [allow.publicApiKey()])
});

// Used for code completion / highlighting when making requests from frontend
export type Schema = ClientSchema<typeof schema>;

// defines the data resource to be deployed
export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: { expiresInDays: 30 }
  }
});
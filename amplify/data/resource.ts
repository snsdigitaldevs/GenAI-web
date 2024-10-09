import { a, defineData, type ClientSchema } from '@aws-amplify/backend';

const schema = a.schema({
  courses: a.model({
      origin: a.string(),
      target: a.string(),
      prompt: a.string(),
      description: a.string(),
  })
  .authorization(allow => [allow.publicApiKey()]),
  chats: a.model({
    chatId: a.string(),
    email: a.string(),
    messages: a.string().required(),
    title: a.string(),
    path: a.string(),
  })
  .authorization(allow => [allow.publicApiKey()]),
  resources: a.model({
    type: a.string(),
    index: a.integer(),
    text: a.string(),
  })
  .authorization(allow => [allow.publicApiKey()]),
  prompts: a.model({
    type: a.string(),
    text: a.string(),
  })
  .authorization(allow => [allow.publicApiKey()]),
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
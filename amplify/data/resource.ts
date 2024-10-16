import { a, defineData, type ClientSchema } from '@aws-amplify/backend';

const oidc_authz = (allow: any) => [allow.groups(['GenAI-ADMIN'], 'oidc').withClaimIn('https://pimslure.com/roles')]

const schema = a.schema({
  courses: a.model({
    origin: a.string(),
    target: a.string(),
    prompt: a.string(),
    description: a.string(),
    structure_vocabulary: a.string(),
  })
    .authorization(oidc_authz),
  chats: a.model({
    chatId: a.string(),
    email: a.string(),
    messages: a.string().required(),
    title: a.string(),
    path: a.string(),
  })
    .authorization(oidc_authz),
  resources: a.model({
    type: a.string(),
    index: a.integer(),
    text: a.string(),
  })
    .authorization(oidc_authz),
  prompts: a.model({
    type: a.string(),
    text: a.string(),
  })
    .authorization(oidc_authz),
  scripts: a.model({
    courseId: a.string(),
    lessonId: a.integer(),
    prompt: a.string(),
    text: a.string(),
  })
    .authorization(oidc_authz),
});

// Used for code completion / highlighting when making requests from frontend
export type Schema = ClientSchema<typeof schema>;

// defines the data resource to be deployed
export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'oidc',
    oidcAuthorizationMode: {
      oidcProviderName: 'auth0-dev',
      oidcIssuerUrl: 'https://mg2-ss-dev.auth0.com',
      clientId: 'qqFHt2X8ejE4IvTtXYjDQxHsLZvSkDKA',
      tokenExpiryFromAuthInSeconds: 0,
      tokenExpireFromIssueInSeconds: 0,
    },
  }
});
const schemaLoginGoogleVK = {
  type: 'object',
  properties: {
    userData: {
      type: 'object',
      properties: { email: { type: 'string' }, password: { type: 'string' } },
    },
    accessToken: { type: 'string' },
  },
};

const schemaLoginGoogleVKWithoutPassword = {
  type: 'object',
  properties: {
    userData: {
      type: 'object',
      properties: { email: { type: 'string' } },
    },
    accessToken: { type: 'string' },
  },
};

export { schemaLoginGoogleVK, schemaLoginGoogleVKWithoutPassword };

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

export { schemaLoginGoogleVK };

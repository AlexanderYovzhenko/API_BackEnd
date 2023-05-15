const schemaLoginGoogle = {
  type: 'object',
  properties: {
    user: {
      type: 'object',
      properties: { email: { type: 'string' }, password: { type: 'string' } },
    },
    accessToken: { type: 'string' },
  },
};

export { schemaLoginGoogle };

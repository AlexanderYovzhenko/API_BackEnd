const schemaError = {
  type: 'object',
  properties: {
    statusCode: { type: 'number' },
    timestamp: { type: 'string' },
    path: { type: 'string' },
    message: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    error: { type: 'string' },
  },
};

export { schemaError };

const schemaError = {
  type: 'object',
  properties: {
    statusCode: { type: 'number' },
    timestamp: { type: 'string' },
    path: { type: 'string' },
    message: { type: 'string' },
    error: { type: 'string' },
  },
};

export { schemaError };

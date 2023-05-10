const schemaRole = {
  type: 'object',
  properties: {
    role_id: { type: 'string' },
    value: { type: 'string' },
    description: { type: 'string' },
    users: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          user_id: { type: 'string' },
          email: { type: 'string' },
          profile: {
            type: 'object',
            properties: {
              profile_id: { type: 'string' },
              first_name: { type: 'string' },
              last_name: { type: 'string' },
            },
          },
        },
      },
    },
  },
};

const schemaUserRole = {
  type: 'object',
  properties: {
    user_id: { type: 'string' },
    role_id: { type: 'string' },
  },
};

export { schemaRole, schemaUserRole };

const schemaProfile = {
  type: 'object',
  properties: {
    user_id: { type: 'string' },
    email: { type: 'string' },
    password: { type: 'string' },
    createdAt: { type: 'string' },
    updatedAt: { type: 'string' },
    roles: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          role_id: { type: 'string' },
          value: { type: 'string' },
          description: { type: 'string' },
        },
      },
    },
    profile: {
      type: 'object',
      properties: {
        profile_id: { type: 'string' },
        first_name: { type: 'string' },
        last_name: { type: 'string' },
        phone: { type: 'string' },
        city: { type: 'string' },
        user_id: { type: 'string' },
      },
    },
  },
};

export { schemaProfile };

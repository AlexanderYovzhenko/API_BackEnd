const schemaComment = {
  type: 'object',
  properties: {
    comment_id: { type: 'string' },
    title: { type: 'string' || null },
    text: { type: 'string' },
    like: { type: 'string' },
    film_id: { type: 'string' || null },
    createdAt: { type: 'string' },
    updatedAt: { type: 'string' },
    user_id: { type: 'string' },
    parent_id: { type: 'string' || null },
    user: {
      type: 'object',
      properties: {
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
    sub_comment: {
      type: 'array',
      items: {
        type: 'object',
      },
    },
  },
};

export { schemaComment };

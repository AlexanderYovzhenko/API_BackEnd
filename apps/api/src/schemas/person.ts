const schemaPerson = {
  type: 'object',
  properties: {
    person_id: { type: 'string' },
    first_name_ru: { type: 'string' },
    last_name_ru: { type: 'string' },
    first_name_en: { type: 'string' },
    last_name_en: { type: 'string' },
    img: { type: 'string' },
    filmRoles: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          film_role_id: { type: 'string' },
          film_role: { type: 'string' },
          slug: { type: 'string' },
        },
      },
    },
    films: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          film_id: { type: 'string' },
        },
      },
    },
  },
};

export { schemaPerson };

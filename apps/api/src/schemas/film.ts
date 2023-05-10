const schemaFilm = {
  type: 'object',
  properties: {
    film_id: { type: 'string' },
    name_ru: { type: 'string' },
    name_en: { type: 'string' },
    description: { type: 'string' },
    year: { type: 'number' },
    rating: { type: 'number' },
    assessments: { type: 'number' },
    reviews: { type: 'number' },
    age_limit: { type: 'number' },
    duration: { type: 'number' },
    img: { type: 'string' },
    trailers: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          trailer_id: { type: 'string' },
          trailer: { type: 'string' },
          img: { type: 'string' },
          date: { type: 'string' },
        },
      },
    },
    genres: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          genre_id: { type: 'string' },
          genre_ru: { type: 'string' },
          genre_en: { type: 'string' },
          slug: { type: 'string' },
        },
      },
    },
    qualities: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          quality_id: { type: 'string' },
          quality: { type: 'string' },
        },
      },
    },
    languagesAudio: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          language_id: { type: 'string' },
          language: { type: 'string' },
          slug: { type: 'string' },
        },
      },
    },
    languagesSubtitle: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          language_id: { type: 'string' },
          language: { type: 'string' },
          slug: { type: 'string' },
        },
      },
    },
    countries: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          country_id: { type: 'string' },
          country: { type: 'string' },
          slug: { type: 'string' },
        },
      },
    },
  },
};

export { schemaFilm };

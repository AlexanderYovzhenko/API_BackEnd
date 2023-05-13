export const filmStub = () => {
  return {
    film_id: '7982ecf2-8fae-471c-8ddf-2e3cbdab360e',
    name_ru: 'Симпсоны',
    name_en: 'Simpsons',
    description: 'animation film simpsons',
    year: 2005,
    rating: 8.3,
    assessments: 30255,
    reviews: 5077,
    age_limit: 10,
    duration: 117,
    img: 'https://example.com/film.jpg',
    trailers: [
      {
        trailer_id: '1982ecf2-8fae-471c-8ddf-2e3cbdab360e',
        trailer: 'https://example.com/trailer1.mp4',
        img: 'https://example.com/trailer1.jpg',
        date: '2021-01-01',
      },
    ],
    genres: [
      {
        genre_id: '2982ecf2-8fae-471c-8ddf-2e3cbdab360e',
        genre_ru: 'комедия',
        genre_en: 'comedy',
        slug: 'comedy',
      },
    ],
    qualities: [
      { quality_id: '3982ecf2-8fae-471c-8ddf-2e3cbdab360e', quality: '2K' },
    ],
    languagesAudio: [
      {
        language_id: '4982ecf2-8fae-471c-8ddf-2e3cbdab360e',
        language: 'русский',
        slug: 'russian',
      },
    ],
    languagesSubtitle: [
      {
        language_id: '5982ecf2-8fae-471c-8ddf-2e3cbdab360e',
        language: 'русские',
        slug: 'russians',
      },
    ],
    countries: [
      {
        country_id: '6982ecf2-8fae-471c-8ddf-2e3cbdab360e',
        country: 'США',
        slug: 'usa',
      },
    ],
  };
};

export const filmCrateStub = () => {
  return {
    name_ru: 'Симпсоны',
    name_en: 'Simpsons',
    description: 'animation film simpsons',
    year: 2005,
    country: 'США',
    rating: 8.3,
    assessments: 30255,
    reviews: 5077,
    age_limit: 10,
    duration: 117,
    img: 'https://example.com/film.jpg',
    qualities: ['2K, HD'],
    trailers: [
      {
        trailer: 'https://example.com/trailer1.mp4',
        img: 'https://example.com/trailer1.jpg',
        date: '2021-01-01',
      },
    ],
    languagesAudio: ['русский'],
    languagesSubtitle: ['русские'],
    genres: [{ genre_ru: 'комедия', genre_en: 'comedy', slug: 'comedy' }],
  };
};

export const filmQueryStub = () => {
  return {
    genres: ['comedy'],
    countries: ['usa'],
    year: '2005',
    year_min: '2000',
    year_max: '2007',
    rating: '8.3',
    assessments: '30255',
    filmmaker: ['Alex', 'Bill'],
    actor: ['Bob', 'Malkov'],
    limit: '1',
  };
};

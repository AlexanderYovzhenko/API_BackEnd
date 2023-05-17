export const filmStub = () => {
  return {
    name_ru: 'Титаник',
    name_en: 'Titanic',
    description: 'Описание фильма, любой текст',
    year: 2020,
    country: 'США',
    rating: 8,
    assessments: 30000,
    reviews: 2000,
    age_limit: 16,
    duration: 195,
    img: '//avatars.mds.yandex.net/get-kinopoisk-image/1599028/4057c4b8-8208-4a04-b169-26b0661453e3/300x450',
    qualities: ['2K', 'FullHD', 'HD', '1080', '720', '5.1'],
    trailers: [
      {
        trailer: 'https://www.kinopoisk.ru/film/535341/video/62802/',
        img: '//avatars.mds.yandex.net/get-kino-vod-films-gallery/1668876/a345b127722243984f01ef6504c9a477/100x64_3',
        date: '18 января 2023',
      },
    ],
    languagesAudio: ['русский', 'английский'],
    languagesSubtitle: ['русский', 'английский'],
    genres: [
      {
        genre_ru: 'драма',
        genre_en: 'drama',
        slug: 'drama',
      },
      {
        genre_ru: 'комедия',
        genre_en: 'comedy',
        slug: 'comedia',
      },
    ],
  };
};

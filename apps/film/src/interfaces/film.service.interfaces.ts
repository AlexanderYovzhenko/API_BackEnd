export interface IQueryParamsFilter {
  genres?: string[];
  country?: string;
  year?: string;
  rating?: string;
  assessments?: string;
  film_maker?: string[];
  actor?: string[];
}

export interface ICreateFilm {
  name_ru: string;
  name_en: string;
  description: string;
  year: number;
  country: string;
  rating: number;
  assessments: number;
  reviews: number;
  age_limit: number;
  duration: number;
  img: string;
  qualities: string[];
  trailers: [{ trailer: string; img: string }];
  languagesAudio: string[];
  languagesSubtitle: string[];
  genres: [{ genre_ru: string; genre_en: string; slug: string }];
}

export interface IUpdateGenre {
  genre_id: string;
  genre_ru: string;
  genre_en: string;
  slug: string;
}

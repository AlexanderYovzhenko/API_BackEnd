import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Repository } from 'sequelize-typescript';
import { Op } from 'sequelize';
import { v4 as uuid } from 'uuid';
import {
  Country,
  Film,
  FilmCountry,
  FilmGenre,
  FilmLanguageAudio,
  FilmLanguageSubtitle,
  FilmQuality,
  Genre,
  Language,
  Quality,
  Trailer,
} from './entities';
import { firstValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import {
  ICreateFilm,
  IQueryParamsFilter,
  IUpdateGenre,
} from './interfaces/film.service.interfaces';
import sequelize from 'sequelize';
import { slugify } from 'transliteration';

@Injectable()
export class FilmService {
  constructor(
    @InjectModel(Film) private filmRepository: Repository<Film>,
    @InjectModel(Trailer) private trailerRepository: Repository<Trailer>,
    @InjectModel(Quality) private qualityRepository: Repository<Quality>,
    @InjectModel(FilmQuality)
    private filmQualityRepository: Repository<FilmQuality>,
    @InjectModel(Language) private languageRepository: Repository<Language>,
    @InjectModel(FilmLanguageAudio)
    private languageAudioRepository: Repository<FilmLanguageAudio>,
    @InjectModel(FilmLanguageSubtitle)
    private languageSubtitleRepository: Repository<FilmLanguageSubtitle>,
    @InjectModel(Genre) private genreRepository: Repository<Genre>,
    @InjectModel(FilmGenre) private filmGenreRepository: Repository<FilmGenre>,
    @InjectModel(Country) private countryRepository: Repository<Country>,
    @InjectModel(FilmCountry)
    private filmCountryRepository: Repository<FilmCountry>,
    @Inject('PERSON_SERVICE') private readonly personService: ClientProxy,
  ) {}

  generateUUID(): string {
    return uuid();
  }

  // FILMS  -------------------------------------------------------------

  async getFilm(film_id: string) {
    const film = await this.filmRepository.findOne({
      where: { film_id },
      include: [
        {
          model: Trailer,
          attributes: ['trailer_id', 'trailer', 'img', 'date'],
        },
        {
          model: Genre,
          attributes: ['genre_id', 'genre_ru', 'genre_en', 'slug'],
          through: {
            attributes: [],
          },
        },
        {
          model: Quality,
          attributes: ['quality_id', 'quality'],
          through: {
            attributes: [],
          },
        },
        {
          model: Language,
          as: 'languagesAudio',
          attributes: ['language_id', 'language'],
          through: {
            attributes: [],
          },
        },
        {
          model: Language,
          as: 'languagesSubtitle',
          attributes: ['language_id', 'language'],
          through: {
            attributes: [],
          },
        },
        { all: true },
      ],
    });

    if (!film) {
      return null;
    }

    return film;
  }

  async getAllFilms(queryLimit: { limit: string }) {
    const { limit } = queryLimit;

    const films = await this.filmRepository.findAll({
      include: [
        {
          model: Trailer,
          attributes: ['trailer_id', 'trailer', 'img', 'date'],
        },
        {
          model: Genre,
          attributes: ['genre_id', 'genre_ru', 'genre_en', 'slug'],
          through: {
            attributes: [],
          },
        },
        {
          model: Quality,
          attributes: ['quality_id', 'quality'],
          through: {
            attributes: [],
          },
        },
        {
          model: Language,
          as: 'languagesAudio',
          attributes: ['language_id', 'language'],
          through: {
            attributes: [],
          },
        },
        {
          model: Language,
          as: 'languagesSubtitle',
          attributes: ['language_id', 'language'],
          through: {
            attributes: [],
          },
        },
        { all: true },
      ],
      limit: limit ? +limit : 100,
    });

    return films;
  }

  async getFilmsById(filmsId: { films: string[] }) {
    const { films } = filmsId;

    const filmsById = await this.filmRepository.findAll({
      where: { film_id: films },
      include: [
        {
          model: Trailer,
          attributes: ['trailer_id', 'trailer', 'img', 'date'],
        },
        {
          model: Genre,
          attributes: ['genre_id', 'genre_ru', 'genre_en', 'slug'],
          through: {
            attributes: [],
          },
        },
        {
          model: Quality,
          attributes: ['quality_id', 'quality'],
          through: {
            attributes: [],
          },
        },
        {
          model: Language,
          as: 'languagesAudio',
          attributes: ['language_id', 'language'],
          through: {
            attributes: [],
          },
        },
        {
          model: Language,
          as: 'languagesSubtitle',
          attributes: ['language_id', 'language'],
          through: {
            attributes: [],
          },
        },
        { all: true },
      ],
    });

    return filmsById;
  }

  async getFilmsByName(queryName: { name: string }) {
    const { name } = queryName;
    const lowerName = name.toLowerCase();

    const filmsByName = await this.filmRepository.findAll({
      where: {
        [Op.or]: [
          sequelize.where(sequelize.fn('LOWER', sequelize.col('name_ru')), {
            [Op.substring]: lowerName,
          }),

          sequelize.where(sequelize.fn('LOWER', sequelize.col('name_en')), {
            [Op.substring]: lowerName,
          }),
        ],
      },
      include: [
        {
          model: Trailer,
          attributes: ['trailer_id', 'trailer', 'img', 'date'],
        },
        {
          model: Genre,
          attributes: ['genre_id', 'genre_ru', 'genre_en', 'slug'],
          through: {
            attributes: [],
          },
        },
        {
          model: Quality,
          attributes: ['quality_id', 'quality'],
          through: {
            attributes: [],
          },
        },
        {
          model: Language,
          as: 'languagesAudio',
          attributes: ['language_id', 'language'],
          through: {
            attributes: [],
          },
        },
        {
          model: Language,
          as: 'languagesSubtitle',
          attributes: ['language_id', 'language'],
          through: {
            attributes: [],
          },
        },
        { all: true },
      ],
    });

    return filmsByName;
  }

  async getFilteredFilms(query: IQueryParamsFilter) {
    const {
      genres,
      country,
      year,
      rating,
      assessments,
      rezhisser,
      aktyor,
      limit,
    } = query;

    const filteredFilms = await this.filmRepository.findAll({
      // where: {
      //   [Op.and]: [
      //     country
      //       ? sequelize.where(sequelize.fn('LOWER', sequelize.col('country')), {
      //           [Op.substring]: country.toLowerCase(),
      //         })
      //       : { country: { [Op.notLike]: '' } },
      //     { year: year || { [Op.ne]: 0 } },
      //     { rating: rating ? { [Op.gte]: +rating } : { [Op.gte]: 0 } },
      //     {
      //       assessments: assessments
      //         ? { [Op.gte]: +assessments }
      //         : { [Op.gte]: 0 },
      //     },
      //   ],
      // },
      include: [
        {
          model: Trailer,
          attributes: ['trailer_id', 'trailer', 'img', 'date'],
        },
        {
          model: Genre,
          where: {
            [Op.or]: [
              { genre_ru: genres || { [Op.notLike]: '' } },
              { genre_en: genres || { [Op.notLike]: '' } },
              { slug: genres || { [Op.notLike]: '' } },
            ],
          },
          attributes: ['genre_id', 'genre_ru', 'genre_en', 'slug'],
          through: {
            attributes: [],
          },
        },
        {
          model: Quality,
          attributes: ['quality_id', 'quality'],
          through: {
            attributes: [],
          },
        },
        {
          model: Language,
          as: 'languagesAudio',
          attributes: ['language_id', 'language'],
          through: {
            attributes: [],
          },
        },
        {
          model: Language,
          as: 'languagesSubtitle',
          attributes: ['language_id', 'language'],
          through: {
            attributes: [],
          },
        },
        { all: true },
      ],
    });

    const filmsFilmMaker = rezhisser
      ? await firstValueFrom(
          this.personService.send(
            {
              cmd: 'get_films_by_person',
            },
            {
              first_name: rezhisser[0],
              last_name: rezhisser[1],
              film_role: 'режиссер',
            },
          ),
        )
      : null;

    const filmsIdFilmMaker = filmsFilmMaker
      ? filmsFilmMaker.films.map((film: { film_id: string }) => film.film_id)
      : [];

    const filmsActor = aktyor
      ? await firstValueFrom(
          this.personService.send(
            {
              cmd: 'get_films_by_person',
            },
            {
              first_name: aktyor[0],
              last_name: aktyor[1],
              film_role: 'актёр',
            },
          ),
        )
      : null;

    const filmsIdActor = filmsActor
      ? filmsActor.films.map((film: { film_id: string }) => film.film_id)
      : [];

    let result = filteredFilms;

    if (rezhisser) {
      result = result.filter((film) => filmsIdFilmMaker.includes(film.film_id));
    }

    if (aktyor) {
      result = result.filter((film) => filmsIdActor.includes(film.film_id));
    }

    const limitFilm = limit ? +limit : 100;

    return result.slice(0, limitFilm);
  }

  async addFilm(film: ICreateFilm) {
    const checkFilm = await this.filmRepository.findOne({
      where: { name_ru: film.name_ru, year: film.year },
    });

    if (checkFilm) {
      console.log(!!checkFilm);

      return null;
    }

    const film_id: string = this.generateUUID();

    await this.filmRepository.create({ film_id, ...film });

    const {
      country,
      qualities,
      trailers,
      languagesAudio,
      languagesSubtitle,
      genres,
    } = film;

    const checkCountry = await this.countryRepository.findOrCreate({
      where: {
        country,
      },
      defaults: {
        country_id: this.generateUUID(),
        country,
        slug: slugify(country),
      },
    });

    const { country_id } = checkCountry[0];

    await this.filmCountryRepository.create({
      film_country_id: this.generateUUID(),
      film_id,
      country_id,
    });

    qualities.forEach(async (quality: string) => {
      const checkQuality = await this.qualityRepository.findOrCreate({
        where: { quality },
        defaults: {
          quality_id: this.generateUUID(),
          quality,
        },
      });

      const { quality_id } = checkQuality[0];

      await this.filmQualityRepository.create({
        film_quality_id: this.generateUUID(),
        film_id,
        quality_id,
      });
    });

    trailers.forEach(async (trailer) => {
      await this.trailerRepository.create({
        trailer_id: this.generateUUID(),
        trailer: trailer.trailer || '',
        img: trailer.img || '',
        date: trailer.date || '',
        film_id,
      });
    });

    languagesAudio.forEach(async (language: string) => {
      const checkLanguage = await this.languageRepository.findOrCreate({
        where: { language },
        defaults: {
          language_id: this.generateUUID(),
          language,
          slug: slugify(language),
        },
      });

      const { language_id } = checkLanguage[0];

      await this.languageAudioRepository.create({
        film_language_audio_id: this.generateUUID(),
        film_id,
        language_id,
      });
    });

    languagesSubtitle.forEach(async (language: string) => {
      const checkLanguage = await this.languageRepository.findOrCreate({
        where: { language },
        defaults: {
          language_id: this.generateUUID(),
          language,
          slug: slugify(language),
        },
      });

      const { language_id } = checkLanguage[0];

      await this.languageSubtitleRepository.create({
        film_language_subtitle_id: this.generateUUID(),
        film_id,
        language_id,
      });
    });

    genres.forEach(async (genreData) => {
      const { genre_ru, genre_en, slug } = genreData;

      const checkGenre = await this.genreRepository.findOrCreate({
        where: {
          genre_ru,
        },
        defaults: {
          genre_id: this.generateUUID(),
          genre_ru,
          genre_en,
          slug,
        },
      });

      const { genre_id } = checkGenre[0];

      await this.filmGenreRepository.create({
        film_genre_id: this.generateUUID(),
        film_id,
        genre_id,
      });
    });

    return { film_id, ...film };
  }

  async updateFilm(film_id: string, name_ru: string, name_en: string) {
    await this.filmRepository.update(
      { name_ru, name_en },
      { where: { film_id } },
    );

    const updateFilm = await this.getFilm(film_id);

    return updateFilm;
  }

  async deleteFilm(film_id: string) {
    const checkFilm = await this.getFilm(film_id);

    if (!checkFilm) {
      return null;
    }

    await this.filmRepository.destroy({
      where: { film_id },
      force: true,
    });

    return checkFilm;
  }

  // COUNTRIES  -------------------------------------------------------------

  async getAllCountries() {
    const countries = await this.filmRepository.findAll({
      attributes: [[sequelize.literal('DISTINCT "country"'), 'country']],
    });

    return countries;
  }

  async getCountriesByName(queryCountry: { country: string }) {
    const { country } = queryCountry;

    const countries = await this.filmRepository.findAll({
      attributes: [[sequelize.literal('DISTINCT "country"'), 'country']],

      where: sequelize.where(sequelize.fn('LOWER', sequelize.col('country')), {
        [Op.substring]: country.toLowerCase(),
      }),
    });

    return countries;
  }

  // GENRES  -------------------------------------------------------------

  async getGenre(genre_id: string) {
    const genre = await this.genreRepository.findOne({
      where: { genre_id },
      include: {
        through: {
          attributes: [],
        },
        all: true,
      },
    });

    if (!genre) {
      return null;
    }

    return genre;
  }

  async getAllGenres(queryLimit: { limit: string }) {
    const { limit } = queryLimit;

    const genres = await this.genreRepository.findAll({
      limit: limit ? +limit : 100,
    });

    return genres;
  }

  async updateGenre(data: IUpdateGenre) {
    const { genre_id, genre_ru, genre_en, slug } = data;

    await this.genreRepository.update(
      { genre_ru, genre_en, slug },
      { where: { genre_id } },
    );

    const updateFilm = await this.getGenre(genre_id);

    return updateFilm;
  }
}

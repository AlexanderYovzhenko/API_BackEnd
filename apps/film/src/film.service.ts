import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Repository } from 'sequelize-typescript';
import { Op } from 'sequelize';
import { v4 as uuid } from 'uuid';
import {
  Film,
  FilmGenre,
  FilmLanguageAudio,
  FilmLanguageSubtitle,
  Genre,
  Language,
  Trailer,
} from './entities';

@Injectable()
export class FilmService {
  constructor(
    @InjectModel(Film) private filmRepository: Repository<Film>,
    @InjectModel(Trailer) private trailerRepository: Repository<Trailer>,
    @InjectModel(Language) private languageRepository: Repository<Language>,
    @InjectModel(FilmLanguageAudio)
    private languageAudioRepository: Repository<FilmLanguageAudio>,
    @InjectModel(FilmLanguageSubtitle)
    private languageSubtitleRepository: Repository<FilmLanguageSubtitle>,
    @InjectModel(Genre) private genreRepository: Repository<Genre>,
    @InjectModel(FilmGenre) private filmGenreRepository: Repository<FilmGenre>,
  ) {}

  generateUUID(): string {
    return uuid();
  }

  async getFilm(film_id: string) {
    const film = await this.filmRepository.findOne({
      where: { film_id },
      include: { all: true },
    });

    if (!film) {
      return null;
    }

    return film;
  }

  async getAllFilms() {
    const films = await this.filmRepository.findAll({
      include: [
        { model: Trailer, attributes: ['trailer'] },
        {
          model: Genre,
          attributes: ['genre_ru', 'genre_en'],
          through: {
            attributes: [],
          },
        },
        {
          model: Language,
          as: 'languagesAudio',
          attributes: ['language'],
          through: {
            attributes: [],
          },
        },
        {
          model: Language,
          as: 'languagesSubtitle',
          attributes: ['language'],
          through: {
            attributes: [],
          },
        },
        { all: true },
      ],
    });

    return films;
  }

  async getFilteredFilms(query: {
    genres?: string[];
    country?: string;
    year?: string;
    rating?: string;
    assessments?: string;
    film_maker?: string;
    actor?: string;
  }) {
    const { genres, country, year, rating, assessments, film_maker, actor } =
      query;

    const filteredFilms = await this.filmRepository.findAll({
      where: {
        country: country || { [Op.notLike]: '' },
        year: year || { [Op.ne]: 0 },
        rating: rating ? { [Op.gte]: +rating } : { [Op.gte]: 0 },
        assessments: assessments ? { [Op.gte]: +assessments } : { [Op.gte]: 0 },
      },
      include: [
        { model: Trailer, attributes: ['trailer'] },
        {
          model: Genre,
          where: { genre_ru: genres || { [Op.notLike]: '' } },
          attributes: ['genre_ru', 'genre_en'],
          through: {
            attributes: [],
          },
        },
        {
          model: Language,
          as: 'languagesAudio',
          attributes: ['language'],
          through: {
            attributes: [],
          },
        },
        {
          model: Language,
          as: 'languagesSubtitle',
          attributes: ['language'],
          through: {
            attributes: [],
          },
        },
        { all: true },
      ],
    });

    return filteredFilms;
  }

  async addFilm(film: Record<string | number, string[]>) {
    const film_id: string = this.generateUUID();

    await this.languageRepository.findOrCreate({
      where: { language: 'рус' },
    });

    await this.languageRepository.findOrCreate({
      where: { language: 'eng' },
    });

    const newFilm = await this.filmRepository.create({ film_id, ...film });

    const { trailers, languagesAudio, languagesSubtitle, genres } = film;

    trailers.forEach(async (trailer: string) => {
      await this.trailerRepository.create({
        trailer_id: this.generateUUID(),
        trailer,
        film_id: newFilm.film_id,
      });
    });

    languagesAudio.forEach(async (language: string) => {
      const checkLanguage = await this.languageRepository.findOne({
        where: { language },
      });

      await this.languageAudioRepository.create({
        film_id: newFilm.film_id,
        language_id: checkLanguage.language_id,
      });
    });

    languagesSubtitle.forEach(async (language: string) => {
      const checkLanguage = await this.languageRepository.findOne({
        where: { language },
      });

      await this.languageSubtitleRepository.create({
        film_id: newFilm.film_id,
        language_id: checkLanguage.language_id,
      });
    });

    genres.forEach(async (genre_ru: string) => {
      const genre = await this.genreRepository.findOrCreate({
        where: {
          genre_ru,
        },
        defaults: {
          genre_ru,
          genre_en: '',
        },
      });

      const { genre_id } = genre[0];

      await this.filmGenreRepository.create({
        film_id: newFilm.film_id,
        genre_id: genre_id,
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

  async getGenre(genre_id: number) {
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

  async getAllGenres() {
    const genres = await this.genreRepository.findAll();

    return genres;
  }

  async updateGenre(genre_id: number, genre_ru: string, genre_en: string) {
    await this.genreRepository.update(
      { genre_ru, genre_en },
      { where: { genre_id } },
    );

    const updateFilm = await this.getGenre(genre_id);

    return updateFilm;
  }
}

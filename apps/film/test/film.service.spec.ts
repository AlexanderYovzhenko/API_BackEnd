import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { FilmService } from '../src/film.service';
import {
  mockCountryRepository,
  mockFilmCountryRepository,
  mockFilmGenreRepository,
  mockFilmQualityRepository,
  mockFilmRepository,
  mockGenreRepository,
  mockLanguageAudioRepository,
  mockLanguageRepository,
  mockLanguageSubtitleRepository,
  mockPersonService,
  mockQualityRepository,
  mockTrailerRepository,
} from './mocks';
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
} from '../src/entities';
import { filmStub, filmCrateStub, filmQueryStub } from './stubs/film.stub';
import { countryStub } from './stubs/country.stub';
import { genreStub } from './stubs/genre.stub';

describe('FilmService', () => {
  let filmService: FilmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmService,
        {
          provide: getModelToken(Film),
          useValue: mockFilmRepository,
        },
        {
          provide: getModelToken(Trailer),
          useValue: mockTrailerRepository,
        },
        {
          provide: getModelToken(Quality),
          useValue: mockQualityRepository,
        },
        {
          provide: getModelToken(FilmQuality),
          useValue: mockFilmQualityRepository,
        },
        {
          provide: getModelToken(Language),
          useValue: mockLanguageRepository,
        },
        {
          provide: getModelToken(FilmLanguageAudio),
          useValue: mockLanguageAudioRepository,
        },
        {
          provide: getModelToken(FilmLanguageSubtitle),
          useValue: mockLanguageSubtitleRepository,
        },
        {
          provide: getModelToken(Genre),
          useValue: mockGenreRepository,
        },
        {
          provide: getModelToken(FilmGenre),
          useValue: mockFilmGenreRepository,
        },
        {
          provide: getModelToken(Country),
          useValue: mockCountryRepository,
        },
        {
          provide: getModelToken(FilmCountry),
          useValue: mockFilmCountryRepository,
        },
        {
          provide: 'PERSON_SERVICE',
          useValue: mockPersonService,
        },
      ],
    }).compile();

    filmService = module.get<FilmService>(FilmService);
  });

  it('should be defined', () => {
    expect(filmService).toBeDefined();
  });

  describe('getFilm', () => {
    it('should be defined', async () => {
      expect(await filmService.getFilm(filmStub().film_id)).toBeDefined();
    });

    it('should be return a film by id', async () => {
      expect(await filmService.getFilm(filmStub().film_id)).toEqual(filmStub());
    });

    it('should be return null', async () => {
      expect(await filmService.getFilm('123')).toEqual(null);
    });
  });

  describe('getAllFilms', () => {
    it('should be defined', async () => {
      expect(await filmService.getAllFilms({ limit: '1' })).toBeDefined();
    });

    it('should be return array all films', async () => {
      expect(await filmService.getAllFilms({ limit: '1' })).toEqual([
        filmStub(),
      ]);
    });
  });

  describe('getFilmsById', () => {
    it('should be defined', async () => {
      expect(
        await filmService.getFilmsById({ films: [filmStub().film_id] }),
      ).toBeDefined();
    });

    it('should be return array films by id', async () => {
      expect(
        await filmService.getFilmsById({ films: [filmStub().film_id] }),
      ).toEqual([filmStub()]);
    });
  });

  describe('getFilmsByName', () => {
    it('should be defined', async () => {
      expect(
        await filmService.getFilmsByName({ name: 'Simpsons' }),
      ).toBeDefined();
    });

    it('should be return array films by name', async () => {
      expect(await filmService.getFilmsByName({ name: 'Simpsons' })).toEqual([
        filmStub(),
      ]);
    });
  });

  describe('getFilteredFilms', () => {
    it('should be defined', async () => {
      expect(await filmService.getFilteredFilms(filmQueryStub())).toBeDefined();
    });

    it('should be return array filtered films', async () => {
      expect(await filmService.getFilteredFilms(filmQueryStub())).toEqual([
        filmStub(),
      ]);
    });
  });

  describe('addFilm', () => {
    it('should be defined', async () => {
      expect(await filmService.addFilm(filmCrateStub())).toBeDefined();
    });

    it('should be return null', async () => {
      expect(await filmService.addFilm(filmCrateStub())).toEqual(null);
    });

    it('should be return null', async () => {
      expect(
        await filmService.addFilm({
          ...filmCrateStub(),
          name_ru: 'Один дома',
        }),
      ).toEqual(null);
    });
  });

  describe('updateFilm', () => {
    it('should be defined', async () => {
      expect(
        await filmService.updateFilm(
          filmStub().film_id,
          filmStub().name_ru,
          filmStub().name_en,
        ),
      ).toBeDefined();
    });

    it('should be return null', async () => {
      expect(
        await filmService.updateFilm(
          '123',
          filmStub().name_ru,
          filmStub().name_en,
        ),
      ).toEqual(null);
    });

    it('should be return update film', async () => {
      expect(
        await filmService.updateFilm(
          filmStub().film_id,
          filmStub().name_ru,
          filmStub().name_en,
        ),
      ).toEqual(filmStub());
    });
  });

  describe('deleteFilm', () => {
    it('should be defined', async () => {
      expect(await filmService.deleteFilm(filmStub().film_id)).toBeDefined();
    });

    it('should be return null', async () => {
      expect(await filmService.deleteFilm('123')).toEqual(null);
    });

    it('should be return deleted film', async () => {
      expect(await filmService.deleteFilm(filmStub().film_id)).toEqual(
        filmStub(),
      );
    });
  });

  describe('getAllCountries', () => {
    it('should be defined', async () => {
      expect(await filmService.getAllCountries()).toBeDefined();
    });

    it('should be return array all countries', async () => {
      expect(await filmService.getAllCountries()).toEqual([countryStub()]);
    });
  });

  describe('getCountriesByName', () => {
    it('should be defined', async () => {
      expect(
        await filmService.getCountriesByName({ country: 'usa' }),
      ).toBeDefined();
    });

    it('should be return array countries by name', async () => {
      expect(await filmService.getCountriesByName({ country: 'usa' })).toEqual([
        countryStub(),
      ]);
    });
  });

  describe('getGenre', () => {
    it('should be defined', async () => {
      expect(await filmService.getGenre(genreStub().genre_id)).toBeDefined();
    });

    it('should be return null', async () => {
      expect(await filmService.getGenre('123')).toEqual(null);
    });

    it('should be return genre by id', async () => {
      expect(await filmService.getGenre(genreStub().genre_id)).toEqual(
        genreStub(),
      );
    });
  });

  describe('getAllGenres', () => {
    it('should be defined', async () => {
      expect(await filmService.getAllGenres({ limit: '1' })).toBeDefined();
    });

    it('should be return array all genres', async () => {
      expect(await filmService.getAllGenres({ limit: '1' })).toEqual([
        genreStub(),
      ]);
    });
  });

  describe('updateGenre', () => {
    it('should be defined', async () => {
      expect(await filmService.updateGenre(genreStub())).toBeDefined();
    });

    it('should be return null', async () => {
      expect(
        await filmService.updateGenre({ ...genreStub(), genre_id: '123' }),
      ).toEqual(null);
    });

    it('should be return update genre', async () => {
      expect(await filmService.updateGenre(genreStub())).toEqual(genreStub());
    });
  });
});

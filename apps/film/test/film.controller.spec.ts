import { Test, TestingModule } from '@nestjs/testing';
import { FilmController } from '../src/film.controller';
import { FilmService } from '../src/film.service';
import { SharedService } from '@app/shared';
import { ConfigService } from '@nestjs/config';
import { RmqContext } from '@nestjs/microservices';
import { context, mockFilmService, mockSharedService } from './mocks';
import { filmCrateStub, filmQueryStub, filmStub } from './stubs/film.stub';
import { countryStub } from './stubs/country.stub';
import { genreStub } from './stubs/genre.stub';

describe('FilmController', () => {
  let filmController: FilmController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmController],
      providers: [
        FilmService,
        {
          provide: FilmService,
          useValue: mockFilmService,
        },
        {
          provide: 'SharedServiceInterface',
          useClass: SharedService,
        },
        {
          provide: SharedService,
          useValue: mockSharedService,
        },
        {
          provide: ConfigService,
          useValue: {
            get(): string {
              return 'mock-value';
            },
          },
        },
      ],
    }).compile();

    filmController = module.get<FilmController>(FilmController);
  });

  it('should be defined', () => {
    expect(filmController).toBeDefined();
  });

  describe('addFilm', () => {
    it('should be defined', async () => {
      return expect(
        await filmController.addFilm(context as RmqContext, filmCrateStub()),
      ).toBeDefined();
    });

    it('should return a film', async () => {
      const result = await filmController.addFilm(
        context as RmqContext,
        filmCrateStub(),
      );

      expect(result).toEqual(filmStub());
    });
  });

  describe('getFilm', () => {
    it('should be defined', async () => {
      return expect(
        await filmController.getFilm(context as RmqContext, filmStub().film_id),
      ).toBeDefined();
    });

    it('should return a film', async () => {
      const result = await filmController.getFilm(
        context as RmqContext,
        filmStub().film_id,
      );

      expect(result).toEqual(filmStub());
    });
  });

  describe('getAllFilms', () => {
    it('should be defined', async () => {
      return expect(
        await filmController.getAllFilms(context as RmqContext, { limit: '1' }),
      ).toBeDefined();
    });

    it('should return array films', async () => {
      const result = await filmController.getAllFilms(context as RmqContext, {
        limit: '1',
      });

      expect(result).toEqual([filmStub()]);
    });
  });

  describe('getFilmsById', () => {
    it('should be defined', async () => {
      return expect(
        await filmController.getFilmsById(context as RmqContext, {
          films: [filmStub().film_id],
        }),
      ).toBeDefined();
    });

    it('should return array films', async () => {
      const result = await filmController.getFilmsById(context as RmqContext, {
        films: [filmStub().film_id],
      });

      expect(result).toEqual([filmStub()]);
    });
  });

  describe('getFilmsByName', () => {
    it('should be defined', async () => {
      return expect(
        await filmController.getFilmsByName(context as RmqContext, {
          name: 'Simpsons',
        }),
      ).toBeDefined();
    });

    it('should return array films', async () => {
      const result = await filmController.getFilmsByName(
        context as RmqContext,
        { name: 'Simpsons' },
      );

      expect(result).toEqual([filmStub()]);
    });
  });

  describe('getFilteredFilms', () => {
    it('should be defined', async () => {
      return expect(
        await filmController.getFilteredFilms(
          context as RmqContext,
          filmQueryStub(),
        ),
      ).toBeDefined();
    });

    it('should return array films', async () => {
      const result = await filmController.getFilteredFilms(
        context as RmqContext,
        filmQueryStub(),
      );

      expect(result).toEqual([filmStub()]);
    });
  });

  describe('updateFilm', () => {
    it('should be defined', async () => {
      return expect(
        await filmController.updateFilm(context as RmqContext, {
          film_id: filmStub().film_id,
          name_ru: filmStub().name_ru,
          name_en: filmStub().name_en,
        }),
      ).toBeDefined();
    });

    it('should return a film', async () => {
      const result = await filmController.updateFilm(context as RmqContext, {
        film_id: filmStub().film_id,
        name_ru: filmStub().name_ru,
        name_en: filmStub().name_en,
      });

      expect(result).toEqual(filmStub());
    });
  });

  describe('deleteFilm', () => {
    it('should be defined', async () => {
      return expect(
        await filmController.deleteFilm(
          context as RmqContext,
          filmStub().film_id,
        ),
      ).toBeDefined();
    });

    it('should return a film', async () => {
      const result = await filmController.deleteFilm(
        context as RmqContext,
        filmStub().film_id,
      );

      expect(result).toEqual(filmStub());
    });
  });

  describe('getAllCountries', () => {
    it('should be defined', async () => {
      return expect(
        await filmController.getAllCountries(context as RmqContext),
      ).toBeDefined();
    });

    it('should return countries', async () => {
      const result = await filmController.getAllCountries(
        context as RmqContext,
      );

      expect(result).toEqual([countryStub()]);
    });
  });

  describe('getCountriesByName', () => {
    it('should be defined', async () => {
      return expect(
        await filmController.getCountriesByName(context as RmqContext, 'usa'),
      ).toBeDefined();
    });

    it('should return countries', async () => {
      const result = await filmController.getCountriesByName(
        context as RmqContext,
        'usa',
      );

      expect(result).toEqual([countryStub()]);
    });
  });

  describe('getGenre', () => {
    it('should be defined', async () => {
      return expect(
        await filmController.getGenre(
          context as RmqContext,
          genreStub().genre_id,
        ),
      ).toBeDefined();
    });

    it('should return a genre', async () => {
      const result = await filmController.getGenre(
        context as RmqContext,
        genreStub().genre_id,
      );

      expect(result).toEqual(genreStub());
    });
  });

  describe('getAllGenres', () => {
    it('should be defined', async () => {
      return expect(
        await filmController.getAllGenres(context as RmqContext, {
          limit: '1',
        }),
      ).toBeDefined();
    });

    it('should return genres', async () => {
      const result = await filmController.getAllGenres(context as RmqContext, {
        limit: '1',
      });

      expect(result).toEqual([genreStub()]);
    });
  });

  describe('updateGenre', () => {
    it('should be defined', async () => {
      return expect(
        await filmController.updateGenre(context as RmqContext, genreStub()),
      ).toBeDefined();
    });

    it('should return a genre', async () => {
      const result = await filmController.updateGenre(
        context as RmqContext,
        genreStub(),
      );

      expect(result).toEqual(genreStub());
    });
  });
});

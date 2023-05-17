import { countryStub } from '../stubs/country.stub';
import { filmStub } from '../stubs/film.stub';
import { genreStub } from '../stubs/genre.stub';

export const mockFilmService = {
  addFilm: jest.fn().mockResolvedValue(Promise.resolve(filmStub())),
  getFilm: jest.fn().mockResolvedValue(Promise.resolve(filmStub())),
  getFilmsById: jest.fn().mockResolvedValue(Promise.resolve([filmStub()])),
  getFilmsByName: jest.fn().mockResolvedValue(Promise.resolve([filmStub()])),
  getAllFilms: jest.fn().mockResolvedValue(Promise.resolve([filmStub()])),
  getFilteredFilms: jest.fn().mockResolvedValue(Promise.resolve([filmStub()])),
  updateFilm: jest.fn().mockResolvedValue(Promise.resolve(filmStub())),
  deleteFilm: jest.fn().mockResolvedValue(Promise.resolve(filmStub())),

  getAllCountries: jest
    .fn()
    .mockResolvedValue(Promise.resolve([countryStub()])),
  getCountriesByName: jest
    .fn()
    .mockResolvedValue(Promise.resolve([countryStub()])),

  getGenre: jest.fn().mockResolvedValue(Promise.resolve(genreStub())),
  getAllGenres: jest.fn().mockResolvedValue(Promise.resolve([genreStub()])),
  updateGenre: jest.fn().mockResolvedValue(Promise.resolve(genreStub())),
};

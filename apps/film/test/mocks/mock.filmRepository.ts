import { filmStub } from '../stubs/film.stub';

export const mockFilmRepository = {
  create: jest.fn().mockResolvedValue(Promise.resolve(filmStub())),
  findAll: jest.fn().mockResolvedValue(Promise.resolve([filmStub()])),
  findOne: jest.fn().mockImplementation((data) => {
    if (data.where.hasOwnProperty('film_id')) {
      return data.where.film_id === filmStub().film_id
        ? Promise.resolve(filmStub())
        : Promise.resolve(null);
    }

    return data.where.name_ru === filmStub().name_ru
      ? Promise.resolve(filmStub())
      : Promise.resolve(null);
  }),
  update: jest.fn().mockResolvedValue(Promise.resolve(filmStub())),
  destroy: jest.fn().mockResolvedValue(Promise.resolve(filmStub())),
};

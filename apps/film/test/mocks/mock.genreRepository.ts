import { genreStub } from '../stubs/genre.stub';

export const mockGenreRepository = {
  findOrCreate: jest
    .fn()
    .mockResolvedValue(Promise.resolve([{ genre_id: genreStub().genre_id }])),
  findAll: jest.fn().mockResolvedValue(Promise.resolve([genreStub()])),
  update: jest.fn().mockResolvedValue(Promise.resolve(genreStub())),
  findOne: jest
    .fn()
    .mockImplementation(({ where: { genre_id } }) =>
      Promise.resolve(genre_id === genreStub().genre_id ? genreStub() : null),
    ),
};

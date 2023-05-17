import { personStub } from '../stubs/person.stub';

export const mockPersonService = {
  getPerson: jest.fn().mockResolvedValue(Promise.resolve(personStub())),
  getAllPersons: jest.fn().mockResolvedValue(Promise.resolve([personStub()])),
  getPersonsFromFilm: jest
    .fn()
    .mockResolvedValue(Promise.resolve([personStub()])),
  getPersonsByName: jest
    .fn()
    .mockResolvedValue(Promise.resolve([personStub()])),
  getFilmsByPerson: jest.fn().mockResolvedValue(Promise.resolve(personStub())),
  addPersonsFromFilm: jest
    .fn()
    .mockResolvedValue(Promise.resolve([personStub()])),
};

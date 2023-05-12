import { personStub } from '../stubs/person.stub';

export const mockPersonService = {
  getPerson: jest.fn().mockResolvedValue(personStub()),
  getAllPersons: jest.fn().mockResolvedValue([personStub()]),
  getPersonsFromFilm: jest.fn().mockResolvedValue([personStub()]),
  getPersonsByName: jest.fn().mockResolvedValue([personStub()]),
  getFilmsByPerson: jest.fn().mockResolvedValue(personStub()),
  addPersonsFromFilm: jest.fn().mockResolvedValue([personStub()]),
};

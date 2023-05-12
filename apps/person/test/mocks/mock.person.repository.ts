import { personStub } from '../stubs/person.stub';

export const mockPersonRepository = {
  getPerson: jest
    .fn()
    .mockImplementation((person_id: string) =>
      Promise.resolve(
        personStub().person_id === person_id ? personStub() : null,
      ),
    ),

  findOne: jest.fn().mockImplementation(({ where: { person_id } }) => {
    if (typeof person_id !== 'string') {
      return Promise.resolve(personStub());
    }

    return personStub().person_id === person_id ? personStub() : null;
  }),

  getAllPersons: jest.fn().mockResolvedValue(Promise.resolve([personStub()])),

  findAll: jest.fn().mockResolvedValue(Promise.resolve([personStub()])),

  getPersonsFromFilm: jest
    .fn()
    .mockRejectedValue(Promise.resolve([personStub()])),

  getPersonsByName: jest
    .fn()
    .mockResolvedValue(Promise.resolve([personStub()])),

  getFilmsByPerson: jest.fn().mockResolvedValue(Promise.resolve(personStub())),

  addPersonsFromFilm: jest
    .fn()
    .mockResolvedValue(Promise.resolve([personStub()])),

  findOrCreate: jest.fn().mockResolvedValue(Promise.resolve([personStub(), 1])),
};

import { personStub } from '../stubs/person.stub';

export const mockPersonRepository = {
  findOne: jest.fn().mockImplementation(({ where: { person_id } }) => {
    if (typeof person_id !== 'string') {
      return Promise.resolve(personStub());
    }

    return personStub().person_id === person_id
      ? Promise.resolve(personStub())
      : Promise.resolve(null);
  }),
  findAll: jest.fn().mockResolvedValue(Promise.resolve([personStub()])),
  findOrCreate: jest.fn().mockResolvedValue(Promise.resolve([personStub(), 1])),
};

import { userStub } from '../stubs/user.stub';

export const mockUserRepository = {
  create: jest.fn().mockImplementation((user) => Promise.resolve(user)),
  findAll: jest.fn().mockResolvedValue(Promise.resolve([userStub()])),
  findOne: jest.fn().mockImplementation((data) => {
    if (data.where.hasOwnProperty('email')) {
      return data.where.email === userStub().email
        ? Promise.resolve(userStub())
        : Promise.resolve(null);
    }

    return Promise.resolve(userStub());
  }),
  update: jest.fn().mockResolvedValue(Promise.resolve(userStub())),
  destroy: jest.fn().mockResolvedValue(Promise.resolve(userStub())),
};

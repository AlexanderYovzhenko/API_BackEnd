import { authStub } from '../stubs/auth.stub';

export const mockUserRepository = {
  findOne: jest.fn().mockImplementation((data) => {
    if (data.where.hasOwnProperty('email')) {
      return data.where.email === authStub().email
        ? Promise.resolve(authStub())
        : Promise.resolve(null);
    }

    return data.where.user_id === authStub().user_id
      ? Promise.resolve(authStub())
      : Promise.resolve(null);
  }),
  findOrCreate: jest.fn().mockImplementation(() => Promise.resolve(authStub())),
};

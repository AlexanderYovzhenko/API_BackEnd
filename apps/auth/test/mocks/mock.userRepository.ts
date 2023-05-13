import { authStub } from '../stubs/auth.stub';

export const mockUserRepository = {
  findOne: jest.fn().mockImplementation(({ where: { email } }) => {
    return email === authStub().email
      ? Promise.resolve(authStub())
      : Promise.resolve(null);
  }),
};

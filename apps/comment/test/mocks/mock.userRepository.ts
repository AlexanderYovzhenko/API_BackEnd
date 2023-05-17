import { userStub } from '../stubs/user.stub';

export const mockUserRepository = {
  findOne: jest.fn().mockImplementation(({ where: { user_id } }) => {
    return user_id === userStub().user_id
      ? Promise.resolve(userStub())
      : Promise.resolve(null);
  }),
};

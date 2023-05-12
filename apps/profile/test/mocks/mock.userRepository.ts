import { userStub, userWithProfileStub } from '../stubs/user.stub';

export const mockUserRepository = {
  findAll: jest
    .fn()
    .mockResolvedValue(Promise.resolve([userWithProfileStub()])),
  findOne: jest.fn().mockImplementation(({ where: { user_id } }) => {
    return user_id === userStub().user_id
      ? Promise.resolve(userStub())
      : Promise.resolve(null);
  }),
  update: jest.fn().mockResolvedValue(Promise.resolve(userWithProfileStub())),
};

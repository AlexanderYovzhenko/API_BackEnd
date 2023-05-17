import { refreshTokenDBStub } from '../stubs/auth.stub';

export const mockTokenRepository = {
  findOne: jest.fn().mockImplementation((data) => {
    if (data.hasOwnProperty('include')) {
      return data.include[0].where.user_id === refreshTokenDBStub().user_id
        ? Promise.resolve(refreshTokenDBStub())
        : Promise.resolve(null);
    }

    return data.where.token === refreshTokenDBStub().token
      ? Promise.resolve(refreshTokenDBStub())
      : Promise.resolve(null);
  }),
  create: jest.fn().mockRejectedValue(Promise.resolve(refreshTokenDBStub())),
  update: jest.fn().mockRejectedValue(Promise.resolve(refreshTokenDBStub())),
  destroy: jest.fn().mockImplementation(() => 1),
};

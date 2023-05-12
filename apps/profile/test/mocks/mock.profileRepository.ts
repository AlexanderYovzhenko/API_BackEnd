import { profileStub } from '../stubs/profile.stub';

export const mockProfileRepository = {
  create: jest.fn(),
  findOne: jest.fn().mockImplementation(({ where: { phone } }) => {
    return phone === profileStub().phone
      ? Promise.resolve(profileStub())
      : Promise.resolve(null);
  }),
  update: jest.fn(),
  destroy: jest.fn(),
};

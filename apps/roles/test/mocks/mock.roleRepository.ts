import { roleStub } from '../stubs/role.stub';

export const mockRoleRepository = {
  create: jest.fn().mockImplementation((role) => Promise.resolve(role)),
  findAll: jest.fn().mockResolvedValue(Promise.resolve([roleStub()])),
  findOne: jest.fn().mockImplementation(({ where: { value } }) => {
    return value === roleStub().value
      ? Promise.resolve(roleStub())
      : Promise.resolve(null);
  }),
  update: jest.fn().mockResolvedValue(Promise.resolve(roleStub())),
};

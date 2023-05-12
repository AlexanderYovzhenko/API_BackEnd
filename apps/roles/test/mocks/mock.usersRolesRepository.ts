import { userRoleStub } from '../stubs/userRole.stub';

export const mockUserRoleRepository = {
  create: jest.fn().mockImplementation((userRole) => Promise.resolve(userRole)),
  findOne: jest.fn().mockImplementation(({ where: { user_id, role_id } }) => {
    if (
      user_id === userRoleStub().user_id &&
      role_id === userRoleStub().role_id
    ) {
      return Promise.resolve(userRoleStub());
    }

    return null;
  }),
  destroy: jest.fn().mockResolvedValue(Promise.resolve(userRoleStub())),
};

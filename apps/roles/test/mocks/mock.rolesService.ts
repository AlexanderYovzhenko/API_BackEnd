import { roleStub } from '../stubs/role.stub';
import { userRoleStub } from '../stubs/userRole.stub';

export const mockRolesService = {
  createRole: jest.fn().mockResolvedValue(Promise.resolve(roleStub())),
  getRoleByValue: jest.fn().mockResolvedValue(Promise.resolve(roleStub())),
  getRoles: jest.fn().mockResolvedValue(Promise.resolve([roleStub()])),
  updateRole: jest.fn().mockResolvedValue(Promise.resolve(roleStub())),
  createUserRole: jest.fn().mockResolvedValue(Promise.resolve(userRoleStub())),
  deleteUserRole: jest.fn().mockResolvedValue(Promise.resolve(userRoleStub())),
};

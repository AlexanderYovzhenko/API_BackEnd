import { userStub } from '../stubs/user.stub';

export const mockUsersService = {
  createUser: jest.fn().mockResolvedValue(Promise.resolve(userStub())),
  getUserByEmail: jest.fn().mockResolvedValue(Promise.resolve(userStub())),
  getUsers: jest.fn().mockResolvedValue(Promise.resolve([userStub()])),
  updateUser: jest.fn().mockResolvedValue(Promise.resolve(userStub())),
  deleteUser: jest.fn().mockResolvedValue(Promise.resolve(userStub())),
};

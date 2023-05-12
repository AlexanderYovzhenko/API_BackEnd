import { userStub } from '../stubs/user.stub';

export const mockUsersService = {
  createProfile: jest.fn().mockResolvedValue(Promise.resolve(userStub())),
  getProfileById: jest.fn().mockResolvedValue(Promise.resolve(userStub())),
  getProfiles: jest.fn().mockResolvedValue(Promise.resolve([userStub()])),
  updateProfile: jest.fn().mockResolvedValue(Promise.resolve(userStub())),
  deleteProfile: jest.fn().mockResolvedValue(Promise.resolve(userStub())),
};

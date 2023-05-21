import { authStub, tokensStub } from '../stubs/auth.stub';

export const mockAuthService = {
  logIn: jest.fn().mockResolvedValue(Promise.resolve(tokensStub())),
  signUp: jest.fn().mockResolvedValue(Promise.resolve(authStub())),
  refresh: jest.fn().mockResolvedValue(Promise.resolve(tokensStub())),
  logOut: jest.fn().mockResolvedValue(Promise.resolve(1)),
  googleAuth: jest.fn().mockResolvedValue(Promise.resolve(tokensStub())),
  vkAuth: jest.fn().mockResolvedValue(Promise.resolve(tokensStub())),
  isAuth: jest.fn().mockResolvedValue(Promise.resolve(true)),
};

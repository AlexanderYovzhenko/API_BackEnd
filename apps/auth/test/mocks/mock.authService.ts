import { authStub, tokenStub } from '../stubs/auth.stub';

export const mockAuthService = {
  logIn: jest.fn().mockResolvedValue(Promise.resolve(tokenStub())),
  signUp: jest.fn().mockResolvedValue(Promise.resolve(authStub())),
};

import { filmRoleStub } from '../stubs/filmRole.stub';

export const mockFilmRoleRepository = {
  findOrCreate: jest.fn().mockResolvedValue([filmRoleStub(), 1]),
};

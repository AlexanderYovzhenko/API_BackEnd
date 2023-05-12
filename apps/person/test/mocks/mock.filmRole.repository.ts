import { filmRoleStub } from '../stubs/filmRole.stub';

export const mockFilmRoleRepository = {
  findOrCreate: jest
    .fn()
    .mockResolvedValue(Promise.resolve([filmRoleStub(), 1])),
};

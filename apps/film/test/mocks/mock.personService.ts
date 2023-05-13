import { defer } from 'rxjs';
import { filmStub } from '../stubs/film.stub';

export const mockPersonService = {
  send: jest.fn().mockImplementation(() =>
    defer(async () => {
      const films = [filmStub()];

      return { films };
    }),
  ),
};

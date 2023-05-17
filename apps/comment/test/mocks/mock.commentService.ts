import { commentStub } from '../stubs/comment.stub';

export const mockCommentService = {
  addComment: jest.fn().mockResolvedValue(Promise.resolve(commentStub())),
  getOneComment: jest.fn().mockResolvedValue(Promise.resolve(commentStub())),
  getAllCommentFilm: jest
    .fn()
    .mockResolvedValue(Promise.resolve([commentStub()])),
  updateComment: jest.fn().mockResolvedValue(Promise.resolve(commentStub())),
  deleteComment: jest.fn().mockResolvedValue(Promise.resolve(commentStub())),
};

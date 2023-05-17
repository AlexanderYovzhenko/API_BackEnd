import { commentStub, commentWithoutParentStub } from '../stubs/comment.stub';

export const mockCommentRepository = {
  create: jest.fn().mockImplementation((comment) => Promise.resolve(comment)),
  findAll: jest
    .fn()
    .mockResolvedValue(
      Promise.resolve([commentStub(), commentWithoutParentStub()]),
    ),
  findOne: jest.fn().mockImplementation(({ where: { comment_id } }) => {
    return comment_id === commentStub().comment_id
      ? Promise.resolve(commentStub())
      : Promise.resolve(null);
  }),
  update: jest.fn().mockResolvedValue(Promise.resolve(commentStub())),
  destroy: jest.fn().mockResolvedValue(Promise.resolve(commentStub())),
};

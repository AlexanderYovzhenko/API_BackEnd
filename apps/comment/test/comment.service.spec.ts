import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { CommentService } from '../src/comment.service';
import { User } from '@app/shared';
import { Comment } from '../src/entities';
import { mockCommentRepository, mockUserRepository } from './mocks';
import { commentStub, commentWithoutParentStub } from './stubs/comment.stub';

describe('CommentService', () => {
  let commentService: CommentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: getModelToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getModelToken(Comment),
          useValue: mockCommentRepository,
        },
      ],
    }).compile();

    commentService = module.get<CommentService>(CommentService);
  });

  it('should be defined', () => {
    expect(commentService).toBeDefined();
  });

  describe('addComment', () => {
    it('should be defined', async () => {
      expect(await commentService.addComment(commentStub())).toBeDefined();
    });

    it('should be return user id is not uuid', async () => {
      expect(
        await commentService.addComment({ ...commentStub(), user_id: '123' }),
      ).toEqual('user id is not uuid');
    });

    it('should be return user not found', async () => {
      expect(
        await commentService.addComment({
          ...commentStub(),
          user_id: '2982ecf2-8fae-471c-8ddf-2e3cbdab360e',
        }),
      ).toEqual('user not found');
    });

    it('should be return null', async () => {
      expect(await commentService.addComment(commentStub())).toEqual(null);
    });

    it('should be return parent comment id is not uuid', async () => {
      expect(
        await commentService.addComment({
          ...commentStub(),
          parent_id: '123',
        }),
      ).toEqual('parent comment id is not uuid');
    });

    it('should be return null', async () => {
      expect(
        await commentService.addComment({
          ...commentStub(),
          parent_id: '9982ecf2-8fae-471c-8ddf-2e3cbdab360e',
        }),
      ).toEqual(null);
    });
  });

  describe('getAllCommentFilm', () => {
    it('should be defined', async () => {
      expect(
        await commentService.getAllCommentFilm(commentStub().film_id),
      ).toBeDefined();
    });

    it('should be return array all comments of film', async () => {
      expect(
        await commentService.getAllCommentFilm(
          commentWithoutParentStub().film_id,
        ),
      ).toEqual([commentWithoutParentStub()]);
    });
  });

  describe('getOneComment', () => {
    it('should be defined', async () => {
      expect(
        await commentService.getOneComment(commentStub().comment_id),
      ).toBeDefined();
    });

    it('should be return null', async () => {
      expect(await commentService.getOneComment('123')).toEqual(null);
    });

    it('should be return a comment by id', async () => {
      expect(
        await commentService.getOneComment(commentStub().comment_id),
      ).toEqual(commentStub());
    });
  });

  describe('updateComment', () => {
    it('should be defined', async () => {
      expect(
        await commentService.updateComment(
          commentStub().comment_id,
          commentStub(),
        ),
      ).toBeDefined();
    });

    it('should be return null', async () => {
      expect(await commentService.updateComment('123', commentStub())).toEqual(
        null,
      );
    });

    it('should be return update comment', async () => {
      expect(
        await commentService.updateComment(
          commentStub().comment_id,
          commentStub(),
        ),
      ).toEqual(commentStub());
    });
  });

  describe('deleteComment', () => {
    it('should be defined', async () => {
      expect(
        await commentService.deleteComment(commentStub().comment_id),
      ).toBeDefined();
    });

    it('should be return', async () => {
      expect(await commentService.deleteComment('123')).toEqual(null);
    });

    it('should be return deleted comment', async () => {
      expect(
        await commentService.deleteComment(commentStub().comment_id),
      ).toEqual(commentStub());
    });
  });
});

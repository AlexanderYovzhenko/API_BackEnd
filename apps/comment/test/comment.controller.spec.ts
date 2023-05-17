import { Test, TestingModule } from '@nestjs/testing';
import { CommentController } from '../src/comment.controller';
import { CommentService } from '../src/comment.service';
import { SharedService } from '@app/shared';
import { ConfigService } from '@nestjs/config';
import { RmqContext } from '@nestjs/microservices';
import { context, mockCommentService, mockSharedService } from './mocks';
import { commentStub } from './stubs/comment.stub';

describe('CommentController', () => {
  let commentController: CommentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentController],
      providers: [
        CommentService,
        {
          provide: CommentService,
          useValue: mockCommentService,
        },
        {
          provide: 'SharedServiceInterface',
          useClass: SharedService,
        },
        {
          provide: SharedService,
          useValue: mockSharedService,
        },
        {
          provide: ConfigService,
          useValue: {
            get(): string {
              return 'mock-value';
            },
          },
        },
      ],
    }).compile();

    commentController = module.get<CommentController>(CommentController);
  });

  it('should be defined', () => {
    expect(commentController).toBeDefined();
  });

  describe('addComment', () => {
    it('should be defined', async () => {
      return expect(
        await commentController.addComment(
          context as RmqContext,
          commentStub(),
        ),
      ).toBeDefined();
    });

    it('should return a comment', async () => {
      const result = await commentController.addComment(
        context as RmqContext,
        commentStub(),
      );

      expect(result).toEqual(commentStub());
    });
  });

  describe('getAllCommentFilm', () => {
    it('should be defined', async () => {
      return expect(
        await commentController.getAllCommentFilm(
          context as RmqContext,
          commentStub().comment_id,
        ),
      ).toBeDefined();
    });

    it('should return array comments', async () => {
      const result = await commentController.getAllCommentFilm(
        context as RmqContext,
        commentStub().comment_id,
      );

      expect(result).toEqual([commentStub()]);
    });
  });

  describe('getOneComment', () => {
    it('should be defined', async () => {
      return expect(
        await commentController.getOneComment(
          context as RmqContext,
          commentStub().comment_id,
        ),
      ).toBeDefined();
    });

    it('should return a comment', async () => {
      const result = await commentController.getOneComment(
        context as RmqContext,
        commentStub().comment_id,
      );

      expect(result).toEqual(commentStub());
    });
  });

  describe('updateComment', () => {
    it('should be defined', async () => {
      return expect(
        await commentController.updateComment(context as RmqContext, {
          comment_id: commentStub().comment_id,
          updateComment: commentStub(),
        }),
      ).toBeDefined();
    });

    it('should return a comment', async () => {
      const result = await commentController.updateComment(
        context as RmqContext,
        { comment_id: commentStub().comment_id, updateComment: commentStub() },
      );

      expect(result).toEqual(commentStub());
    });
  });

  describe('deleteComment', () => {
    it('should be defined', async () => {
      return expect(
        await commentController.deleteComment(
          context as RmqContext,
          commentStub().comment_id,
        ),
      ).toBeDefined();
    });

    it('should return a comment', async () => {
      const result = await commentController.deleteComment(
        context as RmqContext,
        commentStub().comment_id,
      );

      expect(result).toEqual(commentStub());
    });
  });
});

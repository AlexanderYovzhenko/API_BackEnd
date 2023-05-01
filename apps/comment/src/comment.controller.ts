import { Controller, Inject } from '@nestjs/common';
import { CommentService } from './comment.service';
import { SharedService } from '@app/shared';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import {
  ICreateComment,
  IUpdateComment,
} from './interface/comment-service.interfaces';

@Controller()
export class CommentController {
  constructor(
    @Inject('SharedServiceInterface')
    private readonly sharedService: SharedService,
    private readonly commentService: CommentService,
  ) {}

  @MessagePattern({ cmd: 'create_comment' })
  async addComment(
    @Ctx() context: RmqContext,
    @Payload() comment: ICreateComment,
  ) {
    this.sharedService.acknowledgeMessage(context);

    return await this.commentService.addComment(comment);
  }

  @MessagePattern({ cmd: 'get_all_comments_film' })
  async getAllCommentFilm(
    @Ctx() context: RmqContext,
    @Payload() film_id: string,
  ) {
    this.sharedService.acknowledgeMessage(context);

    return await this.commentService.getAllCommentFilm(film_id);
  }

  @MessagePattern({ cmd: 'get_comment' })
  async getOneComment(
    @Ctx() context: RmqContext,
    @Payload() comment_id: string,
  ) {
    this.sharedService.acknowledgeMessage(context);

    return await this.commentService.getOneComment(comment_id);
  }

  @MessagePattern({ cmd: 'update_comment' })
  async updateComment(
    @Ctx() context: RmqContext,
    @Payload() data: { comment_id: string; updateComment: IUpdateComment },
  ) {
    this.sharedService.acknowledgeMessage(context);

    const { comment_id, updateComment } = data;

    return await this.commentService.updateComment(comment_id, updateComment);
  }

  @MessagePattern({ cmd: 'delete_comment' })
  async deleteComment(
    @Ctx() context: RmqContext,
    @Payload() comment_id: string,
  ) {
    this.sharedService.acknowledgeMessage(context);

    return await this.commentService.deleteComment(comment_id);
  }
}

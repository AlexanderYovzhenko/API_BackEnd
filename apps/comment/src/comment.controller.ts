import { Controller, Inject } from '@nestjs/common';
import { CommentService } from './comment.service';
import { SharedService } from '@app/shared';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

@Controller()
export class CommentController {
  constructor(
    @Inject('SharedServiceInterface')
    private readonly sharedService: SharedService,
    private readonly commentService: CommentService,
  ) {}

  @MessagePattern({ cmd: 'get_person' })
  async getPerson(@Ctx() context: RmqContext, @Payload() person_id: string) {
    this.sharedService.acknowledgeMessage(context);

    return await this.commentService.getHello();
  }
}

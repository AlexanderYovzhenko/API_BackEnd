import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { PostgresDBModule, SharedModule, SharedService } from '@app/shared';
import { SequelizeModule } from '@nestjs/sequelize';
import { Comment, SubComment } from './entities';

@Module({
  imports: [
    SharedModule,
    PostgresDBModule,
    SequelizeModule.forFeature([Comment, SubComment]),
  ],
  controllers: [CommentController],
  providers: [
    CommentService,
    {
      provide: 'SharedServiceInterface',
      useClass: SharedService,
    },
  ],
})
export class CommentModule {}

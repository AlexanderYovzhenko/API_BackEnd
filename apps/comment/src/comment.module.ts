import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import {
  PostgresDBModule,
  Profile,
  Role,
  SharedModule,
  SharedService,
  User,
  UserRole,
} from '@app/shared';
import { SequelizeModule } from '@nestjs/sequelize';
import { Comment } from './entities';

@Module({
  imports: [
    SharedModule,
    PostgresDBModule,
    SequelizeModule.forFeature([Comment, User, Profile, Role, UserRole]),
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

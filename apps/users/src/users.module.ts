import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { SequelizeModule } from '@nestjs/sequelize';

import {
  PostgresDBModule,
  SharedModule,
  SharedService,
  User,
} from '@app/shared';

@Module({
  imports: [SharedModule, PostgresDBModule, SequelizeModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: 'SharedServiceInterface',
      useClass: SharedService,
    },
  ],
})
export class UsersModule {}

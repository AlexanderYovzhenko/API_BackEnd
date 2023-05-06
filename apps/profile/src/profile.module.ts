import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  PostgresDBModule,
  SharedModule,
  SharedService,
  Profile,
  User,
} from '@app/shared';

@Module({
  imports: [
    SharedModule,
    PostgresDBModule,
    SequelizeModule.forFeature([Profile, User]),
  ],
  controllers: [ProfileController],
  providers: [
    ProfileService,
    {
      provide: 'SharedServiceInterface',
      useClass: SharedService,
    },
  ],
})
export class ProfileModule {}

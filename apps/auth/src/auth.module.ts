import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  PostgresDBModule,
  SharedModule,
  SharedService,
  User,
} from '@app/shared';

@Module({
  imports: [SharedModule, PostgresDBModule, SequelizeModule.forFeature([User])],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: 'SharedServiceInterface',
      useClass: SharedService,
    },
  ],
})
export class AuthModule {}

import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  PostgresDBModule,
  Profile,
  Role,
  SharedModule,
  SharedService,
  User,
  UserRole,
} from '@app/shared';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { GoogleStrategy } from './oath/google.strategy';
import { VkStrategy } from './oath/vk.strategy';
import { Token } from './entities';
@Module({
  imports: [
    HttpModule,
    // GoogleStrategy,
    // VkStrategy,
    SharedModule,
    PostgresDBModule,
    SequelizeModule.forFeature([User, Profile, Role, UserRole, Token]),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async () => ({}),
    }),
  ],
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

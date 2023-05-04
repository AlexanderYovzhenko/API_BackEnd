import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter, SharedModule } from '@app/shared';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    SharedModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: await configService.get('JWT_SECRET_KEY'),
        signOptions: {
          expiresIn: '24h',
        },
      }),
    }),
    SharedModule.registerRmq('AUTH_SERVICE', process.env.RABBITMQ_AUTH_QUEUE),
    SharedModule.registerRmq('FILM_SERVICE', process.env.RABBITMQ_FILM_QUEUE),
    SharedModule.registerRmq(
      'PERSON_SERVICE',
      process.env.RABBITMQ_PERSON_QUEUE,
    ),
    SharedModule.registerRmq('USERS_SERVICE', process.env.RABBITMQ_USERS_QUEUE),
    SharedModule.registerRmq('ROLES_SERVICE', process.env.RABBITMQ_ROLES_QUEUE),
    SharedModule.registerRmq(
      'PROFILE_SERVICE',
      process.env.RABBITMQ_PROFILE_QUEUE,
      'COMMENT_SERVICE',
      process.env.RABBITMQ_COMMENT_QUEUE,
    ),
  ],
  controllers: [ApiController],
  providers: [
    ApiService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class ApiModule {}

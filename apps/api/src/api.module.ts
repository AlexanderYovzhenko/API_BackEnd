import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { APP_FILTER } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AllExceptionsFilter, SharedModule } from '@app/shared';
import { GoogleStrategy } from './strategies/google.strategy';
import { VkStrategy } from './strategies/vk.strategy';
import { CorsMiddleware } from './middlewares/cors.middleware';

@Module({
  imports: [
    SharedModule,
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async () => ({}),
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
    ),
    SharedModule.registerRmq(
      'COMMENT_SERVICE',
      process.env.RABBITMQ_COMMENT_QUEUE,
    ),
  ],
  controllers: [ApiController],
  providers: [
    ApiService,
    GoogleStrategy,
    VkStrategy,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class ApiModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorsMiddleware).forRoutes('*');
  }
}

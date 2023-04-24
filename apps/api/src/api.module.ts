import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter, SharedModule } from '@app/shared';

@Module({
  imports: [
    SharedModule,
    SharedModule.registerRmq('AUTH_SERVICE', process.env.RABBITMQ_AUTH_QUEUE),
    SharedModule.registerRmq('FILM_SERVICE', process.env.RABBITMQ_FILM_QUEUE),
    SharedModule.registerRmq(
      'PERSON_SERVICE',
      process.env.RABBITMQ_PERSON_QUEUE,
    ),
    SharedModule.registerRmq('USERS_SERVICE', process.env.RABBITMQ_USERS_QUEUE),
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

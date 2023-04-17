import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter, SharedModule } from '@app/shared';

@Module({
  imports: [
    SharedModule,
    SharedModule.registerRmq('AUTH_SERVICE', process.env.RABBITMQ_AUTH_QUEUE),
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

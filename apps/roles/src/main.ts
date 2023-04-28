import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { RolesModule } from './roles.module';
import { SharedService } from '@app/shared';

async function bootstrap() {
  const app = await NestFactory.create(RolesModule);

  const configService = app.get(ConfigService);
  const sharedService = app.get(SharedService);

  const queue = configService.get('RABBITMQ_ROLES_QUEUE');

  app.connectMicroservice(sharedService.getRmqOptions(queue));
  app.startAllMicroservices();
}

bootstrap();

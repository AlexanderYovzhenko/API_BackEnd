import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { FilmModule } from './film.module';
import { SharedService } from '@app/shared';

async function bootstrap() {
  const app = await NestFactory.create(FilmModule);

  const configService = app.get(ConfigService);
  const sharedService = app.get(SharedService);

  const queue = configService.get('RABBITMQ_FILM_QUEUE');

  app.connectMicroservice(sharedService.getRmqOptions(queue));
  app.startAllMicroservices();
}

bootstrap();

import { NestFactory } from '@nestjs/core';
import { CommentModule } from './comment.module';
import { ConfigService } from '@nestjs/config';
import { SharedService } from '@app/shared';

async function bootstrap() {
  const app = await NestFactory.create(CommentModule);

  const configService = app.get(ConfigService);
  const sharedService = app.get(SharedService);

  const queue = configService.get('RABBITMQ_COMMENT_QUEUE');

  app.connectMicroservice(sharedService.getRmqOptions(queue));
  app.startAllMicroservices();
}
bootstrap();

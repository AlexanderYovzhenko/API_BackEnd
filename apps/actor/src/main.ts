import { NestFactory } from '@nestjs/core';
import { ActorModule } from './actor.module';

async function bootstrap() {
  const app = await NestFactory.create(ActorModule);
  await app.listen(3000);
}
bootstrap();

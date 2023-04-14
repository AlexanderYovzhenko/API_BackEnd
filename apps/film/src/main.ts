import { NestFactory } from '@nestjs/core';
import { FilmModule } from './film.module';

async function bootstrap() {
  const app = await NestFactory.create(FilmModule);
  await app.listen(3000);
}
bootstrap();

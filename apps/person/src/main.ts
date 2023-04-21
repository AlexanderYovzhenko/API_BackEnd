import { NestFactory } from '@nestjs/core';
import { PersonModule } from './person.module';

async function bootstrap() {
  const app = await NestFactory.create(PersonModule);
  await app.listen(3000);
}
bootstrap();

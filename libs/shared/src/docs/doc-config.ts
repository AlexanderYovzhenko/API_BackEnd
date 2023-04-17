import { DocumentBuilder } from '@nestjs/swagger';

export const config = new DocumentBuilder()
  .setTitle('API_BackEnd')
  .setDescription('Api for films with registration and authorization ')
  .setVersion('1.0.0')
  .addBearerAuth()
  .addTag('Server NestJS')
  .build();

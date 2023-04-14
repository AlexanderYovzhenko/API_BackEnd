import { Injectable } from '@nestjs/common';

@Injectable()
export class FilmService {
  getHello(): string {
    return 'Hello World!';
  }
}

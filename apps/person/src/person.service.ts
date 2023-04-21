import { Injectable } from '@nestjs/common';

@Injectable()
export class PersonService {
  getHello(): string {
    return 'Hello World!';
  }
}

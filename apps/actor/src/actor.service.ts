import { Injectable } from '@nestjs/common';

@Injectable()
export class ActorService {
  getHello(): string {
    return 'Hello World!';
  }
}

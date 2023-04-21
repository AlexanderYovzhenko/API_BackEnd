import { Injectable } from '@nestjs/common';

@Injectable()
export class ApiService {
  checkServer(): string {
    return 'Server is running!';
  }
}

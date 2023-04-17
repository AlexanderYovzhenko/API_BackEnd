import { Controller, Get, Inject } from '@nestjs/common';
import { ApiService } from './api.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';

@ApiTags('Endpoints')
@ApiBearerAuth()
@Controller()
export class ApiController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
    private readonly apiService: ApiService,
  ) {}

  @Get()
  getHello(): string {
    return this.apiService.getHello();
  }

  @Get('auth')
  async getUsers() {
    return this.authService.send(
      {
        cmd: 'auth-service',
      },
      {},
    );
  }
}

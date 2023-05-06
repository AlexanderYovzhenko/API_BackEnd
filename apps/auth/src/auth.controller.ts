import { Controller, Inject } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { SharedService } from '@app/shared';
import { AuthInterface } from './interface/auth.interface';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
@ApiTags('Endpoints')
@ApiBearerAuth()
@Controller()
export class AuthController {
  constructor(
    @Inject('SharedServiceInterface')
    private readonly sharedService: SharedService,
    private readonly authService: AuthService,
  ) {}

  @MessagePattern({ cmd: 'login' })
  async logIn(@Ctx() context: RmqContext, @Payload() userData: AuthInterface) {
    this.sharedService.acknowledgeMessage(context);

    return await this.authService.logIn(userData);
  }

  @MessagePattern({ cmd: 'signup' })
  async signUp(@Ctx() context: RmqContext, @Payload() userData: AuthInterface) {
    this.sharedService.acknowledgeMessage(context);

    return await this.authService.signUp(userData);
  }
}

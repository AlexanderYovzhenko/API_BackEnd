import { Controller, Inject, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SharedService } from '@app/shared';
import { AuthInterface } from './interface/auth.interface';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

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

  @MessagePattern({ cmd: 'google_login' })
  async googleAuth(@Ctx() context: RmqContext, @Req() req) {
    this.sharedService.acknowledgeMessage(context);

    return await this.authService.oauthLogin(req);
  }

  @MessagePattern({ cmd: 'vk_login' })
  async vkLogin(@Ctx() context: RmqContext, @Payload() userData: string) {
    this.sharedService.acknowledgeMessage(context);

    return this.authService.vkLogin(userData);
  }

  @MessagePattern({ cmd: 'refresh' })
  async refresh(@Ctx() context: RmqContext, @Payload() refreshToken: string) {
    this.sharedService.acknowledgeMessage(context);

    return await this.authService.refresh(refreshToken);
  }

  @MessagePattern({ cmd: 'logout' })
  async logOut(@Ctx() context: RmqContext, @Payload() refreshToken: string) {
    this.sharedService.acknowledgeMessage(context);

    return await this.authService.logOut(refreshToken);
  }
}

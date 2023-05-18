import { Controller, Inject } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SharedService } from '@app/shared';
import { AuthInterface, TokenInterface } from './interface/auth.interface';
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

  @MessagePattern({ cmd: 'signup' })
  async signUp(
    @Ctx() context: RmqContext,
    @Payload() userData: AuthInterface,
  ): Promise<string> {
    this.sharedService.acknowledgeMessage(context);

    return await this.authService.signUp(userData);
  }

  @MessagePattern({ cmd: 'login' })
  async logIn(
    @Ctx() context: RmqContext,
    @Payload() userData: AuthInterface,
  ): Promise<TokenInterface> {
    this.sharedService.acknowledgeMessage(context);

    return await this.authService.logIn(userData);
  }

  @MessagePattern({ cmd: 'refresh' })
  async refresh(
    @Ctx() context: RmqContext,
    @Payload() refreshToken: string,
  ): Promise<TokenInterface> {
    this.sharedService.acknowledgeMessage(context);

    return await this.authService.refresh(refreshToken);
  }

  @MessagePattern({ cmd: 'logout' })
  async logOut(
    @Ctx() context: RmqContext,
    @Payload() refreshToken: string,
  ): Promise<number> {
    this.sharedService.acknowledgeMessage(context);

    return await this.authService.logOut(refreshToken);
  }

  @MessagePattern({ cmd: 'google_login' })
  async googleAuth(
    @Ctx() context: RmqContext,
    @Payload() email: string,
  ): Promise<TokenInterface> {
    this.sharedService.acknowledgeMessage(context);

    return await this.authService.googleAuth(email);
  }

  @MessagePattern({ cmd: 'vk_login' })
  async vkAuth(
    @Ctx() context: RmqContext,
    @Payload() code: string,
  ): Promise<TokenInterface> {
    this.sharedService.acknowledgeMessage(context);

    return this.authService.vkAuth(code);
  }
}

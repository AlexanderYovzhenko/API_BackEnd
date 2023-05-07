import { Controller, Inject } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { UsersService } from './users.service';
import { SharedService } from '@app/shared';
import { UserInterface, UserUpdateInterface } from './interface/user.interface';

@Controller()
export class UsersController {
  constructor(
    @Inject('SharedServiceInterface')
    private readonly sharedService: SharedService,
    private readonly usersService: UsersService,
  ) {}

  @MessagePattern({ cmd: 'create_user' })
  async createUser(@Ctx() context: RmqContext, @Payload() user: UserInterface) {
    this.sharedService.acknowledgeMessage(context);

    return await this.usersService.createUser(user);
  }

  @MessagePattern({ cmd: 'get_all_users' })
  async getUsers(@Ctx() context: RmqContext) {
    this.sharedService.acknowledgeMessage(context);

    return await this.usersService.getUsers();
  }

  @MessagePattern({ cmd: 'get_user_by_email' })
  async getUserByEmail(
    @Ctx() context: RmqContext,
    @Payload()
    email: string,
  ) {
    this.sharedService.acknowledgeMessage(context);

    return await this.usersService.getUserByEmail(email);
  }

  @MessagePattern({ cmd: 'update_user' })
  async updateUser(
    @Ctx() context: RmqContext,
    @Payload()
    updateUser: UserUpdateInterface,
  ) {
    this.sharedService.acknowledgeMessage(context);

    return await this.usersService.updateUser(updateUser);
  }

  @MessagePattern({ cmd: 'delete_user' })
  async deleteUser(
    @Ctx() context: RmqContext,
    @Payload()
    user_id: string,
  ) {
    this.sharedService.acknowledgeMessage(context);

    return await this.usersService.deleteUser(user_id);
  }
}

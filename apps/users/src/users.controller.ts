import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  UsePipes,
  ValidationPipe,
  Inject,
} from '@nestjs/common';
import {
  ClientProxy,
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { CreateUserDto } from './dto/createUserDto';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SharedService } from '@app/shared';
import { ContextCreator } from '@nestjs/core/helpers/context-creator';

@ApiTags('Endpoints')
@ApiBearerAuth()
@Controller()
export class UsersController {
  constructor(
    //@Inject('USERS_SERVICE') private readonly usersService: ClientProxy,
    @Inject('SharedServiceInterface')
    private readonly sharedService: SharedService,
    private readonly usersService: UsersService,
  ) {}

  @MessagePattern({ cmd: 'create_user' })
  async createUser(@Ctx() context: RmqContext, @Payload() UserDto) {
    /* const newUser */
    this.sharedService.acknowledgeMessage(context);

    await this.usersService.createUser(UserDto);
    // const { name, surname, phone } = userDto;
    //const profileDto = { name, surname, phone, userID: newUser.id };
    //this.client.emit('create profile', profileDto);
  }

  @MessagePattern({ cmd: 'get_all_users' })
  getUsers(@Ctx() context: RmqContext) {
    this.sharedService.acknowledgeMessage(context);

    return this.usersService.getUsers();
  }

  @MessagePattern({ cmd: 'get_user_by_email' })
  async getUserByEmail(
    @Ctx() context: RmqContext,
    @Payload()
    email: string,
  ) {
    this.sharedService.acknowledgeMessage(context);

    const result = await this.usersService.getUserByEmail(email);
    return result.rows;
  }
}

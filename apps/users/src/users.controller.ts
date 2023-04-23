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
  RmqContext,
} from '@nestjs/microservices';
import { CreateUserDto } from '../dto/createUserDto';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SharedService } from '@app/shared';

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

  @UsePipes(ValidationPipe)
  @Post()
  async createUser(@Body() userDto: CreateUserDto) {
    /* const newUser */
    await this.usersService.createUser(userDto);
    // const { name, surname, phone } = userDto;
    //const profileDto = { name, surname, phone, userID: newUser.id };
    //this.client.emit('create profile', profileDto);
  }

  @MessagePattern({ cmd: 'get all users' })
  //@Get()
  getUsers() {
    return this.usersService.getUsers();
  }

  @MessagePattern({ cmd: 'get user by email' })
  //@Get(':email')
  async getUserByEmail(email: string) {
    const result = await this.usersService.getUserByEmail(email);
    return result.rows;
  }
}

/*

import { Controller, Inject } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';
import { SharedService } from '@app/shared';

@Controller()
export class AuthController {
  constructor(
    @Inject('SharedServiceInterface')
    private readonly sharedService: SharedService,
    private readonly authService: AuthService,
  ) {}

  @MessagePattern({ cmd: 'auth-service' })
  async getUsers(@Ctx() context: RmqContext) {
    this.sharedService.acknowledgeMessage(context);

    return this.authService.getHello();
  }
}


*/

import { Controller, Inject } from '@nestjs/common';
import { RolesService } from './roles.service';
import { SharedService } from '@app/shared';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

@Controller('roles')
export class RolesController {
  constructor(
    @Inject('SharedServiceInterface')
    private readonly sharedService: SharedService,
    private roleService: RolesService,
  ) {}

  @MessagePattern({ cmd: 'create_role' })
  async createRole(
    @Ctx() context: RmqContext,
    @Payload() role: Record<string | number, string[]>,
  ) {
    this.sharedService.acknowledgeMessage(context);

    return this.roleService.createRole(role);
  }

  @MessagePattern({ cmd: 'create_user_role' })
  async createUserRole(
    @Ctx() context: RmqContext,
    @Payload() data: Record<string | number, string[]>,
  ) {
    this.sharedService.acknowledgeMessage(context);

    return this.roleService.createUserRole(data);
  }

  @MessagePattern({ cmd: 'get_role_by_value' })
  getByValue(
    @Ctx() context: RmqContext,
    @Payload()
    value: string,
  ) {
    this.sharedService.acknowledgeMessage(context);

    return this.roleService.getRoleByValue(value);
  }

  @MessagePattern({ cmd: 'get_all_roles' })
  getRoles(@Ctx() context: RmqContext) {
    this.sharedService.acknowledgeMessage(context);

    return this.roleService.getRoles();
  }
}

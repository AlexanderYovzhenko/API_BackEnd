import { Controller, Inject } from '@nestjs/common';
import { RolesService } from './roles.service';

import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { SharedService } from '@app/shared';

@Controller('roles')
export class RolesController {
  constructor(
    @Inject('SharedServiceInterface')
    private readonly sharedService: SharedService,
    private roleService: RolesService,
  ) {}

  @MessagePattern({ cmd: 'create_role' })
  create(
    @Ctx() context: RmqContext,
    @Payload() role: Record<string | number, string[]>,
  ) {
    this.sharedService.acknowledgeMessage(context);

    return this.roleService.createRole(role);
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

import { Controller, Inject } from '@nestjs/common';
import { RolesService } from './roles.service';
import { SharedService } from '@app/shared';
import { RoleInterface, UserRoleInterface } from './interface/role.interface';
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
    private rolesService: RolesService,
  ) {}

  @MessagePattern({ cmd: 'create_role' })
  async createRole(@Ctx() context: RmqContext, @Payload() role: RoleInterface) {
    this.sharedService.acknowledgeMessage(context);

    return await this.rolesService.createRole(role);
  }

  @MessagePattern({ cmd: 'get_role_by_value' })
  async getRoleByValue(
    @Ctx() context: RmqContext,
    @Payload()
    value: string,
  ) {
    this.sharedService.acknowledgeMessage(context);

    return await this.rolesService.getRoleByValue(value);
  }

  @MessagePattern({ cmd: 'get_all_roles' })
  async getRoles(@Ctx() context: RmqContext) {
    this.sharedService.acknowledgeMessage(context);

    return await this.rolesService.getRoles();
  }

  @MessagePattern({ cmd: 'update_role' })
  async updateRole(
    @Ctx() context: RmqContext,
    @Payload() data: { value: string; updateRole: RoleInterface },
  ) {
    this.sharedService.acknowledgeMessage(context);

    return await this.rolesService.updateRole(data);
  }

  @MessagePattern({ cmd: 'delete_role' })
  async deleteRole(@Ctx() context: RmqContext, @Payload() value: string) {
    this.sharedService.acknowledgeMessage(context);

    return await this.rolesService.deleteRole(value);
  }

  @MessagePattern({ cmd: 'create_user_role' })
  async createUserRole(
    @Ctx() context: RmqContext,
    @Payload() data: UserRoleInterface,
  ) {
    this.sharedService.acknowledgeMessage(context);

    return await this.rolesService.createUserRole(data);
  }

  @MessagePattern({ cmd: 'delete_user_role' })
  async deleteUserRole(
    @Ctx() context: RmqContext,
    @Payload() data: UserRoleInterface,
  ) {
    this.sharedService.acknowledgeMessage(context);

    return await this.rolesService.deleteUserRole(data);
  }
}

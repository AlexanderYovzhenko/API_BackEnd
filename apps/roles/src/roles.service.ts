import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Role, UsersRoles } from './entities';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role) private roleRepository: typeof Role,
    @InjectModel(UsersRoles) private usersRolesRepository: typeof UsersRoles,
  ) {}

  async createRole(role) {
    const newRole = await this.roleRepository.create(role);
    return newRole;
  }
  async getRoles() {
    const roles = await this.roleRepository.findAll();
    return roles;
  }

  async getRoleByValue(value: string) {
    const role = await this.roleRepository.findOne({ where: { value } });
    return role;
  }
}

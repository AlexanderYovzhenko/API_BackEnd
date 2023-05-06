import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Role, UserRole } from './entities';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role) private roleRepository: typeof Role,
    @InjectModel(UserRole) private usersRolesRepository: typeof UserRole,
  ) {}

  async createRole(role) {
    const newRole = await this.roleRepository.create(role);
    return newRole;
  }

  async createUserRole(data) {
    const newUserRole = await this.usersRolesRepository.create(data);
    return newUserRole;
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

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Role, UserRole } from './entities';
import { Repository } from 'sequelize-typescript';
import { v4 as uuid } from 'uuid';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role) private roleRepository: Repository<Role>,
    @InjectModel(UserRole) private usersRolesRepository: Repository<UserRole>,
  ) {}

  generateUUID(): string {
    return uuid();
  }

  async createRole(role) {
    const newRole = await this.roleRepository.create({
      role_id: this.generateUUID(),
      ...role,
    });

    return newRole;
  }

  async createUserRole(data) {
    const newUserRole = await this.usersRolesRepository.create({
      user_role_id: this.generateUUID(),
      ...data,
    });

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

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Role, UserRole } from './entities';
import { Repository } from 'sequelize-typescript';
import { v4 as uuid } from 'uuid';
import { Profile, User } from '@app/shared';

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
    const roles = await this.roleRepository.findAll({
      include: [
        {
          model: User,
          attributes: ['user_id', 'email'],
          include: [
            {
              model: Profile,
              attributes: ['profile_id', 'first_name', 'last_name'],
            },
          ],
          through: {
            attributes: [],
          },
        },
      ],
    });

    return roles;
  }

  async getRoleByValue(value: string) {
    const role = await this.roleRepository.findOne({
      where: { value },
      include: [
        {
          model: User,
          attributes: ['user_id', 'email'],
          include: [
            {
              model: Profile,
              attributes: ['profile_id', 'first_name', 'last_name'],
            },
          ],
          through: {
            attributes: [],
          },
        },
      ],
    });

    return role;
  }
}

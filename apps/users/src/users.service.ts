import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserInterface, UserUpdateInterface } from './interface/user.interface';
import { User } from '@app/shared';
import { v4 as uuid } from 'uuid';
import { Repository } from 'sequelize-typescript';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepository: Repository<User>,
    private configService: ConfigService,
  ) {}

  private generateUUID(): string {
    return uuid();
  }

  async createUser(newUser: UserInterface) {
    const user = await this.userRepository.create({
      user_id: this.generateUUID(),
      ...newUser,
    });

    return user;
  }

  async getUsers() {
    const users = await this.userRepository.findAll({
      include: [
        {
          all: true,
        },
      ],
    });

    return users;
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    return user;
  }

  async updateUser(updateUser: UserUpdateInterface) {
    const { user_id, email, password } = updateUser;

    const user = await this.userRepository.findOne({
      where: { user_id },
    });

    if (!user) {
      return null;
    }

    const hashPassword = await this.hashPassword(password);

    await this.userRepository.update(
      { email, password: hashPassword },
      {
        where: { user_id },
      },
    );

    return user;
  }

  async deleteUser(user_id: string) {
    const user = await this.userRepository.findOne({
      where: { user_id },
    });

    if (!user) {
      return null;
    }

    await this.userRepository.destroy({
      where: { user_id },
      force: true,
    });

    return user;
  }

  private async hashPassword(password: string) {
    const saltRounds = this.configService.get<string>('SALT_ROUNDS');

    const salt = await bcrypt.genSalt(parseInt(saltRounds));

    const hashPassword = await bcrypt.hash(password, salt);

    return hashPassword;
  }
}

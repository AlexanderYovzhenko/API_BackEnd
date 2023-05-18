import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserInterface, UserUpdateInterface } from './interface/user.interface';
import { Role, User } from '@app/shared';
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

  async createUser(newUser: UserInterface): Promise<User> {
    const user_id = this.generateUUID();

    await this.userRepository.create({
      user_id,
      ...newUser,
    });

    const user = await this.getUserById(user_id);

    return user;
  }

  async getUsers(): Promise<User[]> {
    const users = await this.userRepository.findAll({
      attributes: ['user_id', 'email', 'createdAt', 'updatedAt'],
      include: [
        {
          model: Role,
          through: {
            attributes: [],
          },
        },
        { all: true },
      ],
    });

    return users;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
      attributes: ['user_id', 'email', 'createdAt', 'updatedAt'],
      include: [
        {
          model: Role,
          through: {
            attributes: [],
          },
        },
        { all: true },
      ],
    });

    return user;
  }

  private async getUserById(user_id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { user_id },
      attributes: ['user_id', 'email', 'createdAt', 'updatedAt'],
      include: [
        {
          model: Role,
          through: {
            attributes: [],
          },
        },
        { all: true },
      ],
    });

    return user;
  }

  async updateUser(updateUser: UserUpdateInterface): Promise<User> {
    const { user_id, email, password } = updateUser;

    const checkUser = await this.getUserById(user_id);

    if (!checkUser) {
      return null;
    }

    const hashPassword = await this.hashPassword(password);

    await this.userRepository.update(
      { email, password: hashPassword },
      {
        where: { user_id },
      },
    );

    const user = await this.getUserById(user_id);

    return user;
  }

  async deleteUser(user_id: string): Promise<User> {
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

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = this.configService.get<string>('SALT_ROUNDS');

    const salt = await bcrypt.genSalt(parseInt(saltRounds));

    const hashPassword = await bcrypt.hash(password, salt);

    return hashPassword;
  }
}

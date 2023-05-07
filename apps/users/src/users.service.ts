import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserInterface } from './interface/user.interface';
import { User } from '@app/shared';
import { v4 as uuid } from 'uuid';
import { Repository } from 'sequelize-typescript';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userRepository: Repository<User>) {} // typeof

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
    const users = await this.userRepository.findAll();

    return users;
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    return user;
  }
}

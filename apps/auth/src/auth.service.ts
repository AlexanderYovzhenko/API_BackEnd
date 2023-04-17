import { User } from '@app/shared';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Repository } from 'sequelize-typescript';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User) private userRepository: Repository<User>) {}

  async getHello() {
    const users = await this.userRepository.findAll({
      include: { all: true },
    });

    return users;
  }
}

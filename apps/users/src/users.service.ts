import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/users.entity';
import { CreateUserDto } from '../dto/createUserDto';
//import { ClientProxy } from '@nestjs/microservices';
import { UserInterface } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userRepository: typeof User) {}

  async createUser(newUser: UserInterface) {
    const { email } = newUser;
    const userExists = await this.getUserByEmail(email);

    if (userExists.count === 0) {
      const user = await this.userRepository.create(newUser);
      return user;
    } else {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
  }

  async getUsers() {
    const users = await this.userRepository.findAll();
    return users;
  }

  async getUserByEmail(email: string) {
    const result = await this.userRepository.findAndCountAll({
      where: { email },
    });
    return result;
  }
}

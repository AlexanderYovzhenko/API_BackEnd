import { User } from '@app/shared';
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Repository } from 'sequelize-typescript';
import * as bcrypt from 'bcryptjs';
import { AuthInterface } from '../interfaces/auth.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async logIn(user: AuthInterface) {
    const validatedUser = await this.validateUser(user);

    return this.generateToken(validatedUser);
  }

  async signUp(userData: AuthInterface) {
    const { email, password } = userData;
    const userExists = await this.userRepository.findAndCountAll({
      where: { email },
    });
    if (userExists) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    const hashPassword = await bcrypt.hash(password, process.env.SALT_ROUNDS);

    return hashPassword;
  }

  private async validateUser(user: AuthInterface) {
    const { email, password } = user;
    const userThatExists = await this.userRepository.findAndCountAll({
      where: { email },
    });
    const foundUser = userThatExists.rows[0];
    if (foundUser) {
      const passwordEquals = await bcrypt.compare(password, foundUser.password);
      if (passwordEquals) {
        return foundUser;
      }
      throw new UnauthorizedException({ message: 'Wrong email or password' });
    }
    throw new UnauthorizedException({ message: 'Wrong email or password' });
  }

  private async generateToken(user: AuthInterface) {
    const payload = { email: user.email };
    return {
      token: this.jwtService.sign(payload),
    };
  }
}

import { User } from '@app/shared';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Repository } from 'sequelize-typescript';
import * as bcrypt from 'bcryptjs';
import { AuthInterface } from './interface/auth.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User)
    private userRepository: Repository<User>,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async logIn(user: AuthInterface) {
    const validatedUser = await this.validateUser(user);

    if (!validatedUser) {
      return null;
    }

    return await this.generateToken(validatedUser);
  }

  async signUp(user: AuthInterface) {
    const { email, password } = user;

    const userExists = await this.userRepository.findOne({
      where: { email },
    });

    if (userExists) {
      return null;
    }

    const hashPassword = await this.hashPassword(password);

    return hashPassword;
  }

  private async validateUser(user: AuthInterface) {
    const { email, password } = user;

    const userExists = await this.userRepository.findOne({
      where: { email },
    });

    if (!userExists) {
      return null;
    }

    const passwordEquals = await this.checkHashPassword(
      password,
      userExists.password,
    );

    if (!passwordEquals) {
      return null;
    }

    return userExists;
  }

  private async generateToken(user: User) {
    const { user_id, email } = user;

    const payload = { user_id, email };

    return {
      token: this.jwtService.sign(payload),
    };
  }

  private async hashPassword(password: string) {
    const saltRounds = this.configService.get<string>('SALT_ROUNDS');

    const salt = await bcrypt.genSalt(parseInt(saltRounds));

    const hashPassword = await bcrypt.hash(password, salt);

    return hashPassword;
  }

  private async checkHashPassword(password: string, passwordExists: string) {
    return await bcrypt.compare(password, passwordExists);
  }
}

import { Role, User } from '@app/shared';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Repository } from 'sequelize-typescript';
import * as bcrypt from 'bcryptjs';
import { AuthInterface } from './interface/auth.interface';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User)
    private userRepository: Repository<User>,
    private configService: ConfigService,
    private jwtService: JwtService,
    private readonly httpService: HttpService,
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
      include: [
        {
          model: Role,
          through: {
            attributes: [],
          },
        },
      ],
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
    const { user_id, email, roles } = user;

    const payload = { user_id, email, roles };

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

  async getVkToken(code: string): Promise<any> {
    const VKDATA = {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
    };

    const host =
      process.env.NODE_ENV === 'prod'
        ? process.env.APP_HOST
        : process.env.APP_LOCAL;

    return await this.httpService.get(
      `https://oauth.vk.com/access_token?client_id=${VKDATA.client_id}&client_secret=${VKDATA.client_secret}&redirect_uri=${host}/signin&code=${code}`,
    );
  }

  async getUserDataFromVk(userId: string, token: string): Promise<any> {
    return await this.httpService.get(
      `https://api.vk.com/method/users.get?user_ids=${userId}&fields=photo_400,has_mobile,home_town,contacts,mobile_phone&access_token=${token}&v=5.120`,
    );
  }
  async vkLogin(auth: string) {
    let authData;

    try {
      authData = await this.getVkToken(auth);
    } catch (err) {
      return null;
    }

    const hasEmail = authData.data.hasOwnProperty('email');
    if (hasEmail) {
      const _user = await this.userRepository.findAndCountAll({
        where: { email: authData.data.email },
      });
      const foundUser = _user.rows[0];
      if (_user) {
        return this.logIn(foundUser);
      }
    }
  }
  async oauthLogin(req) {
    if (!req.user) {
      return null;
    }
    return req.user;
  }
}

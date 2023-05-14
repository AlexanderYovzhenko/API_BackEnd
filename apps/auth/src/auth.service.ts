import { Role, User } from '@app/shared';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Repository } from 'sequelize-typescript';
import * as bcrypt from 'bcryptjs';
import { AuthInterface } from './interface/auth.interface';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';
import { Token } from './entities';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User)
    private userRepository: Repository<User>,
    @InjectModel(Token)
    private tokenRepository: Repository<Token>,
    private configService: ConfigService,
    private jwtService: JwtService,
    private readonly httpService: HttpService,
  ) {}

  private generateUUID(): string {
    return uuid();
  }

  async logIn(user: AuthInterface) {
    const validatedUser = await this.validateUser(user);

    if (!validatedUser) {
      return null;
    }

    const accessToken = await this.generateAccessToken(validatedUser);
    const refreshToken = await this.generateRefreshToken(validatedUser);

    const checkToken = await this.tokenRepository.findOne({
      include: [
        {
          model: User,
          where: {
            user_id: validatedUser.user_id,
          },
        },
      ],
    });

    checkToken
      ? await this.tokenRepository.update(
          { token: refreshToken.refreshToken },
          { where: { token_id: checkToken.token_id } },
        )
      : await this.tokenRepository.create({
          token_id: this.generateUUID(),
          token: refreshToken.refreshToken,
          user_id: validatedUser.user_id,
        });

    return {
      ...accessToken,
      ...refreshToken,
    };
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

  private async generateAccessToken(user: User) {
    const { user_id, roles } = user;
    const payload = { user_id, roles };

    const jwtSecretAccessKey = await this.configService.get(
      'JWT_SECRET_ACCESS_KEY',
    );

    return {
      accessToken: await this.jwtService.signAsync(payload, {
        secret: jwtSecretAccessKey,
        expiresIn: '30m',
      }),
    };
  }

  private async generateRefreshToken(user: User) {
    const { user_id, roles } = user;
    const payload = { user_id, roles };

    const jwtSecretRefreshKey = await this.configService.get(
      'JWT_SECRET_REFRESH_KEY',
    );

    return {
      refreshToken: await this.jwtService.signAsync(payload, {
        secret: jwtSecretRefreshKey,
        expiresIn: '30d',
      }),
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

  async refresh(token: string) {
    try {
      const jwtSecretRefreshKey = this.configService.get(
        'JWT_SECRET_REFRESH_KEY',
      );

      const checkUserData = this.jwtService.verify(token, {
        secret: jwtSecretRefreshKey,
      });

      const checkToken = await this.tokenRepository.findOne({
        where: { token },
      });

      if (!checkUserData || !checkToken) {
        return null;
      }

      const user = await this.userRepository.findOne({
        where: { user_id: checkUserData.user_id },
        include: [
          {
            model: Role,
            through: {
              attributes: [],
            },
          },
        ],
      });

      const accessToken = await this.generateAccessToken(user);
      const refreshToken = await this.generateRefreshToken(user);

      await this.tokenRepository.update(
        { token: refreshToken.refreshToken },
        { where: { token_id: checkToken.token_id } },
      );

      return {
        ...accessToken,
        ...refreshToken,
      };
    } catch (error) {
      return null;
    }
  }

  async logOut(token: string) {
    const result = await this.tokenRepository.destroy({
      where: { token },
      force: true,
    });

    return result;
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

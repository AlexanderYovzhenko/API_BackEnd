import { Role, User } from '@app/shared';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Repository } from 'sequelize-typescript';
import * as bcrypt from 'bcryptjs';
import {
  AuthInterface,
  TokenAuthInterface,
  TokenInterface,
} from './interface/auth.interface';
import { JwtService } from '@nestjs/jwt';
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
  ) {}

  private generateUUID(): string {
    return uuid();
  }

  async signUp(user: AuthInterface): Promise<string | null> {
    const { email, password } = user;

    const checkUser = await this.userRepository.findOne({
      where: { email },
    });

    if (checkUser) {
      return null;
    }

    const hashPassword = await this.hashPassword(password);

    return hashPassword;
  }

  async logIn(user: AuthInterface): Promise<TokenInterface | null> {
    try {
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
    } catch (error) {
      return null;
    }
  }

  async refresh(token: string): Promise<Omit<TokenAuthInterface, 'password'>> {
    try {
      const jwtSecretRefreshKey = await this.configService.get(
        'JWT_SECRET_REFRESH_KEY',
      );

      const checkUserData = this.jwtService.verify(token, {
        secret: jwtSecretRefreshKey,
      });

      if (!checkUserData) {
        return null;
      }

      const checkToken = await this.tokenRepository.findOne({
        include: [{ model: User, where: { user_id: checkUserData.user_id } }],
      });

      if (!checkToken) {
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
        email: user.email,
        ...accessToken,
        ...refreshToken,
      };
    } catch (error) {
      return null;
    }
  }

  async logOut(token: string): Promise<number> {
    const jwtSecretRefreshKey = await this.configService.get(
      'JWT_SECRET_REFRESH_KEY',
    );

    const checkUserData = this.jwtService.verify(token, {
      secret: jwtSecretRefreshKey,
    });

    if (!checkUserData) {
      return 0;
    }

    const checkToken = await this.tokenRepository.findOne({
      include: [{ model: User, where: { user_id: checkUserData.user_id } }],
    });

    const result = await this.tokenRepository.destroy({
      where: { token_id: checkToken.token_id },
      force: true,
    });

    return result;
  }

  async isAuth(token: string): Promise<boolean> {
    try {
      const jwtSecretRefreshKey = await this.configService.get(
        'JWT_SECRET_REFRESH_KEY',
      );

      const checkUserData = this.jwtService.verify(token, {
        secret: jwtSecretRefreshKey,
      });

      if (!checkUserData) {
        return false;
      }

      const checkToken = await this.tokenRepository.findOne({
        include: [{ model: User, where: { user_id: checkUserData.user_id } }],
      });

      if (!checkToken) {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  async googleAuth(
    email: string,
  ): Promise<TokenAuthInterface | Omit<TokenAuthInterface, 'password' | null>> {
    try {
      return await this.addUserGoogleVk(email);
    } catch (error) {
      return null;
    }
  }

  async vkAuth(
    code: string,
  ): Promise<TokenAuthInterface | Omit<TokenAuthInterface, 'password' | null>> {
    try {
      const email = await this.getVkUserData(code);

      if (!email) {
        return null;
      }

      return await this.addUserGoogleVk(email);
    } catch (err) {
      return null;
    }
  }

  async getVkUserData(code: string): Promise<string | null> {
    const client_id = await this.configService.get('VK_CLIENT_ID');
    const client_secret = await this.configService.get('VK_SECRET');
    const host = await this.configService.get('VK_SERVER_CALLBACK');

    const url = `https://oauth.vk.com/access_token?client_id=${client_id}&client_secret=${client_secret}&redirect_uri=${host}&code=${code}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.hasOwnProperty('email')) {
      const { email } = data;

      return email;
    }

    return null;
  }

  private async addUserGoogleVk(
    email: string,
  ): Promise<TokenAuthInterface | Omit<TokenAuthInterface, 'password'>> {
    const password = this.generateUUID();

    const checkUser = await this.userRepository.findOrCreate({
      where: { email },
      defaults: {
        user_id: this.generateUUID(),
        email,
        password: await this.hashPassword(password),
      },
    });

    const user = await this.userRepository.findOne({
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

    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);

    const checkToken = await this.tokenRepository.findOne({
      include: [
        {
          model: User,
          where: {
            user_id: user.user_id,
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
          user_id: user.user_id,
        });

    if (checkUser[1]) {
      return {
        email,
        password,
        ...accessToken,
        ...refreshToken,
      };
    }

    return {
      email,
      ...accessToken,
      ...refreshToken,
    };
  }

  private async validateUser(user: AuthInterface): Promise<User> {
    const { email, password } = user;

    const checkUser = await this.userRepository.findOne({
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

    if (!checkUser) {
      return null;
    }

    const passwordEquals = await this.checkHashPassword(
      password,
      checkUser.password,
    );

    if (!passwordEquals) {
      return null;
    }

    return checkUser;
  }

  private async generateAccessToken(user: User): Promise<{
    accessToken: string;
  }> {
    const { user_id, email, roles } = user;
    const payload = { user_id, email, roles };

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

  private async generateRefreshToken(user: User): Promise<{
    refreshToken: string;
  }> {
    const { user_id, email, roles } = user;
    const payload = { user_id, email, roles };

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

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = await this.configService.get('SALT_ROUNDS');

    const salt = await bcrypt.genSalt(parseInt(saltRounds));

    const hashPassword = await bcrypt.hash(password, salt);

    return hashPassword;
  }

  private async checkHashPassword(
    password: string,
    passwordExists: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, passwordExists);
  }
}

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-vkontakte';
import { config } from 'dotenv';

config();

@Injectable()
export class VkStrategy extends PassportStrategy(Strategy, 'vk') {
  constructor() {
    super({
      clientID: process.env.VK_CLIENT_ID,
      clientSecret: process.env.VK_SECRET,
      callbackURL: process.env.VK_SERVER_CALLBACK,
      scope: ['email'],
      profileFields: ['email', 'photo_400_orig'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<any> {
    const { emails } = profile;
    const user = {
      email: emails[0].value,
    };

    done(null, user);
  }
}

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-vkontakte';

@Injectable()
export class VkStrategy extends PassportStrategy(Strategy, 'vk') {
  constructor() {
    super({
      clientID: process.env.VK_CLIENT_ID,
      clientSecret: process.env.VK_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/vk/callback',
      scope: ['email'],
      profileFields: ['email', 'photo_400_orig'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    const user = {
      vkId: profile.id,
      email: profile.emails[0].value,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      photo: profile.photos[0].value,
      accessToken,
    };
    done(null, user);
  }
}

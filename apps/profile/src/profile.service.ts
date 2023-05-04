import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { ProfileInterface } from './interfaces/profile.interface';
import { Profile } from '@app/shared';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile) private profileRepository: typeof Profile,
  ) {}

  async createProfile(newProfile: ProfileInterface) {
    const profile = await this.profileRepository.create(newProfile);

    return profile;
  }

  async getProfiles() {
    const users = await this.profileRepository.findAll({
      include: { all: true },
    });
    return users;
  }

  async getProfileById(user_id: string) {
    const profile = await this.profileRepository.findAndCountAll({
      where: { user_id },
    });

    return profile;
  }

  async updateProfile(
    user_id: string,
    first_name: string,
    last_name: string,
    phone: string,
    city: string,
  ) {
    await this.profileRepository.update(
      { first_name, last_name, phone, city },
      { where: { user_id } },
    );

    const updatedProfile = await this.getProfileById(user_id);

    return updatedProfile;
  }

  async deleteProfile(user_id: string) {
    const profile = await this.getProfileById(user_id);

    if (!profile) {
      return null;
    }

    await this.profileRepository.destroy({
      where: { user_id },
      force: true,
    });

    return profile;
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Repository } from 'sequelize-typescript';
import { ProfileInterface } from './interface/profile.interface';
import { Profile } from '@app/shared';
import { v4 as uuid } from 'uuid';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile) private profileRepository: Repository<Profile>,
  ) {}

  generateUUID(): string {
    return uuid();
  }

  async createProfile(newProfile: ProfileInterface) {
    const profile = await this.profileRepository.create({
      profile_id: this.generateUUID(),
      ...newProfile,
    });

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

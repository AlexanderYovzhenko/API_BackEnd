import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Repository } from 'sequelize-typescript';
import { ProfileInterface } from './interface/profile.interface';
import { Profile, User } from '@app/shared';
import { v4 as uuid } from 'uuid';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile) private profileRepository: Repository<Profile>,
    @InjectModel(User) private userRepository: Repository<User>,
  ) {}

  private generateUUID(): string {
    return uuid();
  }

  async createProfile(newProfile: ProfileInterface) {
    const { user_id, phone } = newProfile;

    const user = await this.getProfileById(user_id);

    if (!user) {
      return null;
    }

    if (user.profile) {
      return 'profile already exists';
    }

    const checkPhone = await this.profileRepository.findOne({
      where: { phone },
    });

    if (checkPhone) {
      return 'phone already exists';
    }

    const profile = await this.profileRepository.create({
      profile_id: this.generateUUID(),
      ...newProfile,
    });

    return profile;
  }

  async getProfiles() {
    const users = await this.userRepository.findAll({
      include: { all: true },
    });

    return users;
  }

  async getProfileById(user_id: string) {
    const profile = await this.userRepository.findOne({
      where: { user_id },
      include: { all: true },
    });

    return profile;
  }

  async updateProfile(updateProfile: ProfileInterface) {
    const { user_id, first_name, last_name, phone, city } = updateProfile;

    const checkUser = await this.getProfileById(user_id);

    if (!checkUser || !checkUser.profile) {
      return null;
    }

    const profile_id = checkUser.profile.profile_id;

    await this.profileRepository.update(
      { first_name, last_name, phone, city },
      {
        where: { profile_id },
      },
    );

    const updatedProfile = await this.getProfileById(user_id);

    return updatedProfile;
  }

  async deleteProfile(user_id: string) {
    const user = await this.getProfileById(user_id);

    if (!user || !user.profile) {
      return null;
    }

    const profile_id = user.profile.profile_id;

    await this.profileRepository.destroy({
      where: { profile_id },
      force: true,
    });

    return user;
  }
}

import { Controller, Inject } from '@nestjs/common';
import { ProfileInterface } from './interface/profile.interface';
import { ProfileService } from './profile.service';
import { SharedService } from '@app/shared';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

@Controller()
export class ProfileController {
  constructor(
    @Inject('SharedServiceInterface')
    private readonly sharedService: SharedService,
    private readonly profileService: ProfileService,
  ) {}

  @MessagePattern({ cmd: 'create_profile' })
  async createProfile(
    @Ctx() context: RmqContext,
    @Payload() profile: ProfileInterface,
  ) {
    this.sharedService.acknowledgeMessage(context);

    return await this.profileService.createProfile(profile);
  }

  @MessagePattern({ cmd: 'get_all_profiles' })
  async getProfiles(@Ctx() context: RmqContext) {
    this.sharedService.acknowledgeMessage(context);

    return await this.profileService.getProfiles();
  }

  @MessagePattern({ cmd: 'get_profile_by_user_id' })
  async getProfileById(
    @Ctx() context: RmqContext,
    @Payload()
    user_id: string,
  ) {
    this.sharedService.acknowledgeMessage(context);

    return await this.profileService.getProfileById(user_id);
  }

  @MessagePattern({ cmd: 'update_profile' })
  async updateProfile(
    @Ctx() context: RmqContext,
    @Payload()
    updateProfile: ProfileInterface,
  ) {
    this.sharedService.acknowledgeMessage(context);

    return await this.profileService.updateProfile(updateProfile);
  }

  @MessagePattern({ cmd: 'delete_profile' })
  async deleteProfile(@Ctx() context: RmqContext, @Payload() user_id: string) {
    this.sharedService.acknowledgeMessage(context);

    return await this.profileService.deleteProfile(user_id);
  }
}

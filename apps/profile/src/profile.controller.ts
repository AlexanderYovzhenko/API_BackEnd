import { Controller, Inject } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { ProfileInterface } from './interfaces/profile.interface';
import { ProfileService } from './profile.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SharedService } from '@app/shared';

@ApiTags('Endpoints')
@ApiBearerAuth()
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
  getProfiles(@Ctx() context: RmqContext) {
    this.sharedService.acknowledgeMessage(context);

    return this.profileService.getProfiles();
  }

  @MessagePattern({ cmd: 'get_profile_by_user_id' })
  async getProfileById(
    @Ctx() context: RmqContext,
    @Payload()
    user_id: string,
  ) {
    this.sharedService.acknowledgeMessage(context);

    const result = await this.profileService.getProfileById(user_id);
    return result.rows;
  }

  @MessagePattern({ cmd: 'update_profile' })
  async updateProfile(
    @Ctx() context: RmqContext,
    @Payload()
    data: {
      user_id: string;
      first_name: string;
      last_name: string;
      phone: string;
      city: string;
    },
  ) {
    this.sharedService.acknowledgeMessage(context);

    return await this.profileService.updateProfile(
      data.user_id,
      data.first_name,
      data.last_name,
      data.phone,
      data.city,
    );
  }

  @MessagePattern({ cmd: 'delete_profile' })
  async deleteProfile(@Ctx() context: RmqContext, @Payload() user_id: string) {
    this.sharedService.acknowledgeMessage(context);

    return await this.profileService.deleteProfile(user_id);
  }
}

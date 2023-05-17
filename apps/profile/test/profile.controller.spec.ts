import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from '../src/profile.controller';
import { ProfileService } from '../src/profile.service';
import { SharedService } from '@app/shared';
import { ConfigService } from '@nestjs/config';
import { RmqContext } from '@nestjs/microservices';
import { context, mockUsersService, mockSharedService } from './mocks';
import { userStub } from './stubs/user.stub';
import { profileStub } from './stubs/profile.stub';

describe('ProfileController', () => {
  let profileController: ProfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [
        ProfileService,
        {
          provide: ProfileService,
          useValue: mockUsersService,
        },
        {
          provide: 'SharedServiceInterface',
          useClass: SharedService,
        },
        {
          provide: SharedService,
          useValue: mockSharedService,
        },
        {
          provide: ConfigService,
          useValue: {
            get(): string {
              return 'mock-value';
            },
          },
        },
      ],
    }).compile();

    profileController = module.get<ProfileController>(ProfileController);
  });

  it('should be defined', () => {
    expect(profileController).toBeDefined();
  });

  describe('createProfile', () => {
    it('should be defined', async () => {
      return expect(
        await profileController.createProfile(
          context as RmqContext,
          profileStub(),
        ),
      ).toBeDefined();
    });

    it('should return an user with profile', async () => {
      const result = await profileController.createProfile(
        context as RmqContext,
        profileStub(),
      );

      expect(result).toEqual(userStub());
    });
  });

  describe('getProfiles', () => {
    it('should be defined', async () => {
      return expect(
        await profileController.getProfiles(context as RmqContext),
      ).toBeDefined();
    });

    it('should return array users with profiles', async () => {
      const result = await profileController.getProfiles(context as RmqContext);

      expect(result).toEqual([userStub()]);
    });
  });

  describe('getProfileById', () => {
    it('should be defined', async () => {
      return expect(
        await profileController.getProfileById(
          context as RmqContext,
          userStub().user_id,
        ),
      ).toBeDefined();
    });

    it('should return an user with profile', async () => {
      const result = await profileController.getProfileById(
        context as RmqContext,
        userStub().user_id,
      );

      expect(result).toEqual(userStub());
    });
  });

  describe('updateProfile', () => {
    it('should be defined', async () => {
      return expect(
        await profileController.updateProfile(
          context as RmqContext,
          profileStub(),
        ),
      ).toBeDefined();
    });

    it('should return an user with profile', async () => {
      const result = await profileController.updateProfile(
        context as RmqContext,
        profileStub(),
      );

      expect(result).toEqual(userStub());
    });
  });

  describe('deleteProfile', () => {
    it('should be defined', async () => {
      return expect(
        await profileController.deleteProfile(
          context as RmqContext,
          userStub().user_id,
        ),
      ).toBeDefined();
    });

    it('should return an user with profile', async () => {
      const result = await profileController.deleteProfile(
        context as RmqContext,
        userStub().user_id,
      );

      expect(result).toEqual(userStub());
    });
  });
});

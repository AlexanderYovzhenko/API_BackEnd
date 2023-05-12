import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { ProfileService } from '../src/profile.service';
import { Profile, User } from '@app/shared';
import { mockProfileRepository, mockUserRepository } from './mocks';
import { userStub, userWithProfileStub } from './stubs/user.stub';
import { profileStub } from './stubs/profile.stub';

describe('ProfileService', () => {
  let profileService: ProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        {
          provide: getModelToken(Profile),
          useValue: mockProfileRepository,
        },
        {
          provide: getModelToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    profileService = module.get<ProfileService>(ProfileService);
  });

  it('should be defined', () => {
    expect(profileService).toBeDefined();
  });

  describe('createProfile', () => {
    it('should be defined', async () => {
      expect(await profileService.createProfile(profileStub())).toBeDefined();
    });

    it('should be return new profile', async () => {
      expect(
        await profileService.createProfile({
          user_id: '7982ecf2-8fae-471c-8ddf-2e3cbdab360e',
          first_name: 'Alex',
          last_name: 'Bar',
          phone: '87005559999',
          city: 'Moscow',
        }),
      ).toEqual(userStub());
    });

    it('should be return phone already exists', async () => {
      expect(await profileService.createProfile(profileStub())).toEqual(
        'phone already exists',
      );
    });

    it('should be return null', async () => {
      expect(
        await profileService.createProfile({
          user_id: '5082ecf2-8fae-471c-8ddf-2e3cbdab360e',
          first_name: 'Alex',
          last_name: 'Bar',
          phone: '87005559999',
          city: 'Moscow',
        }),
      ).toEqual(null);
    });
  });

  describe('getProfiles', () => {
    it('should be defined', async () => {
      expect(await profileService.getProfiles()).toBeDefined();
    });

    it('should be return array all users with profiles', async () => {
      expect(await profileService.getProfiles()).toEqual([
        userWithProfileStub(),
      ]);
    });
  });

  describe('getProfileById', () => {
    it('should be defined', async () => {
      expect(
        await profileService.getProfileById(userStub().user_id),
      ).toBeDefined();
    });

    it('should be return an user by id with profile', async () => {
      expect(await profileService.getProfileById(userStub().user_id)).toEqual(
        userStub(),
      );
    });

    it('should be return null', async () => {
      expect(await profileService.getProfileById('123')).toEqual(null);
    });
  });

  describe('updateProfile', () => {
    it('should be defined', async () => {
      expect(await profileService.updateProfile(profileStub())).toBeDefined();
    });

    it('should be return null', async () => {
      expect(await profileService.updateProfile(profileStub())).toEqual(null);
    });
  });

  describe('deleteProfile', () => {
    it('should be defined', async () => {
      expect(
        await profileService.deleteProfile(profileStub().user_id),
      ).toBeDefined();
    });

    it('should be return null', async () => {
      expect(await profileService.deleteProfile(profileStub().user_id)).toEqual(
        null,
      );
    });
  });
});

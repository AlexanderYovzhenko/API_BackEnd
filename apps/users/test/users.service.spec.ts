import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { UsersService } from '../src/users.service';
import { User } from '@app/shared';
import { mockUserRepository } from './mocks';
import { userStub } from './stubs/user.stub';
import { ConfigService } from '@nestjs/config';

describe('UsersService', () => {
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User),
          useValue: mockUserRepository,
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

    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('createUser', () => {
    it('should be defined', async () => {
      expect(await usersService.createUser(userStub())).toBeDefined();
    });

    it('should be return new user', async () => {
      expect(await usersService.createUser(userStub())).toEqual(userStub());
    });
  });

  describe('getUsers', () => {
    it('should be defined', async () => {
      expect(await usersService.getUsers()).toBeDefined();
    });

    it('should be return array all users', async () => {
      expect(await usersService.getUsers()).toEqual([userStub()]);
    });
  });

  describe('getUserByEmail', () => {
    it('should be defined', async () => {
      expect(await usersService.getUserByEmail('admin')).toBeDefined();
    });

    it('should be return an user by email', async () => {
      expect(await usersService.getUserByEmail('admin@gmail.com')).toEqual(
        userStub(),
      );
    });

    it('should be return null', async () => {
      expect(await usersService.getUserByEmail('user@gmail.com')).toEqual(null);
    });
  });

  describe('updateUser', () => {
    it('should be defined', async () => {
      expect(await usersService.updateUser(userStub())).toBeDefined();
    });

    it('should be return update user', async () => {
      expect(await usersService.updateUser(userStub())).toEqual(userStub());
    });
  });

  describe('deleteUser', () => {
    it('should be defined', async () => {
      expect(
        await usersService.deleteUser('7982ecf2-8fae-471c-8ddf-2e3cbdab360e'),
      ).toBeDefined();
    });

    it('should be return deleted role to user', async () => {
      expect(
        await usersService.deleteUser('7982ecf2-8fae-471c-8ddf-2e3cbdab360e'),
      ).toEqual(userStub());
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../src/users.controller';
import { UsersService } from '../src/users.service';
import { SharedService } from '@app/shared';
import { ConfigService } from '@nestjs/config';
import { RmqContext } from '@nestjs/microservices';
import { context, mockUsersService, mockSharedService } from './mocks';
import { userStub } from './stubs/user.stub';

describe('UsersController', () => {
  let usersController: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: UsersService,
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

    usersController = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('createUser', () => {
    it('should be defined', async () => {
      return expect(
        await usersController.createUser(context as RmqContext, userStub()),
      ).toBeDefined();
    });

    it('should return an user', async () => {
      const result = await usersController.createUser(
        context as RmqContext,
        userStub(),
      );

      expect(result).toEqual(userStub());
    });
  });

  describe('getUsers', () => {
    it('should be defined', async () => {
      return expect(
        await usersController.getUsers(context as RmqContext),
      ).toBeDefined();
    });

    it('should return array users', async () => {
      const result = await usersController.getUsers(context as RmqContext);

      expect(result).toEqual([userStub()]);
    });
  });

  describe('getUserByEmail', () => {
    it('should be defined', async () => {
      return expect(
        await usersController.getUserByEmail(
          context as RmqContext,
          'admin@gmail.com',
        ),
      ).toBeDefined();
    });

    it('should return an user', async () => {
      const result = await usersController.getUserByEmail(
        context as RmqContext,
        'admin@gmail.com',
      );

      expect(result).toEqual(userStub());
    });
  });

  describe('updateUser', () => {
    it('should be defined', async () => {
      return expect(
        await usersController.updateUser(context as RmqContext, userStub()),
      ).toBeDefined();
    });

    it('should return an user', async () => {
      const result = await usersController.updateUser(
        context as RmqContext,
        userStub(),
      );

      expect(result).toEqual(userStub());
    });
  });

  describe('deleteUser', () => {
    it('should be defined', async () => {
      return expect(
        await usersController.deleteUser(
          context as RmqContext,
          userStub().user_id,
        ),
      ).toBeDefined();
    });

    it('should return an user', async () => {
      const result = await usersController.deleteUser(
        context as RmqContext,
        userStub().user_id,
      );

      expect(result).toEqual(userStub());
    });
  });
});

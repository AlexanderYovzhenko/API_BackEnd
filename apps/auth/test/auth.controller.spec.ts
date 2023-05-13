import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../src/auth.controller';
import { AuthService } from '../src/auth.service';
import { SharedService } from '@app/shared';
import { ConfigService } from '@nestjs/config';
import { RmqContext } from '@nestjs/microservices';
import { context, mockAuthService, mockSharedService } from './mocks';
import { authStub, tokenStub } from './stubs/auth.stub';

describe('AuthController', () => {
  let authController: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: AuthService,
          useValue: mockAuthService,
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

    authController = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('logIn', () => {
    it('should be defined', async () => {
      return expect(
        await authController.logIn(context as RmqContext, authStub()),
      ).toBeDefined();
    });

    it('should return a token', async () => {
      const result = await authController.logIn(
        context as RmqContext,
        authStub(),
      );

      expect(result).toEqual(tokenStub());
    });
  });

  describe('signUp', () => {
    it('should be defined', async () => {
      return expect(
        await authController.signUp(context as RmqContext, authStub()),
      ).toBeDefined();
    });

    it('should return new user', async () => {
      const result = await authController.signUp(
        context as RmqContext,
        authStub(),
      );

      expect(result).toEqual(authStub());
    });
  });
});

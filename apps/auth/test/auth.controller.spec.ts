import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../src/auth.controller';
import { AuthService } from '../src/auth.service';
import { SharedService } from '@app/shared';
import { ConfigService } from '@nestjs/config';
import { RmqContext } from '@nestjs/microservices';
import { context, mockAuthService, mockSharedService } from './mocks';
import { authStub, tokensStub } from './stubs/auth.stub';

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

    it('should return tokens', async () => {
      const result = await authController.logIn(
        context as RmqContext,
        authStub(),
      );

      expect(result).toEqual(tokensStub());
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

  describe('refresh', () => {
    it('should be defined', async () => {
      return expect(
        await authController.refresh(
          context as RmqContext,
          tokensStub().refreshToken,
        ),
      ).toBeDefined();
    });

    it('should return tokens', async () => {
      const result = await authController.refresh(
        context as RmqContext,
        tokensStub().refreshToken,
      );

      expect(result).toEqual(tokensStub());
    });
  });

  describe('logOut', () => {
    it('should be defined', async () => {
      return expect(
        await authController.logOut(
          context as RmqContext,
          tokensStub().refreshToken,
        ),
      ).toBeDefined();
    });

    it('should return 1', async () => {
      const result = await authController.logOut(
        context as RmqContext,
        tokensStub().refreshToken,
      );

      expect(result).toEqual(1);
    });
  });

  describe('googleAuth', () => {
    it('should be defined', async () => {
      return expect(
        await authController.googleAuth(
          context as RmqContext,
          authStub().email,
        ),
      ).toBeDefined();
    });

    it('should return tokens', async () => {
      const result = await authController.googleAuth(
        context as RmqContext,
        authStub().email,
      );

      expect(result).toEqual(tokensStub());
    });
  });

  describe('vkAuth', () => {
    it('should be defined', async () => {
      return expect(
        await authController.vkAuth(context as RmqContext, authStub().email),
      ).toBeDefined();
    });

    it('should return tokens', async () => {
      const result = await authController.vkAuth(
        context as RmqContext,
        authStub().email,
      );

      expect(result).toEqual(tokensStub());
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { AuthService } from '../src/auth.service';
import { User } from '@app/shared';
import { Token } from '../src/entities';
import { mockTokenRepository, mockUserRepository } from './mocks';
import { authStub, hashPasswordStub, tokensStub } from './stubs/auth.stub';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getModelToken(Token),
          useValue: mockTokenRepository,
        },
        {
          provide: ConfigService,
          useValue: {
            get(): string {
              return 'mock-value';
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign(): string {
              return tokensStub().accessToken;
            },
            signAsync() {
              return tokensStub().accessToken;
            },
            verify(): any {
              return { id: authStub().user_id, email: authStub().email };
            },
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('logIn', () => {
    it('should be defined', async () => {
      expect(await authService.logIn(authStub())).toBeDefined();
    });

    it('should be return null', async () => {
      expect(
        await authService.logIn({ ...authStub(), password: 'user' }),
      ).toEqual(null);
    });
  });

  describe('signUp', () => {
    it('should be defined', async () => {
      expect(await authService.signUp(authStub())).toBeDefined();
    });

    it('should be return null', async () => {
      expect(await authService.signUp(authStub())).toEqual(null);
    });

    it('should be return hash password', async () => {
      expect(
        await authService.signUp({
          email: 'anton@gmail.com',
          password: 'password',
        }),
      ).toMatch(hashPasswordStub().hashPassword);
    });
  });

  describe('refresh', () => {
    it('should be defined', async () => {
      expect(
        await authService.refresh(tokensStub().refreshToken),
      ).toBeDefined();
    });

    it('should be return null', async () => {
      expect(await authService.refresh(tokensStub().accessToken)).toEqual(null);
    });
  });

  describe('logOut', () => {
    it('should be defined', async () => {
      expect(await authService.logOut(tokensStub().refreshToken)).toBeDefined();
    });

    it('should be return 1', async () => {
      expect(await authService.logOut(tokensStub().refreshToken)).toEqual(1);
    });
  });

  describe('googleAuth', () => {
    it('should be defined', async () => {
      expect(await authService.googleAuth(authStub().email)).toBeDefined();
    });

    it('should be return null', async () => {
      expect(await authService.googleAuth(authStub().email)).toEqual(null);
    });
  });

  describe('vkAuth', () => {
    it('should be defined', async () => {
      expect(await authService.vkAuth('12345')).toBeDefined();
    });

    it('should be return null', async () => {
      expect(await authService.vkAuth('12345')).toEqual(null);
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { AuthService } from '../src/auth.service';
import { User } from '@app/shared';
import { mockUserRepository } from './mocks';
import { authStub, hashPasswordStub, tokenStub } from './stubs/auth.stub';
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
              return tokenStub().token;
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

    it('should be return token', async () => {
      expect(
        await authService.logIn({ ...authStub(), password: 'admin' }),
      ).toEqual(tokenStub());
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
});

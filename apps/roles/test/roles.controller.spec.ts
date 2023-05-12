import { Test, TestingModule } from '@nestjs/testing';
import { RolesController } from '../src/roles.controller';
import { RolesService } from '../src/roles.service';
import { SharedService } from '@app/shared';
import { ConfigService } from '@nestjs/config';
import { RmqContext } from '@nestjs/microservices';
import { context, mockRolesService, mockSharedService } from './mocks';
import { roleStub } from './stubs/role.stub';
import { userRoleStub } from './stubs/userRole.stub';

describe('RolesController', () => {
  let rolesController: RolesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [
        RolesService,
        {
          provide: RolesService,
          useValue: mockRolesService,
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

    rolesController = module.get<RolesController>(RolesController);
  });

  it('should be defined', () => {
    expect(rolesController).toBeDefined();
  });

  describe('createRole', () => {
    it('should be defined', async () => {
      return expect(
        await rolesController.createRole(context as RmqContext, roleStub()),
      ).toBeDefined();
    });

    it('should return a role', async () => {
      const result = await rolesController.createRole(
        context as RmqContext,
        roleStub(),
      );

      expect(result).toEqual(roleStub());
    });
  });

  describe('getRoleByValue', () => {
    it('should be defined', async () => {
      return expect(
        await rolesController.getRoleByValue(context as RmqContext, 'admin'),
      ).toBeDefined();
    });

    it('should return a role', async () => {
      const result = await rolesController.getRoleByValue(
        context as RmqContext,
        'admin',
      );

      expect(result).toEqual(roleStub());
    });
  });

  describe('getRoles', () => {
    it('should be defined', async () => {
      return expect(
        await rolesController.getRoles(context as RmqContext),
      ).toBeDefined();
    });

    it('should return array roles', async () => {
      const result = await rolesController.getRoles(context as RmqContext);

      expect(result).toEqual([roleStub()]);
    });
  });

  describe('updateRole', () => {
    it('should be defined', async () => {
      return expect(
        await rolesController.updateRole(context as RmqContext, {
          value: 'user',
          updateRole: roleStub(),
        }),
      ).toBeDefined();
    });

    it('should return a role', async () => {
      const result = await rolesController.updateRole(context as RmqContext, {
        value: 'user',
        updateRole: roleStub(),
      });

      expect(result).toEqual(roleStub());
    });
  });

  describe('createUserRole', () => {
    it('should be defined', async () => {
      return expect(
        await rolesController.createUserRole(
          context as RmqContext,
          userRoleStub(),
        ),
      ).toBeDefined();
    });

    it('should return a role to user', async () => {
      const result = await rolesController.createUserRole(
        context as RmqContext,
        userRoleStub(),
      );

      expect(result).toEqual(userRoleStub());
    });
  });

  describe('deleteUserRole', () => {
    it('should be defined', async () => {
      return expect(
        await rolesController.deleteUserRole(
          context as RmqContext,
          userRoleStub(),
        ),
      ).toBeDefined();
    });

    it('should return a role to user', async () => {
      const result = await rolesController.deleteUserRole(
        context as RmqContext,
        userRoleStub(),
      );

      expect(result).toEqual(userRoleStub());
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { RolesService } from '../src/roles.service';
import { Role, UserRole } from '@app/shared';
import { mockRoleRepository, mockUserRoleRepository } from './mocks';
import { roleStub } from './stubs/role.stub';
import { userRoleStub } from './stubs/userRole.stub';

describe('RolesService', () => {
  let rolesService: RolesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        {
          provide: getModelToken(Role),
          useValue: mockRoleRepository,
        },
        {
          provide: getModelToken(UserRole),
          useValue: mockUserRoleRepository,
        },
      ],
    }).compile();

    rolesService = module.get<RolesService>(RolesService);
  });

  it('should be defined', () => {
    expect(rolesService).toBeDefined();
  });

  describe('createRole', () => {
    it('should be defined', async () => {
      expect(await rolesService.createRole(roleStub())).toBeDefined();
    });

    it('should be return new role', async () => {
      expect(
        await rolesService.createRole({
          value: 'user',
          description: 'Пользователь',
        }),
      ).toEqual({
        role_id: expect.any(String),
        value: 'user',
        description: 'Пользователь',
      });
    });

    it('should be return null', async () => {
      expect(await rolesService.createRole(roleStub())).toEqual(null);
    });
  });

  describe('getRoles', () => {
    it('should be defined', async () => {
      expect(await rolesService.getRoles()).toBeDefined();
    });

    it('should be return array persons', async () => {
      expect(await rolesService.getRoles()).toEqual([roleStub()]);
    });
  });

  describe('getRoleByValue', () => {
    it('should be defined', async () => {
      expect(await rolesService.getRoleByValue('admin')).toBeDefined();
    });

    it('should be return a role', async () => {
      expect(await rolesService.getRoleByValue('admin')).toEqual(roleStub());
    });

    it('should be return null', async () => {
      expect(await rolesService.getRoleByValue('super user')).toEqual(null);
    });
  });

  describe('updateRole', () => {
    it('should be defined', async () => {
      expect(
        await rolesService.updateRole({
          value: 'admin',
          updateRole: roleStub(),
        }),
      ).toBeDefined();
    });

    it('should be return role not found', async () => {
      expect(
        await rolesService.updateRole({
          value: 'user',
          updateRole: roleStub(),
        }),
      ).toEqual('role not found');
    });

    it('should be return null', async () => {
      expect(
        await rolesService.updateRole({
          value: 'admin',
          updateRole: roleStub(),
        }),
      ).toEqual(null);
    });
  });

  describe('createUserRole', () => {
    it('should be defined', async () => {
      expect(await rolesService.createUserRole(userRoleStub())).toBeDefined();
    });

    it('should be return create role to user', async () => {
      expect(
        await rolesService.createUserRole({
          user_id: '5082ecf2-8fae-471c-8ddf-2e3cbdab360e',
          role_id: '5082ecf2-8fae-471c-8ddf-2e3cbdab360e',
        }),
      ).toEqual({
        user_role_id: expect.any(String),
        user_id: '5082ecf2-8fae-471c-8ddf-2e3cbdab360e',
        role_id: '5082ecf2-8fae-471c-8ddf-2e3cbdab360e',
      });
    });

    it('should be return null', async () => {
      expect(await rolesService.createUserRole(userRoleStub())).toEqual(null);
    });
  });

  describe('deleteUserRole', () => {
    it('should be defined', async () => {
      expect(await rolesService.deleteUserRole(userRoleStub())).toBeDefined();
    });

    it('should be return deleted role to user', async () => {
      expect(await rolesService.deleteUserRole(userRoleStub())).toEqual(
        userRoleStub(),
      );
    });

    it('should be return null', async () => {
      expect(
        await rolesService.deleteUserRole({
          user_id: '5082ecf2-8fae-471c-8ddf-2e3cbdab360e',
          role_id: '5082ecf2-8fae-471c-8ddf-2e3cbdab360e',
        }),
      ).toEqual(null);
    });
  });
});

import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

// decorator by roles(array roles)
export const Roles = (...roles: string[]) =>
  SetMetadata(
    ROLES_KEY,
    roles.map((role) => role.toLocaleLowerCase()),
  );

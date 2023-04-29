import { ApiProperty } from '@nestjs/swagger';

export class CreateUserRoleDto {
  @ApiProperty({
    example: 1,
    description: 'id of the user from the users table',
  })
  readonly user_id: number;
  @ApiProperty({
    example: 2,
    description: 'id of the role from the roles table',
  })
  readonly role_id: number;
}

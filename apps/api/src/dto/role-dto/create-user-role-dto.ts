import { ApiProperty } from '@nestjs/swagger';

export class CreateUserRoleDto {
  @ApiProperty({
    example: 'aacc5a0d-5c4b-4052-9978-bdc7e320f7ee',
    description: 'id of the user from the user table',
  })
  readonly user_id: string;
  @ApiProperty({
    example: 'c3b3e340-06a9-47df-80bd-e98d29bfbb45',
    description: 'id of the role from the role table',
  })
  readonly role_id: string;
}

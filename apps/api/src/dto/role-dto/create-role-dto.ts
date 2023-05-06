import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({
    example: 'user',
    description: 'name of the role',
  })
  readonly value: string;
  @ApiProperty({
    example: 'basic user',
    description: 'description fo the role',
  })
  readonly description: string;
}

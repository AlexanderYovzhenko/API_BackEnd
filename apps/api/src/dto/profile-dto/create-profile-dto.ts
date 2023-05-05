import { ApiProperty } from '@nestjs/swagger';

export class CreateProfileDto {
  @ApiProperty({
    example: '1',
    description: 'user id from user table',
  })
  readonly user_id: string;

  @ApiProperty({
    example: 'Victor',
    description: 'Name of a user',
  })
  readonly first_name: string;

  @ApiProperty({
    example: 'Barinov',
    description: 'Surname of a user',
  })
  readonly last_name: string;

  @ApiProperty({
    example: '88005553535',
    description: 'Phone number of a user',
  })
  readonly phone: string;

  @ApiProperty({
    example: 'Moscow',
    description: 'City of a user',
  })
  readonly city: string;
}

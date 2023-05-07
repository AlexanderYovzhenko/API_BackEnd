import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({
    example: 'Maxim',
    description: 'Name of a user',
    required: false,
  })
  readonly first_name: string;

  @ApiProperty({
    example: 'Ivanov',
    description: 'Surname of a user',
    required: false,
  })
  readonly last_name: string;

  @ApiProperty({
    example: '88005653536',
    description: 'Phone number of a user',
    required: false,
  })
  readonly phone: string;

  @ApiProperty({
    example: 'Kazan',
    description: 'City of a user',
    required: false,
  })
  readonly city: string;
}

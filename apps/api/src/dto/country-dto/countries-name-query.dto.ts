import { ApiProperty } from '@nestjs/swagger';

export class CountriesNameQueryDto {
  @ApiProperty({
    example: 'сша',
    description: 'name of country',
    required: true,
  })
  readonly country: string;
}

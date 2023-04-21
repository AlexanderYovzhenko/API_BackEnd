import { ApiProperty } from '@nestjs/swagger';

export class PaginationQueryDto {
  @ApiProperty({
    example: ['комедия', 'драма'],
    description: 'genres',
    required: false,
  })
  readonly genres?: string[];

  @ApiProperty({ example: 'США', description: 'country', required: false })
  readonly country?: string;

  @ApiProperty({ example: 2020, description: 'year', required: false })
  readonly year?: string;

  @ApiProperty({ example: 5.3, description: 'rating', required: false })
  readonly rating?: string;

  @ApiProperty({
    example: 'Эрик Толедано',
    description: 'film maker',
    required: false,
  })
  readonly film_maker?: string;

  @ApiProperty({
    example: 'Сирил Менди',
    description: 'actor',
    required: false,
  })
  readonly actor?: string;
}

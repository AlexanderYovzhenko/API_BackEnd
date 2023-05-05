import { ApiProperty } from '@nestjs/swagger';

export class FilterQueryDto {
  @ApiProperty({
    example: ['комедия', 'драма'],
    description: 'genres',
    required: false,
  })
  readonly genres?: string[];

  @ApiProperty({
    example: ['США', 'Россия'],
    description: 'countries',
    required: false,
  })
  readonly countries?: string[];

  @ApiProperty({ example: 2000, description: 'year', required: false })
  readonly year?: string;

  @ApiProperty({ example: 2001, description: 'min year', required: false })
  readonly year_min?: string;

  @ApiProperty({ example: 2002, description: 'max year', required: false })
  readonly year_max?: string;

  @ApiProperty({ example: 7.3, description: 'rating', required: false })
  readonly rating?: string;

  @ApiProperty({ example: 3000, description: 'assessments', required: false })
  readonly assessments?: string;

  @ApiProperty({
    example: ['Мелисса', 'Сейджмиллер'],
    description: 'rezhisser',
    required: false,
  })
  readonly rezhisser?: string[];

  @ApiProperty({
    example: ['Илэйн', 'МакЛорин'],
    description: 'aktyor',
    required: false,
  })
  readonly aktyor?: string[];

  @ApiProperty({
    example: 20,
    description: 'limit amount items',
    required: false,
  })
  readonly limit?: string;
}

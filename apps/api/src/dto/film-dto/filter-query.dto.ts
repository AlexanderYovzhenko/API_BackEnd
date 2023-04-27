import { ApiProperty } from '@nestjs/swagger';

export class FilterQueryDto {
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

  @ApiProperty({ example: 7.3, description: 'rating', required: false })
  readonly rating?: string;

  @ApiProperty({ example: 3000, description: 'assessments', required: false })
  readonly assessments?: string;

  @ApiProperty({
    example: ['Мелисса', 'Сейджмиллер'],
    description: 'filmmaker',
    required: false,
  })
  readonly film_maker?: string[];

  @ApiProperty({
    example: ['Магдалено', 'Роблес'],
    description: 'actor',
    required: false,
  })
  readonly actor?: string[];
}

import { ApiProperty } from '@nestjs/swagger';

export class FilmsIdQueryDto {
  @ApiProperty({
    example: [
      '2038439d-1141-430f-8192-be84123187df',
      '725e5fa7-1d34-4237-92d6-c103642c3961',
    ],
    description: 'films id',
    required: false,
  })
  readonly films?: string[];
}

import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateGenreNameDto {
  @ApiProperty({ example: 'вестерн', description: 'name genre RU' })
  @IsNotEmpty()
  @IsString({ message: 'genre_ru: should be string' })
  readonly genre_ru: string;

  @ApiProperty({
    example: 'western',
    description: 'name genre EN',
  })
  @IsString({ message: 'genre_en: should be string' })
  readonly genre_en: string;
}

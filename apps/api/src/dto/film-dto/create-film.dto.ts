import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFilmDto {
  @ApiProperty({ example: 'Титаник', description: 'name RU' })
  @IsNotEmpty()
  readonly name_ru: string;

  @ApiProperty({ example: 'Titanic', description: 'name EN', required: false })
  @IsString({ message: 'name_en: should be string' })
  readonly name_en: string;

  @ApiProperty({
    example: 'description film, any text',
    description: 'any text',
  })
  @IsNotEmpty()
  @IsString({ message: 'description: should be string' })
  readonly description: string;

  @ApiProperty({ example: 2020, description: 'year realize film' })
  @IsNotEmpty()
  @IsNumber({}, { message: 'year: should be number' })
  readonly year: number;

  @ApiProperty({ example: 'USA', description: 'country which made film' })
  @IsNotEmpty()
  @IsString({ message: 'country: should be string' })
  readonly country: string;

  @ApiProperty({ example: 8, description: 'rating of the film' })
  @IsNotEmpty()
  @IsNumber({}, { message: 'rating: should be number' })
  readonly rating: number;

  @ApiProperty({ example: 30000, description: 'assessments' })
  @IsNotEmpty()
  @IsNumber({}, { message: 'assessments: should be number' })
  readonly assessments: number;

  @ApiProperty({ example: 2000, description: 'reviews' })
  @IsNotEmpty()
  @IsNumber({}, { message: 'reviews: should be number' })
  readonly reviews: number;

  @ApiProperty({ example: 'full hd, 4k', description: 'quality' })
  @IsNotEmpty()
  @IsString({ message: 'quality: should be string' })
  readonly quality: string;

  @ApiProperty({ example: 16, description: 'age limit' })
  @IsNotEmpty()
  @IsNumber({}, { message: 'age_limit: should be number' })
  readonly age_limit: number;

  @ApiProperty({ example: '195 minutes', description: 'duration of the film' })
  @IsNotEmpty()
  @IsString({ message: 'duration: should be string' })
  readonly duration: string;

  @ApiProperty({
    example: ['url//:dflsdjf//'],
    description: 'trailers',
  })
  @IsNotEmpty()
  readonly trailers: string[];

  @ApiProperty({
    example: ['рус', 'eng'],
    description: 'languages',
  })
  @IsNotEmpty()
  readonly languagesAudio: string[];

  @ApiProperty({
    example: ['рус', 'eng'],
    description: 'languages',
  })
  @IsNotEmpty()
  readonly languagesSubtitle: string[];

  @ApiProperty({
    example: ['драма', 'комедия', 'биография'],
    description: 'genres',
  })
  @IsNotEmpty()
  readonly genres: string[];
}

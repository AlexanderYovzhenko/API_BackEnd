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
    example: 'Описание фильма, любой текст',
    description: 'any text',
  })
  @IsString({ message: 'description: should be string' })
  readonly description: string;

  @ApiProperty({ example: 2020, description: 'year realize film' })
  @IsNotEmpty()
  @IsNumber({}, { message: 'year: should be number' })
  readonly year: number;

  @ApiProperty({ example: 'США', description: 'country which made film' })
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

  @ApiProperty({ example: 16, description: 'age limit' })
  @IsNotEmpty()
  @IsNumber({}, { message: 'age_limit: should be number' })
  readonly age_limit: number;

  @ApiProperty({ example: 195, description: 'duration of the film' })
  @IsNotEmpty()
  @IsNumber({}, { message: 'duration: should be number' })
  readonly duration: number;

  @ApiProperty({
    example:
      '//avatars.mds.yandex.net/get-kinopoisk-image/1599028/4057c4b8-8208-4a04-b169-26b0661453e3/300x450',
    description: 'img url',
  })
  @IsString({ message: 'img: should be string' })
  readonly img: string;

  @ApiProperty({
    example: ['4K', 'FullHD', 'HD', '1080', '720', '5.1'],
    description: 'qualities',
  })
  @IsNotEmpty()
  readonly qualities: string[];

  @ApiProperty({
    example: [
      {
        trailer: 'https://www.kinopoisk.ru/film/535341/video/62802/',
        img: '//avatars.mds.yandex.net/get-kino-vod-films-gallery/1668876/a345b127722243984f01ef6504c9a477/100x64_3',
        date: '18 января 2023',
      },
    ],
    description: 'trailers',
  })
  @IsNotEmpty()
  readonly trailers: [{ trailer: string; img: string; date: string }];

  @ApiProperty({
    example: ['русский', 'английский'],
    description: 'languages audio',
  })
  @IsNotEmpty()
  readonly languagesAudio: string[];

  @ApiProperty({
    example: ['русский', 'английский'],
    description: 'languages subtitle',
  })
  @IsNotEmpty()
  readonly languagesSubtitle: string[];

  @ApiProperty({
    example: [
      { genre_ru: 'драма', genre_en: 'drama', slug: 'drama' },
      { genre_ru: 'комедия', genre_en: 'comedy', slug: 'comedia' },
    ],
    description: 'genres',
  })
  @IsNotEmpty()
  readonly genres: [{ genre_ru: string; genre_en: string; slug: string }];
}

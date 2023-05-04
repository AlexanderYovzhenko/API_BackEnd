import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePersonDto {
  @ApiProperty({
    example: 'актёр',
    description: 'role of film',
  })
  @IsNotEmpty()
  readonly film_role: string;

  @ApiProperty({
    example: 'actor',
    description: 'slug role of film',
  })
  @IsNotEmpty()
  readonly film_role_slug: string;

  @ApiProperty({
    example: 'Оливье',
    description: 'first name ru',
  })
  @IsNotEmpty()
  readonly first_name_ru: string;

  @ApiProperty({
    example: 'Накаш',
    description: 'last name ru',
  })
  @IsNotEmpty()
  readonly last_name_ru: string;

  @ApiProperty({
    example: 'Olivier',
    description: 'first name en',
  })
  @IsNotEmpty()
  readonly first_name_en: string;

  @ApiProperty({
    example: 'Nakache',
    description: 'last name en',
  })
  @IsNotEmpty()
  readonly last_name_en: string;

  @ApiProperty({
    example:
      '//avatars.mds.yandex.net/get-kinopoisk-image/1599028/09a6ecb6-052b-41fb-8323-1b95a10cb33a/280x420',
    description: 'image of the person',
  })
  @IsNotEmpty()
  readonly img: string;
}

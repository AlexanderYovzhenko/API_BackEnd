import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreatePersonDto } from './create-person.dto';

export class CreatePersonsFilmDto {
  @ApiProperty({
    example: 'e7411c17-0326-48ed-a4c3-fb720a3486b1',
    description: 'film id uuid',
  })
  @IsNotEmpty()
  readonly film_id: string;

  @ApiProperty({
    example: [
      {
        film_role: 'актёр',
        film_role_slug: 'actor',
        first_name_ru: 'Оливье',
        last_name_ru: 'Накаш',
        first_name_en: 'Olivier',
        last_name_en: 'Nakache',
        img: '//avatars.mds.yandex.net/get-kinopoisk-image/1599028/09a6ecb6-052b-41fb-8323-1b95a10cb33a/280x420',
      },
    ],
    description: 'array person',
  })
  @IsNotEmpty()
  readonly persons: CreatePersonDto[];
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class PersonQueryDto {
  @ApiProperty({
    example: 'Оливье',
    description: 'first name ru',
    required: false,
  })
  readonly first_name_ru?: string;

  @ApiProperty({
    example: 'Накаш',
    description: 'last name ru',
    required: false,
  })
  readonly last_name_ru?: string;

  @ApiProperty({
    example: 'актёр',
    description: 'film role the person',
  })
  @IsNotEmpty()
  readonly film_role: string;
}

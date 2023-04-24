import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class PersonQueryDto {
  @ApiProperty({
    example: 'Оливье',
    description: 'first name',
    required: false,
  })
  readonly first_name?: string;

  @ApiProperty({
    example: 'Накаш',
    description: 'last name',
    required: false,
  })
  readonly last_name?: string;

  @ApiProperty({
    example: 'актёр',
    description: 'film role or slug the person',
  })
  @IsNotEmpty()
  readonly film_role: string;
}

import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateFilmNameDto {
  @ApiProperty({ example: 'Зелёная миля', description: 'name RU' })
  @IsNotEmpty()
  @IsString({ message: 'name_ru: should be string' })
  @Length(0, 64, { message: 'Name should be no more than 64' })
  readonly name_ru: string;

  @ApiProperty({
    example: 'Green mile',
    description: 'name EN',
    required: false,
  })
  @IsString({ message: 'name_en: should be string' })
  @Length(0, 64, { message: 'Name should be no more than 64' })
  readonly name_en: string;
}

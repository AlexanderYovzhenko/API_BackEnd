import { ApiProperty } from '@nestjs/swagger';

export class FilmsNameQueryDto {
  @ApiProperty({
    example: 'Зеленая миля',
    description: 'name of film',
    required: true,
  })
  readonly name: string;
}

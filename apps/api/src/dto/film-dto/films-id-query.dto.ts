import { ApiProperty } from '@nestjs/swagger';

export class FilmsIdQueryDto {
  @ApiProperty({
    example: [
      'eb5eb005-5818-4cee-9f7b-0fc6c1fae2cc',
      '1ac5625b-d78c-4de2-9909-85c0fa002686',
    ],
    description: 'films id',
    required: false,
  })
  readonly films?: string[];
}

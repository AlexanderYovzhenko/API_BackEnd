import { ApiProperty } from '@nestjs/swagger';

export class LimitQueryDto {
  @ApiProperty({
    example: 20,
    description: 'limit amount items',
    required: false,
  })
  readonly limit?: string | null;
}

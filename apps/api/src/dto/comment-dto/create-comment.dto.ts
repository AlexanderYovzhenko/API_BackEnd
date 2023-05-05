import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    example: 'About film',
    description: 'title of comment',
    required: false,
  })
  readonly title?: string | null;

  @ApiProperty({
    example: 'My comment about the film',
    description: 'Any text',
  })
  @IsNotEmpty()
  readonly text: string;

  @ApiProperty({
    example: 'eb5eb005-5818-4cee-9f7b-0fc6c1fae2cc',
    description: 'film_id',
    required: false,
  })
  readonly film_id?: string | null;

  @ApiProperty({
    example: 'comment_id or null',
    description: 'parent_id',
    required: false,
  })
  readonly parent_id?: string | null;

  @ApiProperty({
    example: '87e25d0b-8f6f-4a38-b372-f881b8aa41e5',
    description: 'user_id',
  })
  @IsNotEmpty()
  readonly user_id: string;
}

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
    example: '984fdb2d-da0c-4e04-926a-f72f103c4ccb',
    description: 'film_id',
    required: false,
  })
  readonly film_id?: string | null;

  @ApiProperty({
    example: 'comment_id for sub_comment or null for comment',
    description: 'parent_id',
    required: false,
  })
  readonly parent_id?: string | null;

  @ApiProperty({
    example: 1,
    description: 'user_id',
  })
  @IsNotEmpty()
  readonly user_id: number;
}

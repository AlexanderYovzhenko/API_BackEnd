import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCommentDto {
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
}

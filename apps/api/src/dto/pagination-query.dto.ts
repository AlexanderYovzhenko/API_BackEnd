import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationQueryDto {
  @ApiProperty({ example: 'comedy, art', description: 'genres' })
  @IsNotEmpty()
  @IsString({ message: 'genre: should be string' })
  readonly genre: string;

  @ApiProperty({ example: 'USA', description: 'country' })
  @IsNotEmpty()
  @IsString({ message: 'country: should be string' })
  readonly country: string;

  @ApiProperty({ example: 2020, description: 'year' })
  @IsNotEmpty()
  @IsString({ message: 'year: should be string' })
  readonly year: string;

  @ApiProperty({ example: 8.3, description: 'rating' })
  @IsNotEmpty()
  @IsString({ message: 'rating: should be string' })
  readonly rating: string;

  @ApiProperty({ example: 'Эрик Толедано', description: 'film maker' })
  @IsNotEmpty()
  @IsString({ message: 'film_maker: should be string' })
  readonly film_maker: string;

  @ApiProperty({ example: 'Сирил Менди', description: 'actor' })
  @IsNotEmpty()
  @IsString({ message: 'actor: should be string' })
  readonly actor: string;
}

import { IsString, Length, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'test@gmail.com',
    description: 'user email',
  })
  @IsString({ message: 'User email Should be string' })
  @IsEmail({}, { message: 'Incorrect email' })
  readonly email: string;

  @ApiProperty({
    example: 'password',
    description: 'user password',
  })
  @IsString({ message: 'User password Should be string' })
  @Length(4, 16, { message: 'Length should be from 4 to 16' })
  readonly password: string;
}

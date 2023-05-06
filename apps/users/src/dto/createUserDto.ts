import { IsString, Length, IsEmail } from 'class-validator';
export class CreateUserDto {
  @IsString({ message: 'User email Should be string' })
  @IsEmail({}, { message: 'Incorrect email' })
  readonly email: string;

  @IsString({ message: 'User password Should be string' })
  @Length(4, 16, { message: 'Length should be from 4 to 16' })
  readonly password: string;
}

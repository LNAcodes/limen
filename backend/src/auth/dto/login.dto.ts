import { IsEmail, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'teacher5@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'a-long-password-test' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsEmail,
  MinLength,
  IsEnum,
} from 'class-validator';
import { ProfessionalField } from '../../users/enums/professional-field.enum.js';

// No role field on purpose: nobody can make themselves an admin.
// forbidNonWhitelisted (ValidationPipe) rejects any extra field like "role" with 400
export class RegisterDto {
  @ApiProperty({ example: 'Sama Kaufmann', maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'sama.kaufmann@example.com' })
  @IsString()
  @IsEmail()
  email: string;

  // 12 to 72 characters: 72 is the bcrypt limit
  @ApiProperty({
    example: 'a-long-and-safe-password',
    minLength: 12,
    maxLength: 72,
  })
  @IsString()
  @MinLength(12)
  @MaxLength(72)
  password: string;

  @ApiProperty({ enum: ProfessionalField, example: ProfessionalField.TEACHER })
  @IsEnum(ProfessionalField)
  professionalField: ProfessionalField;
}

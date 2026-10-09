import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateThreadDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  @ApiProperty({
    example: 'Transition from daycare to primary school',
    maxLength: 200,
  })
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  @ApiProperty({
    example: 'How do you organize the exchange with daycare centers?',
    maxLength: 5000,
  })
  content: string;
}

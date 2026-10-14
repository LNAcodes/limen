import { PartialType } from '@nestjs/swagger';
import { CreateReplyDto } from './create-reply.dto.js';

// PartialType: same fields and validation rules as CreateReplyDto, but all optional
export class UpdateReplyDto extends PartialType(CreateReplyDto) {}

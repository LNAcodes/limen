import { PartialType } from '@nestjs/mapped-types';
import { CreateThreadDto } from './create-thread.dto.js';

// PartialType: same fields and validation rules as CreateThreadDto, but all optional (update only what changed)
export class UpdateThreadDto extends PartialType(CreateThreadDto) {}

import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator.js';

@Controller('health')
@ApiTags('health')
@Public()
export class HealthController {
  @Get()
  checkHealth() {
    return { status: 'ok' };
  }
}

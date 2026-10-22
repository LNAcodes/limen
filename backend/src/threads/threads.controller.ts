import {
  Controller,
  Post,
  Body,
  Get,
  ParseUUIDPipe,
  Param,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ThreadsService } from './threads.service.js';
import { CreateThreadDto } from './dto/create-thread.dto.js';
import { UpdateThreadDto } from './dto/update-thread.dto.js';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { AuthenticatedUser } from '../users/types/user.types.js';

@ApiBearerAuth()
@Controller('threads')
@ApiTags('threads')
export class ThreadsController {
  constructor(private readonly threadsService: ThreadsService) {}

  @Public()
  @Get()
  findAllThreads() {
    return this.threadsService.findAllThreads();
  }

  @Public()
  @Get(':id')
  findOneThread(@Param('id', ParseUUIDPipe) threadId: string) {
    return this.threadsService.findOneThread(threadId);
  }

  @Post()
  createThread(
    @Body() createThreadDto: CreateThreadDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.threadsService.createThread(
      createThreadDto,
      currentUser.userId,
    );
  }

  @Patch(':id')
  updateThread(
    @Param('id', ParseUUIDPipe) threadId: string,
    @Body() updateThreadDto: UpdateThreadDto,
  ) {
    return this.threadsService.updateThread(threadId, updateThreadDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeThread(@Param('id', ParseUUIDPipe) threadId: string) {
    return this.threadsService.removeThread(threadId);
  }
}

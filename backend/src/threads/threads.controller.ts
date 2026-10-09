import {
  Controller,
  Post,
  Body,
  Get,
  ParseUUIDPipe,
  Param,
  Patch,
} from '@nestjs/common';
import { ThreadsService } from './threads.service.js';
import { CreateThreadDto } from './dto/create-thread.dto.js';
import { UpdateThreadDto } from './dto/update-thread.dto.js';

@Controller('threads')
export class ThreadsController {
  constructor(private readonly threadsService: ThreadsService) {}

  @Get()
  findAllThreads() {
    return this.threadsService.findAllThreads();
  }

  @Get(':id')
  findOneThread(@Param('id', ParseUUIDPipe) threadId: string) {
    return this.threadsService.findOneThread(threadId);
  }

  @Post()
  createThread(@Body() createThreadDto: CreateThreadDto) {
    return this.threadsService.createThread(createThreadDto);
  }

  @Patch(':id')
  updateThread(
    @Param('id', ParseUUIDPipe) threadId: string,
    @Body() updateThreadDto: UpdateThreadDto,
  ) {
    return this.threadsService.updateThread(threadId, updateThreadDto);
  }
}

import { Controller, Post, Body, Get } from '@nestjs/common';
import { ThreadsService } from './threads.service.js';
import { CreateThreadDto } from './dto/create-thread.dto.js';

@Controller('threads')
export class ThreadsController {
  constructor(private readonly threadsService: ThreadsService) {}

  @Get()
  findAllThreads() {
    return this.threadsService.findAllThreads();
  }

  @Post()
  create(@Body() createThreadDto: CreateThreadDto) {
    return this.threadsService.createThread(createThreadDto);
  }
}

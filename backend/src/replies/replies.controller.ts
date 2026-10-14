import {
  Controller,
  Body,
  Param,
  ParseUUIDPipe,
  Post,
  Get,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RepliesService } from './replies.service.js';
import { CreateReplyDto } from './dto/create-reply.dto.js';

@Controller()
@ApiTags('replies')
export class RepliesController {
  constructor(private readonly repliesService: RepliesService) {}

  @Post('threads/:threadId/replies')
  createReply(
    @Param('threadId', ParseUUIDPipe) threadId: string,
    @Body() CreateReplyDto: CreateReplyDto,
  ) {
    return this.repliesService.createReply(threadId, CreateReplyDto);
  }

  @Get('threads/:threadId/replies')
  findRepliesOfThread(@Param('threadId', ParseUUIDPipe) threadId: string) {
    return this.repliesService.findRepliesOfThread(threadId);
  }
}

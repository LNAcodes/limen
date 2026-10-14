import {
  Controller,
  Body,
  Param,
  ParseUUIDPipe,
  Post,
  Get,
  Patch,
  HttpCode,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RepliesService } from './replies.service.js';
import { CreateReplyDto } from './dto/create-reply.dto.js';
import { UpdateReplyDto } from './dto/update-reply.dto.js';

@Controller()
@ApiTags('replies')
export class RepliesController {
  constructor(private readonly repliesService: RepliesService) {}

  @Post('threads/:threadId/replies')
  createReply(
    @Param('threadId', ParseUUIDPipe) threadId: string,
    @Body() createReplyDto: CreateReplyDto,
  ) {
    return this.repliesService.createReply(threadId, createReplyDto);
  }

  @Get('threads/:threadId/replies')
  findRepliesOfThread(@Param('threadId', ParseUUIDPipe) threadId: string) {
    return this.repliesService.findRepliesOfThread(threadId);
  }

  @Patch('replies/:id')
  updateReply(
    @Param('id', ParseUUIDPipe) replyId: string,
    @Body() updateReplyDto: UpdateReplyDto,
  ) {
    return this.repliesService.updateReply(replyId, updateReplyDto);
  }

  @Delete('replies/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeReply(@Param('id', ParseUUIDPipe) replyId: string) {
    return this.repliesService.removeReply(replyId);
  }
}

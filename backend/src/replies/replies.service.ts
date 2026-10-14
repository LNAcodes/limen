import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reply } from './entities/reply.entity.js';
import { Repository } from 'typeorm';
import { CreateReplyDto } from './dto/create-reply.dto.js';
import { ThreadsService } from '../threads/threads.service.js';

@Injectable()
export class RepliesService {
  constructor(
    @InjectRepository(Reply)
    private readonly replyRepository: Repository<Reply>,
    private readonly threadsService: ThreadsService,
  ) {}

  async createReply(
    threadId: string,
    createReplyDto: CreateReplyDto,
  ): Promise<Reply> {
    const parentThread = await this.threadsService.findOneThread(threadId);

    const newReply = this.replyRepository.create({
      ...createReplyDto,
      thread: parentThread,
    });
    const savedReply = await this.replyRepository.save(newReply);

    return savedReply;
  }

  async findRepliesOfThread(threadId: string): Promise<Reply[]> {
    await this.threadsService.findOneThread(threadId);

    const threadReplies = await this.replyRepository.find({
      where: { thread: { id: threadId } },
      order: { createdAt: 'ASC' },
    });

    return threadReplies;
  }
}

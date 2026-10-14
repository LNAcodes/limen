import { Injectable, NotFoundException, ParseUUIDPipe } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reply } from './entities/reply.entity.js';
import { Repository } from 'typeorm';
import { CreateReplyDto } from './dto/create-reply.dto.js';
import { ThreadsService } from '../threads/threads.service.js';
import { UpdateReplyDto } from './dto/update-reply.dto.js';

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

  async findOneReply(replyId: string): Promise<Reply> {
    const foundReply = await this.replyRepository.findOneBy({ id: replyId });

    if (!foundReply) {
      throw new NotFoundException('Reply not found');
    }

    return foundReply;
  }

  async updateReply(
    replyId: string,
    updateReplyDto: UpdateReplyDto,
  ): Promise<Reply> {
    const existingReply = await this.findOneReply(replyId);

    this.replyRepository.merge(existingReply, updateReplyDto);

    const savedReply = await this.replyRepository.save(existingReply);

    return savedReply;
  }

  async removeReply(replyId: string): Promise<void> {
    const replyToRemove = await this.findOneReply(replyId);

    await this.replyRepository.remove(replyToRemove);
  }
}

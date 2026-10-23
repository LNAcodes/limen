import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reply } from './entities/reply.entity.js';
import { Repository } from 'typeorm';
import { CreateReplyDto } from './dto/create-reply.dto.js';
import { ThreadsService } from '../threads/threads.service.js';
import { UpdateReplyDto } from './dto/update-reply.dto.js';
import type { AuthenticatedUser } from '../users/types/user.types.js';
import { assertIsAuthor, assertIsAuthorOrAdmin } from '../auth/ownership.js';

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
    authorId: string,
  ): Promise<Reply> {
    const parentThread = await this.threadsService.findOneThread(threadId);

    const newReply = this.replyRepository.create({
      ...createReplyDto,
      thread: parentThread,
      // TypeORM only needs the id to set the relation
      author: { id: authorId },
    });
    const savedReply = await this.replyRepository.save(newReply);

    return savedReply;
  }

  async findRepliesOfThread(threadId: string): Promise<Reply[]> {
    await this.threadsService.findOneThread(threadId);

    const threadReplies = await this.replyRepository.find({
      where: { thread: { id: threadId } },
      order: { createdAt: 'ASC' },
      relations: { author: true },
    });

    return threadReplies;
  }

  async findOneReply(replyId: string): Promise<Reply> {
    const foundReply = await this.replyRepository.findOne({
      where: { id: replyId },
      relations: { author: true },
    });

    if (!foundReply) {
      throw new NotFoundException('Reply not found');
    }

    return foundReply;
  }

  async updateReply(
    replyId: string,
    updateReplyDto: UpdateReplyDto,
    currentUser: AuthenticatedUser,
  ): Promise<Reply> {
    const existingReply = await this.findOneReply(replyId);

    // Only the author may edit (403 otherwise)
    assertIsAuthor(existingReply.author?.id, currentUser.userId);

    this.replyRepository.merge(existingReply, updateReplyDto);

    const savedReply = await this.replyRepository.save(existingReply);

    return savedReply;
  }

  async removeReply(
    replyId: string,
    currentUser: AuthenticatedUser,
  ): Promise<void> {
    const replyToRemove = await this.findOneReply(replyId);

    // Only the author may remove (403 otherwise)
    assertIsAuthorOrAdmin(replyToRemove.author?.id, currentUser);

    await this.replyRepository.remove(replyToRemove);
  }
}

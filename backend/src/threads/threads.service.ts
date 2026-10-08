import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Thread } from './entities/thread.entity.js';
import { CreateThreadDto } from './dto/create-thread.dto.js';

@Injectable()
export class ThreadsService {
  constructor(
    @InjectRepository(Thread)
    private readonly threadRepository: Repository<Thread>,
  ) {}

  async createThread(createThreadDto: CreateThreadDto): Promise<Thread> {
    const newThread = this.threadRepository.create(createThreadDto);
    const savedThread = await this.threadRepository.save(newThread);

    return savedThread;
  }

  async findAllThreads(): Promise<Thread[]> {
    const allThreads = await this.threadRepository.find({
      order: { createdAt: 'DESC' },
    });
    return allThreads;
  }

  async findOneThread(threadId: string): Promise<Thread> {
    const foundThread = await this.threadRepository.findOneBy({ id: threadId });

    if (!foundThread) {
      throw new NotFoundException('Thread not found');
    }
    return foundThread;
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Thread } from './entities/thread.entity.js';
import { CreateThreadDto } from './dto/create-thread.dto.js';
import { UpdateThreadDto } from './dto/update-thread.dto.js';
import { CategoriesService } from '../categories/categories.service.js';

@Injectable()
export class ThreadsService {
  constructor(
    @InjectRepository(Thread)
    private readonly threadRepository: Repository<Thread>,
    private readonly categoriesService: CategoriesService,
  ) {}

  async createThread(
    createThreadDto: CreateThreadDto,
    authorId: string,
  ): Promise<Thread> {
    const { categoryId, ...threadText } = createThreadDto;

    const chosenCategory = await this.categoriesService.findOneCategory(
      createThreadDto.categoryId,
    );

    const newThread = this.threadRepository.create({
      ...threadText,
      category: chosenCategory,
      // TypeORM only needs the id to set the relation
      author: { id: authorId },
    });
    const savedThread = await this.threadRepository.save(newThread);

    return savedThread;
  }

  async findAllThreads(): Promise<Thread[]> {
    const allThreads = await this.threadRepository.find({
      order: { createdAt: 'DESC' },
      relations: { category: true, author: true },
    });

    return allThreads;
  }

  async findOneThread(threadId: string): Promise<Thread> {
    const foundThread = await this.threadRepository.findOne({
      where: { id: threadId },
      relations: { category: true, author: true },
    });

    if (!foundThread) {
      throw new NotFoundException('Thread not found');
    }

    return foundThread;
  }

  async updateThread(
    threadId: string,
    updateThreadDto: UpdateThreadDto,
  ): Promise<Thread> {
    const existingThread = await this.findOneThread(threadId);
    const { categoryId, ...textChanges } = updateThreadDto;

    if (categoryId) {
      existingThread.category =
        await this.categoriesService.findOneCategory(categoryId);
    }
    // merge(target, changes): copies the new values from the DTO into the existing thread
    this.threadRepository.merge(existingThread, textChanges);

    const savedThread = await this.threadRepository.save(existingThread);

    return savedThread;
  }

  async removeThread(threadId: string): Promise<void> {
    const threadToRemove = await this.findOneThread(threadId);

    await this.threadRepository.remove(threadToRemove);
    // TypeOrm: remove() instead of delete(): we already loaded the entity for the 404 check, and remove() also handles related data (cascades)
  }
}

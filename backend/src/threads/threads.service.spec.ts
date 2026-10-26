/**
 * Unit tests for ThreadsService
 *
 * beforeEach (runs before every test)
 *   ↓ reset the mocks
 *   ↓ build a mini module: real ThreadsService + 2 mocks
 *   ↓ take threadsService out of the module
 *   ↓
 * Test 1 (happy path)
 *   Arrange: the mock says "I find thread-1"
 *   Act:     findOneThread('thread-1')
 *   Assert:  was the database asked correctly? Is the thread returned?
 *   ↓
 * beforeEach (fresh again)
 *   ↓
 * Test 2 (unhappy path)
 *   Arrange:      the mock says "I find nothing" (null)
 *   Act & Assert: findOneThread must throw NotFoundException
 */

import { Test, TestingModule } from '@nestjs/testing';
import { ThreadsService } from './threads.service.js';
import { Thread } from './entities/thread.entity.js';
import { CategoriesService } from '../categories/categories.service.js';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockThreadRepository = {
  findOne: vi.fn(),
};

const mockCategoriesService = {
  findOneCategory: vi.fn(),
};

describe('ThreadsService', () => {
  let threadsService: ThreadsService;

  // Runs before every single test, so each test starts with a clean sandbox
  beforeEach(async () => {
    // Forget how often the mocks were called in the previous test
    vi.clearAllMocks();

    // A mini NestJS module only for this test (no web server, no database)
    const testingModule: TestingModule = await Test.createTestingModule({
      // The real service we want to test
      providers: [
        ThreadsService,
        // Whenever ThreadsService asks for the Thread repository, give it the mock
        {
          provide: getRepositoryToken(Thread),
          useValue: mockThreadRepository,
        },
        // Whenever ThreadsService asks for CategoriesService, give it the mock
        {
          provide: CategoriesService,
          useValue: mockCategoriesService,
        },
      ],
    }).compile();

    // Take the finished service out of the sandbox
    threadsService = testingModule.get<ThreadsService>(ThreadsService);
  });

  it('should be defined', () => {
    expect(threadsService).toBeDefined();
  });

  describe('findOneThread', () => {
    // Happy path: the thread exists
    it('returns the thread when it exists', async () => {
      const storedThread = { id: 'thread-1', title: 'Test thread' };
      mockThreadRepository.findOne.mockResolvedValue(storedThread);

      // Act: call the real service method
      const foundThread = await threadsService.findOneThread('thread-1');

      // Assert: the database was asked for the right id, with category and author
      expect(mockThreadRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'thread-1' },
        relations: { category: true, author: true },
      });
      // Assert: the service returns what the database returned
      expect(foundThread).toEqual(storedThread);
      // expect(foundThread).toEqual({ id: 'wrong-id', title: 'Wrong thread' });
    });

    // Unhappy path: the thread does not exist
    it('throws NotFoundException when the thread does not exist', async () => {
      // Arrange: program the mock to "find nothing"
      mockThreadRepository.findOne.mockResolvedValue(null);

      // Act & Assert: the call must fail with a NotFoundException
      await expect(threadsService.findOneThread('unknown-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});

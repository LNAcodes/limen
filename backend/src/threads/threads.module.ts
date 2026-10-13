import { Module } from '@nestjs/common';
import { ThreadsController } from './threads.controller.js';
import { ThreadsService } from './threads.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Thread } from './entities/thread.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Thread])],
  // Export so other modules (replies) can use findOneThread
  exports: [ThreadsService],
  controllers: [ThreadsController],
  providers: [ThreadsService],
})
export class ThreadsModule {}

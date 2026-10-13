import { Module } from '@nestjs/common';
import { RepliesController } from './replies.controller.js';
import { RepliesService } from './replies.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reply } from './entities/reply.entity.js';
import { ThreadsModule } from '../threads/threads.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([Reply]), ThreadsModule],
  controllers: [RepliesController],
  providers: [RepliesService],
})
export class RepliesModule {}

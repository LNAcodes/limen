import { Module } from '@nestjs/common';
import { RepliesController } from './replies.controller.js';
import { RepliesService } from './replies.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reply } from './entities/reply.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Reply])],
  controllers: [RepliesController],
  providers: [RepliesService],
})
export class RepliesModule {}

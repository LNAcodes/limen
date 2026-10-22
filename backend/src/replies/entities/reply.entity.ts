import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { Thread } from '../../threads/entities/thread.entity.js';
import { User } from '../../users/entities/user.entity.js';

@Entity('replies')
export class Reply {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Many replies belong to one thread. Deleting the thread deletes its replies (cascade)
  @ManyToOne(() => Thread, (thread) => thread.replies, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  thread: Relation<Thread>;

  // Deleting the user keeps the reply, the author becomes null (anonymized)
  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  author: Relation<User> | null;
}

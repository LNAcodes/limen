import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { Reply } from '../../replies/entities/reply.entity.js';
import { Category } from '../../categories/entities/category.entity.js';
import { User } from '../../users/entities/user.entity.js';

@Entity('threads')
export class Thread {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // One thread has many replies
  @OneToMany(() => Reply, (reply) => reply.thread)
  replies: Relation<Reply[]>;

  // Many threads belong to one category. If the category is deleted, the thread stays without one
  @ManyToOne(() => Category, { nullable: true, onDelete: 'SET NULL' })
  category: Relation<Category> | null;

  // Deleting the user keeps the thread, the author becomes null (anonymized)
  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  author: Relation<User> | null;
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { UserRole } from '../enums/user-role.enum.js';
import { ProfessionalField } from '../enums/professional-field.enum.js';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  // Only the bcrypt hash is stored. select: false keeps it out of normal queries
  @Column({ type: 'varchar', select: false })
  passwordHash: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: string;

  @Column({ type: 'enum', enum: ProfessionalField })
  professionalField: string;

  @CreateDateColumn()
  createdAt: Date;
}

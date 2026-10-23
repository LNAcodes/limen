import {
  Injectable,
  NotFoundException,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity.js';
import { UserRole } from './enums/user-role.enum.js';
import { ConfigService } from '@nestjs/config';
import { hash } from 'bcryptjs';
import { ProfessionalField } from './enums/professional-field.enum.js';

@Injectable()
export class UsersService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  // Seeding: create the first admin once from environment variables
  async onApplicationBootstrap(): Promise<void> {
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL');
    const adminPassword = this.configService.get<string>('ADMIN_PASSWORD');
    const adminName = this.configService.get<string>('ADMIN_NAME');

    // Without all three variables, no admin is created (the app still starts)
    if (!adminEmail || !adminPassword || !adminName) {
      return;
    }

    const normalizedAdminEmail = adminEmail.toLowerCase();

    const existingAdmin =
      await this.findUserByEmailWithPassword(normalizedAdminEmail);

    if (existingAdmin) {
      return;
    }

    // 10 = bcrypt salt rounds (cost factor), not the password length.
    // Higher means safer but slower. Same value as in AuthService.register
    // The admin password skips RegisterDto validation, so it must be long by itself (openssl rand)
    const passwordHash = await hash(adminPassword, 10);

    await this.createUser({
      name: adminName,
      email: normalizedAdminEmail,
      passwordHash: passwordHash,
      role: UserRole.ADMIN,
      professionalField: ProfessionalField.EDUCATION_ADMINISTRATION,
    });
  }

  async createUser(userData: Partial<User>): Promise<User> {
    const newUser = this.userRepository.create(userData);
    const savedUser = await this.userRepository.save(newUser);

    return savedUser;
  }

  // Explicitly loads passwordHash, only used for login
  // Returns null instead of throwing: "not found" means different things to the caller
  // (register: email is free, good / login: account does not exist, 401)
  async findUserByEmailWithPassword(email: string): Promise<User | null> {
    const foundUser = await this.userRepository.findOne({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        professionalField: true,
        passwordHash: true,
      },
    });

    return foundUser;
  }

  // Loads email explicitly (select: false in the entity), needed for /auth/me and NextAuth.
  // No passwordHash in the result: the column has select: false in the entity
  async findUserById(userId: string): Promise<User> {
    const foundUser = await this.userRepository.findOne({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        professionalField: true,
        createdAt: true,
      },
    });

    if (!foundUser) {
      throw new NotFoundException('User not found');
    }

    return foundUser;
  }
}

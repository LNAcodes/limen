import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

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

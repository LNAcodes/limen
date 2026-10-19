import { ConflictException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import { RegisterDto } from './dto/register.dto.js';
import type { SafeUser } from '../users/types/user.types.js';
import { hash } from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async register(registerDto: RegisterDto): Promise<SafeUser> {
    const normalizedEmail = registerDto.email.toLowerCase();

    const existingUser =
      await this.usersService.findUserByEmailWithPassword(normalizedEmail);

    if (existingUser) {
      throw new ConflictException('Email is already registered.');
    }

    const passwordHash = await hash(registerDto.password, 10);

    const savedUser = await this.usersService.createUser({
      name: registerDto.name,
      email: normalizedEmail,
      passwordHash: passwordHash,
      professionalField: registerDto.professionalField,
    });

    // save() returns the object we passed in, so the hash must be removed manually
    const { passwordHash: _removedHash, ...userWithoutPassword } = savedUser;

    return userWithoutPassword;
  }
}

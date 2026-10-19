import { ConflictException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import { RegisterDto } from './dto/register.dto.js';
import type { SafeUser, TokenUser } from '../users/types/user.types.js';
import { hash, compare } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

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

  // Same result (null) for wrong email and wrong password, so registered emails stay private
  async validateUser(
    email: string,
    password: string,
  ): Promise<SafeUser | null> {
    const foundUser = await this.usersService.findUserByEmailWithPassword(
      email.toLowerCase(),
    );

    if (!foundUser) {
      return null;
    }

    const passwordMatches = await compare(password, foundUser.passwordHash);

    if (!passwordMatches) {
      return null;
    }

    const { passwordHash: _removedHash, ...userWithoutPassword } = foundUser;

    return userWithoutPassword;
  }

  async issueAccessToken(user: TokenUser): Promise<{ accessToken: string }> {
    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      role: user.role,
    });

    return { accessToken };
  }
}

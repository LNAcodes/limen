import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service.js';
import type { SafeUser } from '../../users/types/user.types.js';

// Gatekeeper for login: checks email and password before the controller runs
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    // super() sets up the parent class (PassportStrategy) and must run first.
    // Passport looks for "username" by default, usernameField tells it to use "email" instead
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<SafeUser> {
    const validateUser = await this.authService.validateUser(email, password);

    if (!validateUser) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return validateUser;
  }
}

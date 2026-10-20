import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { UserRole } from '../../users/enums/user-role.enum.js';
import type { AuthenticatedUser } from '../../users/types/user.types.js';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    // Reads the token from the "Authorization: Bearer ..." header and checks its signature
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  // Runs only if the token is valid. The result becomes request.user
  validate(payload: { sub: string; role: UserRole }): AuthenticatedUser {
    return {
      userId: payload.sub,
      role: payload.role,
    };
  }
}

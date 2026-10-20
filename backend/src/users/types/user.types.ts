import type { User } from '../entities/user.entity.js';
import type { UserRole } from '../enums/user-role.enum.js';

// A user without the password hash, safe to return in responses
export type SafeUser = Omit<User, 'passwordHash'>;

// Only what the JWT needs
export type TokenUser = Pick<User, 'id' | 'role'>;

// What the JwtStrategy puts into request.user after checking the token
export type AuthenticatedUser = {
  userId: string;
  role: UserRole;
};

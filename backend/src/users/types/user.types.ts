import type { User } from '../entities/user.entity.js';

// A user without the password hash, safe to return in responses
export type SafeUser = Omit<User, 'passwordHash'>;

// Only what the JWT needs
export type TokenUser = Pick<User, 'id' | 'role'>;

import { ForbiddenException } from '@nestjs/common';
import { UserRole } from '../users/enums/user-role.enum.js';
import { AuthenticatedUser } from '../users/types/user.types.js';

// Shared ownership check for threads and replies
// If the post has no author (deleted account), authorId is undefined and the check fails on purpose
export function assertIsAuthor(
  authorId: string | undefined,
  currentUserId: string,
): void {
  if (authorId !== currentUserId) {
    throw new ForbiddenException('You can only change your own posts');
  }
}

export function assertIsAuthorOrAdmin(
  authorId: string | undefined,
  currentUser: AuthenticatedUser,
): void {
  const isAuthor = authorId === currentUser.userId;
  const isAdmin = currentUser.role === UserRole.ADMIN;

  if (!isAuthor && !isAdmin) {
    throw new ForbiddenException('You can only delete your own posts');
  }
}

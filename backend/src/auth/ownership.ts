import { ForbiddenException } from '@nestjs/common';

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

import type { Author } from "@/types/author";

// Only hides buttons. The real protection is in the backend
export function isAuthor(
  author: Author | null,
  currentUserId: string | undefined,
): boolean {
  return author !== null && author.id === currentUserId;
}

export function canDelete(
  author: Author | null,
  currentUserId: string | undefined,
  currentUserRole: string | undefined,
): boolean {
  return isAuthor(author, currentUserId) || currentUserRole === "admin";
}

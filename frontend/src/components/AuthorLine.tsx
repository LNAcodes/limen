import type { Author } from "@/types/author";
import { formatAuthor } from "@/lib/format";

type AuthorLineProps = {
  author: Author | null;
};

// Shows who wrote a post and from which professional perspective
export default function AuthorLine({ author }: AuthorLineProps) {
  return (
    <p className="text-sm text-muted-foreground">by {formatAuthor(author)}</p>
  );
}

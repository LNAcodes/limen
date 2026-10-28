import type { Thread } from "@/types/thread";
import { createContentPreview, formatDate } from "@/lib/format";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";
import AuthorLine from "@/components/AuthorLine";
import CategoryBadge from "@/components/Category.Badge";

type ThreadCardProps = {
  thread: Thread;
};

export default function ThreadCard({ thread }: ThreadCardProps) {
  return (
    <article>
      <Card>
        <CardHeader>
          {thread.category && (
            <CategoryBadge categoryName={thread.category.name} />
          )}
          <CardTitle>
            <h2>
              <Link href={`/threads/${thread.id}`} className="hover:underline">
                {thread.title}
              </Link>
            </h2>
          </CardTitle>
          <AuthorLine author={thread.author} />
        </CardHeader>
        <CardContent>
          <p>{createContentPreview(thread.content)}</p>
          <time
            className="mt-2 block text-sm text-muted-foreground"
            dateTime={thread.createdAt}
          >
            {formatDate(thread.createdAt)}
          </time>
        </CardContent>
      </Card>
    </article>
  );
}

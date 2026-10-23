import type { Thread } from "@/types/thread";
import { createContentPreview, formatDate } from "@/lib/format";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";
import AuthorLine from "@/components/AuthorLine";

type ThreadCardProps = {
  thread: Thread;
};

export default function ThreadCard({ thread }: ThreadCardProps) {
  return (
    <article>
      <Card>
        <CardHeader>
          <p className="text-sm text-muted-foreground">
            {thread.category?.name ?? "No category"}
          </p>
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

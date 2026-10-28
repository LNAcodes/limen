import type { Thread } from "@/types/thread";
import { createContentPreview, formatDate } from "@/lib/format";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";
import AuthorLine from "@/components/AuthorLine";
import CategoryBadge from "@/components/CategoryBadge";

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
          <p className="text-muted-foreground">
            {createContentPreview(thread.content)}
          </p>
          {/* Meta line: who wrote it and when */}
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <AuthorLine author={thread.author} />
            <time dateTime={thread.createdAt}>
              {formatDate(thread.createdAt)}
            </time>
          </div>
        </CardContent>
      </Card>
    </article>
  );
}

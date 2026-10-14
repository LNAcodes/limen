import type { Thread } from "@/types/thread";
import { createContentPreview, formatDate } from "@/lib/format";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type ThreadCardProps = {
  thread: Thread;
};

export default function ThreadCard({ thread }: ThreadCardProps) {
  return (
    <article>
      <Card>
        <CardHeader>
          <CardTitle>
            <h2>{thread.title}</h2>
          </CardTitle>
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

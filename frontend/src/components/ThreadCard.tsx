import type { Thread } from "@/types/thread";
import { createContentPreview, formatDate } from "@/lib/format";

type ThreadCardProps = {
  thread: Thread;
};

export default function ThreadCard({ thread }: ThreadCardProps) {
  return (
    <article className="rounded-lg border p4">
      <h2 className="text-xl fonr-semibold">{thread.title}</h2>
      <p className="mt-2">{createContentPreview(thread.content)}</p>
      <time className="mt-2 block text-sm" dateTime={thread.createdAt}>
        {formatDate(thread.createdAt)}
      </time>
    </article>
  );
}

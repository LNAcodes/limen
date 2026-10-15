import { fetchOneThread, fetchRepliesOfThread } from "@/lib/api";
import { notFound } from "next/navigation";
import Link from "next/link";
import { formatDate } from "@/lib/format";
import CreateReplyForm from "@/components/CreateReplyForm";
import { Button } from "@/components/ui/button";
import DeleteThreadButton from "@/components/DeleteThreadButton";
import ReplyItem from "@/components/ReplyItem";

type ThreadDetailPageProps = {
  params: Promise<{ threadId: string }>;
};

export default async function ThreadDetailPage({
  params,
}: ThreadDetailPageProps) {
  const { threadId } = await params;

  const currentThread = await fetchOneThread(threadId);

  if (!currentThread) {
    notFound();
  }

  const threadReplies = await fetchRepliesOfThread(threadId);

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <Link href="/threads" className="text-sm underline">
        Back to all threads
      </Link>

      <article className="mt-6">
        <h1 className="text-3xl font-bold">{currentThread.title}</h1>
        <time
          className="mt-2 block text-sm text-muted-foreground"
          dateTime={currentThread.createdAt}
        >
          {formatDate(currentThread.createdAt)}
        </time>
        <p className="mt-4 whitespace-pre-line">{currentThread.content}</p>
        <div className="mt-6 flex gap-2">
          <Button asChild variant="outline">
            <Link href={`/threads/${threadId}/edit`}>Edit</Link>
          </Button>
          <DeleteThreadButton threadId={threadId} />
        </div>
      </article>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Replies</h2>

        {threadReplies.length === 0 ? (
          <p className="mt-4">No replies yet.</p>
        ) : (
          <ul className="mt-4 flex flex-col gap-4">
            {threadReplies.map((reply) => (
              <li key={reply.id}>
                <ReplyItem reply={reply} />
              </li>
            ))}
          </ul>
        )}
        <CreateReplyForm threadId={threadId} />
      </section>
    </main>
  );
}

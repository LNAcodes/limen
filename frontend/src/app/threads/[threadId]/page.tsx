import { fetchOneThread, fetchRepliesOfThread } from "@/lib/api";
import { notFound } from "next/navigation";
import Link from "next/link";
import { formatDate } from "@/lib/format";
import CreateReplyForm from "@/components/CreateReplyForm";
import { Button } from "@/components/ui/button";
import DeleteThreadButton from "@/components/DeleteThreadButton";
import ReplyItem from "@/components/ReplyItem";
import BackLink from "@/components/BackLink";
import { auth } from "@/auth";
import AuthorLine from "@/components/AuthorLine";
import { isAuthor, canDelete } from "@/lib/permissions";

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
  const session = await auth();

  const currentUserId = session?.user.id;
  const currentUserRole = session?.user.role;

  const userIsAuthor = isAuthor(currentThread.author, currentUserId);
  const userCanDelete = canDelete(
    currentThread.author,
    currentUserId,
    currentUserRole,
  );

  return (
    <div className="mx-auto w-full max-w-2xl">
      <BackLink href="/threads" label="Back to all threads" />

      <article className="mt-6">
        <h1 className="text-3xl font-bold">{currentThread.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {currentThread.category?.name ?? "No category"}
        </p>
        <AuthorLine author={currentThread.author} />
        <time
          className="mt-2 block text-sm text-muted-foreground"
          dateTime={currentThread.createdAt}
        >
          {formatDate(currentThread.createdAt)}
        </time>
        <p className="mt-4 whitespace-pre-line">{currentThread.content}</p>
        {/* Edit only for the author, delete for the author or admins. Logged out: no buttons */}
        {(userIsAuthor || userCanDelete) && (
          <div className="mt-6 flex gap-2">
            {userIsAuthor && (
              <Button asChild variant="outline">
                <Link href={`/threads/${threadId}/edit`}>Edit</Link>
              </Button>
            )}
            {userCanDelete && <DeleteThreadButton threadId={threadId} />}
          </div>
        )}
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
    </div>
  );
}

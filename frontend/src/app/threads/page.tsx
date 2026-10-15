import ThreadCard from "@/components/ThreadCard";
import { fetchAllThreads } from "@/lib/api";
import type { Thread } from "@/types/thread";
import Link from "next/link";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default async function ThreadsPage() {
  let allThreads: Thread[] = [];
  let loadingFailed = false;

  try {
    allThreads = await fetchAllThreads();
  } catch {
    loadingFailed = true;
  }

  const hasNoThreads = !loadingFailed && allThreads.length === 0;
  const hasThreads = !loadingFailed && allThreads.length > 0;

  return (
    <>
      <h1 className="text-3xl font-bold">Threads</h1>
      <Link href="/threads/new" className="mt-4 inline-block underline">
        New thread
      </Link>

      {loadingFailed && (
        <Alert variant="destructive" className="mt-6">
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>Threads could not be loaded.</AlertDescription>
        </Alert>
      )}
      {hasNoThreads && (
        <Alert className="mt-6">
          <AlertTitle>No threads yet</AlertTitle>
          <AlertDescription>
            Be the first to start a discussion.
          </AlertDescription>
        </Alert>
      )}

      {hasThreads && (
        <ul className="mt-6 flex flex-col gap-4">
          {allThreads.map((thread) => (
            <li key={thread.id}>
              <ThreadCard thread={thread} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

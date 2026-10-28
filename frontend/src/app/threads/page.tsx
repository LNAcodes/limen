import ThreadCard from "@/components/ThreadCard";
import { fetchAllThreads } from "@/lib/api";
import type { Thread } from "@/types/thread";
import Link from "next/link";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";

export default async function ThreadsPage() {
  const session = await auth();

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
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Threads</h1>
          <p className="mt-1 text-muted-foreground">
            Exchange between schools, daycare and youth welfare.
          </p>
        </div>
        {/* Only logged-in users can start a thread */}
        {session && (
          <Button asChild>
            <Link href="/threads/new">New thread</Link>
          </Button>
        )}
      </div>

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

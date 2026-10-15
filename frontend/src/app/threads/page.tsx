import ThreadCard from "@/components/ThreadCard";
import { fetchAllThreads } from "@/lib/api";
import type { Thread } from "@/types/thread";
import Link from "next/link";

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
        New Thread
      </Link>

      {loadingFailed && <p className="mt-6">Threads could not be loaded.</p>}
      {hasNoThreads && <p className="mt-6">No threads yet.</p>}

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

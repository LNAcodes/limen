import ThreadCard from "@/components/ThreadCard";
import { fetchAllThreads } from "@/lib/api";
import type { Thread } from "@/types/thread";
import Link from "next/link";

export default async function ThreadsPage() {
  let allThreads: Thread[];

  try {
    allThreads = await fetchAllThreads();
  } catch {
    return (
      <main className="mx-auto max-w-2x1 px-4 py-12">
        <h1 className="text-3xl font-bold">Threads</h1>
        <Link href="/threads/new" className="mt-4 inline-block underline">
          New Thread
        </Link>
        <p className="mt-6">Threads could not be loaded.</p>
      </main>
    );
  }

  if (allThreads.length === 0) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="text-3xl font-bold">Threads</h1>
        <Link href="/threads/new" className="mt-4 inline-block underline">
          New thread
        </Link>
        <p className="mt-6">No threads yet.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold">Threads</h1>
      <Link href="/threads/new" className="mt-4 inline-block underline">
        New thread
      </Link>
      <ul className="mt-6 flex flex-col gap4">
        {allThreads.map((thread) => (
          <li key={thread.id}>
            <ThreadCard thread={thread} />
          </li>
        ))}
      </ul>
    </main>
  );
}

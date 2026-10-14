import type { Thread } from "@/types/thread";
import type { Reply } from "@/types/reply";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const healthResponse = await fetch(`${apiBaseUrl}/health`, {
      cache: "no-store",
    });

    return healthResponse.ok;
  } catch {
    return false;
  }
}

export async function fetchAllThreads(): Promise<Thread[]> {
  const threadsResponse = await fetch(`${apiBaseUrl}/threads`, {
    cache: "no-store",
  });

  if (!threadsResponse.ok) {
    throw new Error("Failed to fetch threads");
  }

  const allThreads: Thread[] = await threadsResponse.json();

  return allThreads;
}

export async function fetchOneThread(threadId: string): Promise<Thread | null> {
  const threadResponse = await fetch(`${apiBaseUrl}/threads/${threadId}`, {
    cache: "no-store",
  });

  if (threadResponse.status === 404) {
    return null;
  }

  if (!threadResponse.ok) {
    throw new Error("Failed to fetch thread");
  }

  const currentThread: Thread = await threadResponse.json();

  return currentThread;
}

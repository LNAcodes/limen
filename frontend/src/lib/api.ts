import type { Thread } from "@/types/thread";

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

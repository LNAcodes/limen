import type { Thread } from "@/types/thread";
import type { Reply } from "@/types/reply";
import type { Category } from "@/types/category";

export type NewThreadData = {
  title: string;
  content: string;
  categoryId: string;
};

export type RegistrationData = {
  name: string;
  email: string;
  password: string;
  professionalField: string;
};

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

  if (threadResponse.status === 404 || threadResponse.status === 400) {
    return null;
  }

  if (!threadResponse.ok) {
    throw new Error("Failed to fetch thread");
  }

  const currentThread: Thread = await threadResponse.json();

  return currentThread;
}

export async function fetchRepliesOfThread(threadId: string): Promise<Reply[]> {
  const repliesResponse = await fetch(
    `${apiBaseUrl}/threads/${threadId}/replies`,
    {
      cache: "no-store",
    },
  );

  if (!repliesResponse.ok) {
    throw new Error("Failed to fetch replies");
  }

  const threadReplies: Reply[] = await repliesResponse.json();

  return threadReplies;
}

export async function createThread(
  newThreadData: NewThreadData,
): Promise<Thread> {
  const createResponse = await fetch(`${apiBaseUrl}/threads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newThreadData),
  });

  if (!createResponse.ok) {
    throw new Error("Failed to create thread");
  }

  const createdThread: Thread = await createResponse.json();

  return createdThread;
}

export async function createReply(
  threadId: string,
  replyContent: string,
): Promise<Reply> {
  const createResponse = await fetch(
    `${apiBaseUrl}/threads/${threadId}/replies`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: replyContent }),
    },
  );

  if (!createResponse.ok) {
    throw new Error("Failed to create reply");
  }

  const createdReply: Reply = await createResponse.json();

  return createdReply;
}

export async function updateThread(
  threadId: string,
  updatedThreadData: NewThreadData,
): Promise<Thread> {
  const updatedResponse = await fetch(`${apiBaseUrl}/threads/${threadId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedThreadData),
  });

  if (!updatedResponse.ok) {
    throw new Error("Failed to update thread");
  }

  const updatedThread: Thread = await updatedResponse.json();

  return updatedThread;
}

export async function deleteThread(threadId: string): Promise<void> {
  const deleteResponse = await fetch(`${apiBaseUrl}/threads/${threadId}`, {
    method: "DELETE",
  });

  if (!deleteResponse.ok) {
    throw new Error("Failed to delete thread.");
  }
}

export async function updateReply(
  replyId: string,
  replyContent: string,
): Promise<Reply> {
  const updateResponse = await fetch(`${apiBaseUrl}/replies/${replyId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: replyContent }),
  });

  if (!updateResponse.ok) {
    throw new Error("Failed to update reply");
  }

  const updatedReply: Reply = await updateResponse.json();

  return updatedReply;
}

export async function deleteReply(replyId: string): Promise<void> {
  const deleteResponse = await fetch(`${apiBaseUrl}/replies/${replyId}`, {
    method: "DELETE",
  });

  if (!deleteResponse.ok) {
    throw new Error("Failed to delete reply");
  }
}

export async function fetchAllCategories(): Promise<Category[]> {
  const categoriesResponse = await fetch(`${apiBaseUrl}/categories`, {
    cache: "no-store",
  });

  if (!categoriesResponse.ok) {
    throw new Error("Failed to fetch categories");
  }

  const allCategories: Category[] = await categoriesResponse.json();

  return allCategories;
}

export async function registerUser(
  registrationData: RegistrationData,
): Promise<void> {
  const registerResponse = await fetch(`${apiBaseUrl}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(registrationData),
  });

  // 409 = the email already exists, the form shows a specific message for it
  if (registerResponse.status === 409) {
    throw new Error("EMAIL_TAKEN");
  }

  if (!registerResponse.ok) {
    throw new Error("Failed to register");
  }
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { deleteThread } from "@/lib/api";
import { useSession } from "next-auth/react";

type DeleteThreadButtonProps = {
  threadId: string;
};

export default function DeleteThreadButton({
  threadId,
}: DeleteThreadButtonProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    // No session: stop the action (also tells TypeScript that session exists below)
    if (!session) {
      return;
    }

    const isConfirmed = window.confirm(
      "Do you really want to delete this thread?",
    );

    if (!isConfirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteThread(threadId, session.accessToken);
      router.push("/threads");
      router.refresh();
    } catch {
      window.alert("Thread could not be deleted. Please try again.");
      setIsDeleting(false);
    }
  }

  // Logged out: show no delete button at all
  if (!session) {
    return null;
  }

  return (
    <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
      {isDeleting ? "Deleting ..." : "Delete"}
    </Button>
  );
}

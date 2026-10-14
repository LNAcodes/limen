"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { deleteThread } from "@/lib/api";

type DeleteThreadButtonProps = {
  threadId: string;
};

export default function DeleteThreadButton({
  threadId,
}: DeleteThreadButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    const isConfirmed = window.confirm(
      "Do you really want to delete this thread?",
    );

    if (!isConfirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteThread(threadId);
      router.push("/threads");
      router.refresh();
    } catch {
      window.alert("Thread could not be deleted. Please try again.");
      setIsDeleting(false);
    }
  }

  return (
    <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
      {isDeleting ? "Deleting ..." : "Delete"}
    </Button>
  );
}

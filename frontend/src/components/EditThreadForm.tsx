"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { updateThread } from "@/lib/api";
import type { Thread } from "@/types/thread";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

type EditThreadFormProps = {
  thread: Thread;
};

export default function EditThreadForm({ thread }: EditThreadFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const updatedThreadData = {
      title: String(formData.get("title")),
      content: String(formData.get("content")),
    };

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await updateThread(thread.id, updatedThreadData);
      router.push(`/threads/${thread.id}`);
      router.refresh();
    } catch {
      setErrorMessage("Thread could not be saved. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          required
          maxLength={200}
          defaultValue={thread.title}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          name="content"
          required
          maxLength={5000}
          rows={6}
          defaultValue={thread.content}
        />
      </div>

      {errorMessage && (
        <Alert variant="destructive">
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving ..." : "Save changes"}
      </Button>
    </form>
  );
}

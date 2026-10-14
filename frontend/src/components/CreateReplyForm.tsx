"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createReply } from "@/lib/api";

type CreateReplyFormProps = {
  threadId: string;
};

export default function CreateReplyForm({ threadId }: CreateReplyFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const replyForm = event.currentTarget;
    const replyContent = String(new FormData(replyForm).get("content"));

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await createReply(threadId, replyContent);
      (replyForm.reset(), router.refresh());
    } catch {
      setErrorMessage("Reply could not be sent. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="reply-content">Write a reply</Label>
        <Textarea
          id="reply-content"
          name="content"
          required
          maxLength={5000}
          rows={4}
        />
      </div>

      {errorMessage && (
        <p role="alert" className="text-sm text-destructive">
          {errorMessage}
        </p>
      )}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Sending ..." : "Send reply"}
      </Button>
    </form>
  );
}

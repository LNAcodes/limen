"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createReply } from "@/lib/api";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useSession } from "next-auth/react";
import Link from "next/link";

type CreateReplyFormProps = {
  threadId: string;
};

export default function CreateReplyForm({ threadId }: CreateReplyFormProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!session) {
      return;
    }

    const replyForm = event.currentTarget;
    const replyContent = String(new FormData(replyForm).get("content"));

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await createReply(threadId, replyContent, session.accessToken);
      replyForm.reset();
      router.refresh();
    } catch {
      setErrorMessage("Reply could not be sent. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // While NextAuth is still checking the session, show nothing (avoids a flash of the hint)
  if (status === "loading") {
    return null;
  }

  // Logged out: show a hint instead of the form
  if (!session) {
    return (
      <p className="mt-6 text-sm">
        <Link href="/login" className="underline">
          Log in
        </Link>{" "}
        to write a reply.
      </p>
    );
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
        <Alert variant="destructive">
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Sending ..." : "Send reply"}
      </Button>
    </form>
  );
}

"use client";
import type { Reply } from "@/types/reply";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { updateReply, deleteReply } from "@/lib/api";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { formatDate } from "@/lib/format";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useSession } from "next-auth/react";
import AuthorLine from "@/components/AuthorLine";

type ReplyItemProps = {
  reply: Reply;
};

export default function ReplyItem({ reply }: ReplyItemProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!session) {
      return;
    }

    const updatedContent = String(
      new FormData(event.currentTarget).get("content"),
    );

    setIsSaving(true);
    setErrorMessage(null);

    try {
      await updateReply(reply.id, updatedContent, session.accessToken);
      setIsEditing(false);
      router.refresh();
    } catch {
      setErrorMessage("Reply could not be saved. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!session) {
      return;
    }
    const isConfirmed = window.confirm(
      "Do you really want to delete this reply?",
    );

    if (!isConfirmed) {
      return;
    }

    try {
      await deleteReply(reply.id, session.accessToken);
      router.refresh();
    } catch {
      window.alert("Reply could not be deleted. Please try again.");
    }
  }

  return (
    <article>
      <Card>
        <CardContent>
          {isEditing ? (
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor={`reply-${reply.id}`}>Edit reply</Label>
                <Textarea
                  id={`reply-${reply.id}`}
                  name="content"
                  required
                  maxLength={5000}
                  rows={4}
                  defaultValue={reply.content}
                />
              </div>

              {errorMessage && (
                <Alert variant="destructive">
                  <AlertTitle>Something went wrong</AlertTitle>
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2">
                <Button type="submit" size="sm" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <>
              <p className="whitespace-pre-line">{reply.content}</p>
              <time
                className="mt-2 block text-sm text-muted-foreground"
                dateTime={reply.createdAt}
              >
                {formatDate(reply.createdAt)}
              </time>
              <AuthorLine author={reply.author} />
              {/* Logged out: the reply stays visible, only the buttons are hidden */}
              {session && (
                <div className="mt-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDelete}
                  >
                    Delete
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </article>
  );
}

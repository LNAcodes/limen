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
import type { Category } from "@/types/category";
import { useSession } from "next-auth/react";

type EditThreadFormProps = {
  thread: Thread;
  categories: Category[];
};

export default function EditThreadForm({
  thread,
  categories,
}: EditThreadFormProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!session) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    const updatedThreadData = {
      title: String(formData.get("title")),
      content: String(formData.get("content")),
      categoryId: String(formData.get("categoryId")),
    };

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await updateThread(thread.id, updatedThreadData, session.accessToken);
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
        <Label htmlFor="category">Category</Label>
        <select
          id="category"
          name="categoryId"
          required
          className="rounded-md border px-3 py-2"
          defaultValue={thread.category?.id ?? ""}
        >
          <option value="">Choose a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
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

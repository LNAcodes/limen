"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { deleteCurrentUser } from "@/lib/api";

// Client component: reacts to typing and clicking.
// The user must type DELETE first, so the account is never deleted by accident.
export default function DeleteAccountSection() {
  const { data: session } = useSession();

  const [confirmationText, setConfirmationText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isConfirmed = confirmationText === "DELETE";

  async function handleDelete(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!session || !isConfirmed) {
      return;
    }

    setIsDeleting(true);
    setErrorMessage(null);

    try {
      await deleteCurrentUser(session.accessToken);
      // The account is gone, so the session must end too
      await signOut({ redirectTo: "/threads" });
    } catch {
      setErrorMessage("Your account could not be deleted. Please try again.");
      setIsDeleting(false);
    }
  }

  return (
    <section aria-labelledby="delete-account-heading">
      <Card>
        <CardContent className="flex flex-col gap-4">
          <h2 id="delete-account-heading" className="text-xl font-semibold">
            Delete account
          </h2>
          <p>
            Your account, name and email will be removed. Your threads and
            replies stay in the forum, so conversations still make sense, but
            they will be shown as written by &quot;Former member&quot;.
          </p>
          <p className="font-semibold">This cannot be undone.</p>

          <form onSubmit={handleDelete} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="confirm-delete">Type DELETE to confirm</Label>
              <Input
                id="confirm-delete"
                name="confirmDelete"
                value={confirmationText}
                onChange={(event) => setConfirmationText(event.target.value)}
                autoComplete="off"
                className="max-w-xs"
              />
            </div>

            {errorMessage && (
              <Alert variant="destructive">
                <AlertTitle>Something went wrong</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              variant="destructive"
              disabled={!isConfirmed || isDeleting}
              className="self-start"
            >
              {isDeleting ? "Deleting..." : "Delete my account"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}

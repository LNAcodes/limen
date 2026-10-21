"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

// Client component because signOut runs in the browser (it deletes the session cookie)
export default function LogoutButton() {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => signOut({ redirectTo: "/" })}
    >
      Log out
    </Button>
  );
}

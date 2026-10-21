"use-client";

// Own file because SessionProvider needs "use client", but layout.tsx should stay a Server Component.
// Wraps the whole app, so client components (e.g. ReplyItem) can call useSession()
// to find out who is logged in and read the access token.
import { SessionProvider } from "next-auth/react";

type ProvidersProps = {
  children: React.ReactNode;
};

// Makes the session available to all client components (useSession)
export default function Providers({ children }: ProvidersProps) {
  return <SessionProvider>{children}</SessionProvider>;
}

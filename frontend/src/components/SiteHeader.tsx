import Link from "next/link";
import { auth } from "@/auth";
import LogoutButton from "@/components/LogoutButton";

const headerLinkClasses =
  "rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2";

// Server component: reads the session directly, so the header knows who is logged in
export default async function SiteHeader() {
  const session = await auth();

  return (
    <header className="border-b">
      <div className="mx-auto flex w-full max-w-2xl items-center justify-between px-6 py-4 sm:px-8">
        <Link href="/" className="font-bold">
          Limen
        </Link>

        <nav aria-label="Main navigation" className="flex gap-4">
          <Link href="/threads">Threads</Link>

          {session ? (
            <>
              <Link href="/threads/new">New thread</Link>
              <span className="text-sm text-muted-foreground">
                {session.user.name}
              </span>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login">Log in</Link>
              <Link href="/register">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

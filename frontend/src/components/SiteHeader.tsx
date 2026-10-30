import Link from "next/link";
import { auth } from "@/auth";
import LogoutButton from "@/components/LogoutButton";

// Server component: reads the session directly, so the header knows who is logged in
export default async function SiteHeader() {
  const session = await auth();

  return (
    <header className="border-b">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4 sm:px-8">
        <Link href="/" className="font-bold">
          Limen
        </Link>

        {/* flex-wrap: on small screens the links move to the next line instead of overflowing */}
        <nav
          aria-label="Main navigation"
          className="flex flex-wrap items-center gap-4"
        >
          <Link href="/threads">Threads</Link>

          {session ? (
            <>
              <Link href="/threads/new">New thread</Link>
              <span className="text-sm text-muted-foreground">
                {session.user.name}
              </span>
              <Link href="/profile">Profile</Link>
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

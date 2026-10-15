import Link from "next/link";

const headerLinkClasses =
  "rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2";

export default function SiteHeader() {
  return (
    <header className="border-b">
      <div className="mx-auto flex w-full max-w-2xl items-center justify-between px-6 py-4 sm:px-8">
        <Link href="/" className="font-bold">
          Limen
        </Link>

        <nav aria-label="Main navigation" className="flex gap-4">
          <Link href="/threads">Threads</Link>
          <Link href="/threads/new">New thread</Link>
        </nav>
      </div>
    </header>
  );
}

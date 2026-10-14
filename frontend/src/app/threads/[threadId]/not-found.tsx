import Link from "next/link";

export default function ThreadNotFound() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold">Thread not found</h1>
      <p className="mt-4">This thread does not exist or has been deleted.</p>
      <Link href="/threads" className="mt-6 inline-block underline">
        Back to all threads
      </Link>
    </main>
  );
}

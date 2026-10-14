import Link from "next/link";
import CreateThreadForm from "@/components/CreatThreadForm";

export default function NewThreadPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <Link href="/threads" className="text-sm underline">
        Back to all threads
      </Link>

      <h1 className="mt-6 text-3xl font-bold">New thread</h1>

      <div className="mt-6">
        <CreateThreadForm />
      </div>
    </main>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import EditThreadForm from "@/components/EditThreadForm";
import { fetchOneThread } from "@/lib/api";

type EditThreadPageProps = {
  params: Promise<{ threadId: string }>;
};

export default async function EditThreadPage({ params }: EditThreadPageProps) {
  const { threadId } = await params;

  const currentThread = await fetchOneThread(threadId);

  if (!currentThread) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <Link href={`/threads/${threadId}`} className="text-sm underline">
        Back to thread
      </Link>

      <h1 className="mt-6 text-3xl font-bold">Edit thread</h1>

      <div className="mt-6">
        <EditThreadForm thread={currentThread} />
      </div>
    </main>
  );
}

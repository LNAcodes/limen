import BackLink from "@/components/BackLink";
import { notFound } from "next/navigation";
import EditThreadForm from "@/components/EditThreadForm";
import { fetchOneThread, fetchAllCategories } from "@/lib/api";

type EditThreadPageProps = {
  params: Promise<{ threadId: string }>;
};

export default async function EditThreadPage({ params }: EditThreadPageProps) {
  const { threadId } = await params;

  const currentThread = await fetchOneThread(threadId);

  if (!currentThread) {
    notFound();
  }

  const allCategories = await fetchAllCategories();

  return (
    <div className="mx-auto w-full max-w-2xl">
      <BackLink href={`/threads/${threadId}`} label="Back to thread" />

      <h1 className="mt-6 text-3xl font-bold">Edit thread</h1>

      <div className="mt-6">
        <EditThreadForm thread={currentThread} categories={allCategories} />
      </div>
    </div>
  );
}

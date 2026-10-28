import BackLink from "@/components/BackLink";
import CreateThreadForm from "@/components/CreateThreadForm";
import { fetchAllCategories } from "@/lib/api";

export default async function NewThreadPage() {
  const allCategories = await fetchAllCategories();

  return (
    <div className="mx-auto w-full max-w-2xl">
      <BackLink href="/threads" label="Back to all threads" />

      <h1 className="mt-6 text-3xl font-bold">New thread</h1>

      <div className="mt-6">
        <CreateThreadForm categories={allCategories} />
      </div>
    </div>
  );
}

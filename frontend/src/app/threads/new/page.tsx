import BackLink from "@/components/BackLink";
import CreateThreadForm from "@/components/CreatThreadForm";

export default function NewThreadPage() {
  return (
    <>
      <BackLink href="/threads" label="Back to all threads" />

      <h1 className="mt-6 text-3xl font-bold">New thread</h1>

      <div className="mt-6">
        <CreateThreadForm />
      </div>
    </>
  );
}

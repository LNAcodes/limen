import BackLink from "@/components/BackLink";

export default function ThreadNotFound() {
  return (
    <>
      <h1 className="text-3xl font-bold">Thread not found</h1>
      <p className="mt-4">This thread does not exist or has been deleted.</p>
      <div className="mt-6">
        <BackLink href="/threads" label="Back to all threads" />
      </div>
    </>
  );
}

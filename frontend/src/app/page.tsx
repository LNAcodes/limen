import { checkBackendHealth } from "@/lib/api";

export default async function Home() {
  const isBackendReachable = await checkBackendHealth();
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-4xl font-bold">Limen</h1>
      <p className="mt-2 text-lg">
        Cooperation platform for professionals in education and youth welfare
      </p>

      <p className="mt-6">
        {isBackendReachable ? "Backend reachable" : "Backend not reachable"}
      </p>
    </main>
  );
}

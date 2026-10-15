import { checkBackendHealth } from "@/lib/api";
import Link from "next/link";

export default async function Home() {
  const isBackendReachable = await checkBackendHealth();
  return (
    <>
      <h1 className="text-4xl font-bold">Limen</h1>
      <p className="mt-2 text-lg">
        Cooperation platform for professionals in education and youth welfare
      </p>

      <p className="mt-6">
        {isBackendReachable ? "Backend reachable" : "Backend not reachable"}
      </p>
      <Link href="/threads" className="mt-6 inline-block underline">
        View all threads
      </Link>
    </>
  );
}

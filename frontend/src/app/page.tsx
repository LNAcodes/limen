import { auth } from "@/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Home() {
  // Inside the component: runs on every visit, so we always know who is logged in right now
  const session = await auth();

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <h1 className="text-4xl font-bold tracking-tight">Limen</h1>
      <p className="text-lg text-muted-foreground">
        Cooperation platform for professionals in education and youth welfare
      </p>
      <p>
        Teachers, school social workers, daycare staff and youth welfare
        professionals share how they organize cooperation: transitions,
        meetings, responsibilities.
      </p>
      <p className="rounded-xl border bg-card p-4 text-sm text-muted-foreground">
        Limen is for structures, not cases. Please never share details that
        identify a child or family.
      </p>
      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/threads">View threads</Link>
        </Button>
        {/* Logged out only: invite visitors to join */}
        {!session && (
          <Button asChild variant="outline">
            <Link href="/register">Create account</Link>
          </Button>
        )}
      </div>
    </div>
  );
}

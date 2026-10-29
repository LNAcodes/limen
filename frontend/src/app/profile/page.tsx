import { auth } from "@/auth";
import { getCurrentUser } from "@/lib/api";
import { getProfessionalFieldLabel } from "@/lib/professional-fields";
import { Card, CardContent } from "@/components/ui/card";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await auth();

  // Only logged-in users have a profile, everyone else goes to the login page
  if (!session) {
    redirect("/login");
  }

  const currentUser = await getCurrentUser(session.accessToken);

  // Example: "October 2026"
  const memberSince = new Date(currentUser.createdAt).toLocaleDateString(
    "en-GB",
    { month: "long", year: "numeric" },
  );

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Your profile</h1>

      <Card>
        <CardContent className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold">Account details</h2>

          {/* Description list: each term (dt) has its value (dd) */}
          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3">
            <dt className="text-muted-foreground">Name</dt>
            <dd>{currentUser.name}</dd>

            <dt className="text-muted-foreground">Email</dt>
            <dd className="break-all">{currentUser.email}</dd>

            <dt className="text-muted-foreground">Professional field</dt>
            <dd>{getProfessionalFieldLabel(currentUser.professionalField)}</dd>

            <dt className="text-muted-foreground">Member since</dt>
            <dd>{memberSince}</dd>
          </dl>

          <p className="text-sm text-muted-foreground">
            Your email is only visible to you. Other members see your name and
            professional field.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

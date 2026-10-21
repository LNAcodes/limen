"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { registerUser } from "@/lib/api";
import { professionalFieldOptions } from "@/lib/professional-fields";

export default function RegisterForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const registrationData = {
      name: String(formData.get("name")),
      email: String(formData.get("email")),
      password: String(formData.get("password")),
      professionalField: String(formData.get("professionalField")),
    };

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await registerUser(registrationData);

      // Log in right away with the same data, then go to the thread list
      await signIn("credentials", {
        email: registrationData.email,
        password: registrationData.password,
        redirectTo: "/threads",
      });
    } catch (error) {
      if (error instanceof Error && error.message === "EMAIL_TAKEN") {
        setErrorMessage("This email is already registered.");
      } else {
        setErrorMessage("Registration failed. Please try again.");
      }
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" required maxLength={100} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          minLength={12}
          maxLength={72}
          aria-describedby="password-hint"
        />
        <p id="password-hint" className="text-sm text-muted-foreground">
          At least 12 characters
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="professionalField">Professional field</Label>
        <select
          id="professionalField"
          name="professionalField"
          required
          className="rounded-md border px-3 py-2"
        >
          <option value="">Choose your field</option>
          {professionalFieldOptions.map((fieldOption) => (
            <option key={fieldOption.value} value={fieldOption.value}>
              {fieldOption.label}
            </option>
          ))}
        </select>
      </div>

      {errorMessage && (
        <Alert variant="destructive">
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating account..." : "Create account"}
      </Button>
    </form>
  );
}

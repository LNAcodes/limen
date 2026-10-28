import Link from "next/link";
import RegisterForm from "@/components/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="mx-auto w-full max-w-2xl">
      <h1 className="text-3xl font-bold">Create account</h1>

      <div className="mt-6">
        <RegisterForm />
      </div>

      <p className="mt-6 text-sm">
        Already have an account?{" "}
        <Link href="/login" className="underline">
          Log in
        </Link>
      </p>
    </div>
  );
}

import Link from "next/link";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <>
      <h1 className="text-3xl font-bold">Log in</h1>

      <div className="mt-6">
        <LoginForm />
      </div>

      <p className="mt-6 text-sm">
        No account yet?{" "}
        <Link href="/register" className="underline">
          Register
        </Link>
      </p>
    </>
  );
}

import Link from "next/link";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata = {
  title: "Create Account | ComputerHub",
  description: "Create your ComputerHub customer account.",
};

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-lg">
          {/* Logo / Brand */}
          <div className="mb-8 text-center">
            <Link
              href="/"
              className="inline-block text-3xl font-extrabold tracking-tight text-blue-600"
            >
              ComputerHub
            </Link>

            <h1 className="mt-5 text-2xl font-bold text-gray-900">
              Create your account
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Join ComputerHub and start shopping for technology
            </p>
          </div>

          {/* Register Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <RegisterForm />
          </div>

          {/* Login Link */}
          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-blue-600 transition hover:text-blue-700"
            >
              Login
            </Link>
          </div>

          {/* Back Home */}
          <div className="mt-4 text-center">
            <Link
              href="/"
              className="text-sm font-medium text-gray-500 transition hover:text-blue-600"
            >
              ← Back to ComputerHub
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
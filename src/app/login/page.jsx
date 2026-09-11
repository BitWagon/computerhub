import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";

export const metadata = {
  title: "Login | ComputerHub",
  description: "Login to your ComputerHub account.",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Logo / Brand */}
          <div className="mb-8 text-center">
            <Link
              href="/"
              className="inline-block text-3xl font-extrabold tracking-tight text-blue-600"
            >
              ComputerHub
            </Link>

            <h1 className="mt-5 text-2xl font-bold text-gray-900">
              Welcome back
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Login to your ComputerHub account
            </p>
          </div>

          {/* Login Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <LoginForm />
          </div>

          {/* Register Link */}
          <div className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-blue-600 transition hover:text-blue-700"
            >
              Create an account
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
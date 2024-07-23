"use client";

import { useRouter } from "next/navigation";

export default function RateLimitErrorPage() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-bl from-primary-50 to-secondary-50 p-3">
      <article className="container mx-auto max-w-3xl">
        <h1 className="mb-6 text-center text-2xl font-bold uppercase tracking-wide text-slate-800">
          You have reached the rate limit
        </h1>

        <p className="mb-6 text-center text-lg text-slate-800">
          Please wait a few minutes before trying again
        </p>

        <button
          className="btn-primary btn mx-auto block"
          onClick={() => router.replace("/")}
        >
          Go back to prompt
        </button>
      </article>
    </main>
  );
}

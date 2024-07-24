"use client";

import { useRouter } from "next/navigation";
import PromptInput from "./prompt-input";
import { MAX_CONTENT_LENGTH } from "~/constants";
import { useRef, useState } from "react";

export default function HomePage() {
  const router = useRouter();
  const promptInputRef = useRef<HTMLInputElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const submitPrompt = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const prompt = promptInputRef.current?.value.slice(0, MAX_CONTENT_LENGTH);
    router.push(`/generate/${prompt}`);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-bl from-primary-50 to-secondary-50 p-3">
      <article className="container mx-auto max-w-3xl">
        <h1 className="mb-6 text-center text-2xl uppercase tracking-wide text-slate-800">
          Generate a webpage based on a short description
        </h1>

        <form onSubmit={submitPrompt}>
          <PromptInput
            ref={promptInputRef}
            maxLength={MAX_CONTENT_LENGTH}
            pending={submitting}
          />
        </form>
      </article>
    </main>
  );
}

import { redirect } from "next/navigation";
import PromptInput from "./prompt-input";
import { MAX_CONTENT_LENGTH } from "~/constants";

export default function HomePage() {
  const submitPrompt = async (formData: FormData) => {
    "use server";
    const prompt = (formData.get("prompt")?.toString() ?? "").slice(
      0,
      MAX_CONTENT_LENGTH,
    );

    redirect(`/generate/${prompt}`);
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-bl from-primary-50 to-secondary-50 p-3">
      <article className="container mx-auto max-w-3xl">
        <h1 className="mb-6 text-center text-2xl uppercase tracking-wide text-slate-800">
          Generate a webpage based on a short description
        </h1>

        <form action={submitPrompt}>
          <PromptInput maxLength={MAX_CONTENT_LENGTH} />
        </form>
      </article>
    </main>
  );
}

import OpenAI from "openai";
import { type CSSProperties, Suspense } from "react";
import { env } from "~/env.js";
import { LLM_RESPONSE_HTML_ELEMENT_ID, MAX_CONTENT_LENGTH } from "~/constants";
import { RateLimit } from "~/app/rate-limit";
import LlmResponseContentPieceRenderer from "./_components/llm-response-content-piece-renderer";
import { LlmResponseContentProvider } from "./_components/llm-response-content-context";
import { callLlm } from "~/server/llm";

// export const dynamic = "force-static";

type GeneratorProps = {
  params: {
    prompt: string;
  };
};

const LlmResponse = async ({
  iterator,
  first = false,
}: {
  iterator: AsyncIterator<
    OpenAI.Chat.Completions.ChatCompletionChunk,
    unknown,
    undefined
  >;
  first?: boolean;
}) => {
  const value = await iterator.next();

  if (value.done) {
    return <></>;
  }

  const content = value.value.choices[0]?.delta?.content ?? "";

  const context = (
    <>
      <LlmResponseContentPieceRenderer content={content} />
      <LlmResponse iterator={iterator} />
    </>
  );

  if (first) {
    return context;
  }

  return <Suspense fallback={<></>}>{context}</Suspense>;
};

const LlmCaller = async ({ prompt }: { prompt: string }) => {
  const response = await callLlm(prompt);

  return (
    <LlmResponseContentProvider>
      <div id={LLM_RESPONSE_HTML_ELEMENT_ID} />
      <LlmResponse iterator={response} first />
    </LlmResponseContentProvider>
  );
};

export default function GeneratorPage({ params: { prompt } }: GeneratorProps) {
  prompt = prompt.slice(0, MAX_CONTENT_LENGTH);
  return (
    <Suspense
      fallback={
        <div className="flex h-dvh w-dvw items-center justify-center">
          <div className="flex flex-col">
            <div
              className="radial-progress m-auto animate-spin"
              style={{ "--progress": "25%" } as CSSProperties}
            />
            Generating your webpage...
          </div>
        </div>
      }
    >
      <RateLimit>
        <div className="flex h-dvh w-dvw flex-col">
          <div className="flex w-full flex-initial items-center gap-2 bg-[#ffcc00] p-3 text-base text-gray-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-20 md:size-10"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
              />
            </svg>
            This project is a fun tool for generating content. Keep in mind that
            LLMs are known for making details up. Take the info with a pinch of
            salt
          </div>
          <div className="flex-1 overflow-auto">
            <LlmCaller prompt={prompt} />
          </div>
        </div>
      </RateLimit>
    </Suspense>
  );
}

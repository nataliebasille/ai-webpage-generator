import OpenAI from "openai";
import { type CSSProperties, Suspense } from "react";
import { env } from "~/env.js";
import { LLM_RESPONSE_HTML_ELEMENT_ID, MAX_CONTENT_LENGTH } from "~/constants";
import { RateLimit } from "~/app/rate-limit";
import LlmResponseContentPieceRenderer from "./_components/llm-response-content-piece-renderer";
import { LlmResponseContentProvider } from "./_components/llm-response-content-context";

export const dynamic = "force-static";

type GeneratorProps = {
  params: {
    prompt: string;
  };
};

const client = new OpenAI({ apiKey: env.OPENAI_API_KEY });

const LlmResponse = async ({
  iterator,
}: {
  iterator: AsyncIterator<
    OpenAI.Chat.Completions.ChatCompletionChunk,
    unknown,
    undefined
  >;
}) => {
  const value = await iterator.next();

  if (value.done) {
    return <></>;
  }

  const content = value.value.choices[0]?.delta?.content ?? "";

  return (
    <>
      <LlmResponseContentPieceRenderer content={content} />
      <Suspense fallback={<></>}>
        <LlmResponse iterator={iterator} />
      </Suspense>
    </>
  );
};

const LlmCaller = async ({ prompt }: { prompt: string }) => {
  const stream = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 1.2,
    stream: true,
    max_tokens: 6000,
    messages: [
      {
        role: "system",
        content: `
            You are a world class web developer. You're job is to produce an interesting and
            creative HTML doc for a user based on their prompt. 
            The HTML will be embedded into a webpage so it needs to be valid HTML.
            
            You must adhere to the following rules:
            1. For the html, the first element must be a <div> tag.
            2. The webpage must be responsive and have a modern design.
            3. Do not wrap the response in markup 
            4. You can use tailwindcss for styling. 
            5. Generate a color scheme that is relevant to the user's prompt
            6. You are not allowed to generate any javascript code or script tags.
            7. If the users prompt contains any dangerous or illegal content,
                the page should reprimand the user rather than displaying the content
            8. Do not generate a copyright notice 
            9. Must generate a response long enough so the page scrolls
            10. Must include 3 or more sections of information
            11. Do not include any information about the technology used to create the webpage
        `,
      },
      {
        role: "user",
        content: `My prompt is: ${prompt}`,
      },
    ],
  });

  const asyncIterator = stream[Symbol.asyncIterator]();

  return (
    <LlmResponseContentProvider>
      <div id={LLM_RESPONSE_HTML_ELEMENT_ID} />
      <LlmResponse iterator={asyncIterator} />
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

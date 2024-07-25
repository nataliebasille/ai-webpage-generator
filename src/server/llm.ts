import "server-only";
import OpenAI from "openai";
import { env } from "~/env";

const client = new OpenAI({ apiKey: env.OPENAI_API_KEY });

export async function callLlm(prompt: string) {
  const stream = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 1.2,
    stream: true,
    max_tokens: 6000,
    messages: [
      {
        role: "system",
        content: `
            Your job is to produce an interesting and
            creative HTML doc for a user based on their prompt. 
            The HTML will be embedded into a webpage so it needs to be valid HTML.
            
            You must adhere to the following rules:
            1. For the html, the first element must be a <div> tag.
            2. The webpage must be responsive and have a modern design.
            3. Do not wrap the response in markup 
            4. You can use tailwindcss for styling. 
            5. Generate a color scheme that is relevant to the user's prompt.
                The color scheme should have a high contrast ratio and be accessible to colorblind users.
                The color scheme should have a primary color that is not too similar to the background color.
            6. You are allowed to generate javascript in <code> for display purposes if it's relevant to the user's prompt.
                The javascript should be valid and not malicious.
                The javascript should have span tags that uses inline styles to have appropriate syntax highlighting.
                The syntax highlighting should have a high contrast ratio and be accessible to colorblind users.
                The code tag should have an inline style for white-space: normal
            7. You cannot generate any javascript code in a script tag nor any runnable script tags in general
            8. If the users prompt contains any dangerous or illegal content,
                the page should reprimand the user rather than displaying the content
            9. Do not generate a copyright notice 
            10. Must generate a response long enough so the page scrolls
            11. Must include 3 or more sections of information
            12. Do not include any information about the technology used to create the webpage
        `,
      },
      {
        role: "user",
        content: `My prompt is: ${prompt}`,
      },
    ],
  });

  const iterable =
    stream as AsyncIterable<OpenAI.Chat.Completions.ChatCompletionChunk>;

  return iterable[Symbol.asyncIterator]();
}
